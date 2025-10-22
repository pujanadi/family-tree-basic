import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react";
import dynamic from "next/dynamic";
import { toPng } from "html-to-image";
import type { CustomNodeElementProps } from "react-d3-tree";
import type { FamilyTree } from "@/lib/types";
import { buildFamilyTreeData, findAncestors } from "@/lib/tree-utils";
import type { FamilyNodeDatum } from "@/lib/tree-utils";
import PersonNode from "./PersonNode";
import EdgeDefs from "./Edge";

const Tree = dynamic(() => import("react-d3-tree").then((mod) => mod.default), {
  ssr: false
});

export interface TreeCanvasHandle {
  focusNode: (id: string) => void;
  exportAsImage: () => Promise<string>;
  revealAncestors: (id: string) => void;
}

interface TreeCanvasProps {
  tree: FamilyTree;
  selectedId?: string | null;
  highlightedId?: string | null;
  onSelect?: (id: string) => void;
}

interface Size {
  width: number;
  height: number;
}

const INITIAL_SIZE: Size = { width: 0, height: 0 };

const NODE_WIDTH = 280;
const NODE_HEIGHT = 180;

const TreeCanvas = forwardRef<TreeCanvasHandle, TreeCanvasProps>(
  ({ tree, selectedId, highlightedId, onSelect }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
    const [size, setSize] = useState<Size>(INITIAL_SIZE);
    const [translate, setTranslate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isReady, setIsReady] = useState(false);
    const [zoom, setZoom] = useState(0.8);
    const nodeRefs = useRef(new Map<string, HTMLDivElement>());
    const highlightTimeouts = useRef(new Map<string, number>());
    const pendingFocusId = useRef<string | null>(null);

    useEffect(() => {
      if (typeof window === "undefined") {
        return;
      }

      const win = window as typeof window & {
        requestIdleCallback?: (cb: () => void) => number;
        cancelIdleCallback?: (handle: number) => void;
      };

      let idleHandle: number | null = null;
      let timeoutHandle: number | null = null;

      if (typeof win.requestIdleCallback === "function") {
        idleHandle = win.requestIdleCallback(() => setIsReady(true));
      } else {
        timeoutHandle = window.setTimeout(() => setIsReady(true), 60);
      }

      return () => {
        if (idleHandle !== null && typeof win.cancelIdleCallback === "function") {
          win.cancelIdleCallback(idleHandle);
        }
        if (timeoutHandle !== null) {
          window.clearTimeout(timeoutHandle);
        }
      };
    }, [tree]);

    useEffect(() => {
      if (!containerRef.current || typeof ResizeObserver === "undefined") {
        return;
      }

      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          setSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height
          });
        }
      });

      observer.observe(containerRef.current);

      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      if (!size.width || !size.height) {
        return;
      }
      setTranslate({
        x: size.width / 2,
        y: 120
      });
    }, [size]);

    const data = useMemo(() => buildFamilyTreeData(tree, collapsedIds), [tree, collapsedIds]);

    const handleToggle = useCallback((id: string) => {
      setCollapsedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    }, []);

    const revealAncestors = useCallback(
      (id: string) => {
        setCollapsedIds((prev) => {
          const next = new Set(prev);
          const ancestors = findAncestors(tree, id);
          ancestors.forEach((ancestorId) => next.delete(ancestorId));
          next.delete(id);
          return next;
        });
      },
      [tree]
    );

    const handleSelect = useCallback(
      (id: string) => {
        revealAncestors(id);
        onSelect?.(id);
      },
      [onSelect, revealAncestors]
    );

    const handleTreeUpdate = useCallback(
      (payload: { translate?: { x: number; y: number }; zoom?: number }) => {
        if (payload?.translate) {
          setTranslate((prev) => {
            const next = payload.translate!;
            if (Math.abs(prev.x - next.x) < 0.5 && Math.abs(prev.y - next.y) < 0.5) {
              return prev;
            }
            return next;
          });
        }
        if (typeof payload?.zoom === "number") {
          setZoom((prev) => (Math.abs(prev - payload.zoom!) < 0.0001 ? prev : payload.zoom!));
        }
      },
      []
    );

    useEffect(
      () => () => {
        highlightTimeouts.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
        highlightTimeouts.current.clear();
      },
      []
    );

    const applyHighlight = useCallback(
      (id: string, element: HTMLDivElement) => {
        const existingTimeout = highlightTimeouts.current.get(id);
        if (existingTimeout) {
          window.clearTimeout(existingTimeout);
        }

        element.classList.add("ring-4", "ring-misty-teal-300", "ring-offset-2", "ring-offset-white", "dark:ring-offset-slate-900");

        const timeoutId = window.setTimeout(() => {
          element.classList.remove("ring-4", "ring-misty-teal-300", "ring-offset-2", "ring-offset-white", "dark:ring-offset-slate-900");
          highlightTimeouts.current.delete(id);
        }, 1200);

        highlightTimeouts.current.set(id, timeoutId);
      },
      []
    );

    const attemptFocus = useCallback(
      (id: string) => {
        const container = containerRef.current;
        const element = nodeRefs.current.get(id);

        if (!container || !element) {
          return false;
        }

        const containerRect = container.getBoundingClientRect();
        if (containerRect.width === 0 || containerRect.height === 0) {
          return false;
        }
        const nodeRect = element.getBoundingClientRect();
        const nodeCenterX = nodeRect.left + nodeRect.width / 2;
        const nodeCenterY = nodeRect.top + nodeRect.height / 2;
        const containerCenterX = containerRect.left + containerRect.width / 2;
        const containerCenterY = containerRect.top + containerRect.height / 2;

        const offsetX = containerCenterX - nodeCenterX;
        const offsetY = containerCenterY - nodeCenterY;
        const needsRetry = Math.abs(offsetX) > 2 || Math.abs(offsetY) > 2;

        if (needsRetry) {
          setTranslate((prev) => ({
            x: prev.x + offsetX,
            y: prev.y + offsetY
          }));
          pendingFocusId.current = id;
        } else {
          pendingFocusId.current = null;
        }

        applyHighlight(id, element);
        return !needsRetry;
      },
      [applyHighlight]
    );

    const focusNode = useCallback(
      (id: string) => {
        pendingFocusId.current = id;
        window.requestAnimationFrame(() => {
          attemptFocus(id);
        });
      },
      [attemptFocus]
    );

    useEffect(() => {
      if (!pendingFocusId.current) {
        return;
      }
      window.requestAnimationFrame(() => {
        if (pendingFocusId.current) {
          attemptFocus(pendingFocusId.current);
        }
      });
    }, [attemptFocus, data, size, translate]);

    const exportAsImage = useCallback(async () => {
      if (!containerRef.current) {
        throw new Error("Tree container not available");
      }

      const mode = document.documentElement.dataset.mode ?? "light";
      const backgroundColor = mode === "dark" ? "#020617" : "#fbf8f4";

      return toPng(containerRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor
      });
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        focusNode,
        exportAsImage,
        revealAncestors
      }),
      [focusNode, exportAsImage, revealAncestors]
    );

    const renderNode = useCallback(
      ({ nodeDatum }: CustomNodeElementProps) => {
        const familyNode = nodeDatum as unknown as FamilyNodeDatum;
        const personId = familyNode.person.id;
        const isSelected = selectedId === personId;
        const isHighlighted = highlightedId === personId;
        const isCollapsed = collapsedIds.has(personId);

        return (
          <foreignObject width={NODE_WIDTH} height={NODE_HEIGHT} x={-NODE_WIDTH / 2} y={-NODE_HEIGHT / 2}>
            <PersonNode
              ref={(element) => {
                if (element) {
                  nodeRefs.current.set(personId, element);
                  if (pendingFocusId.current === personId) {
                    window.requestAnimationFrame(() => attemptFocus(personId));
                  }
                } else {
                  nodeRefs.current.delete(personId);
                }
              }}
              node={familyNode}
              isSelected={!!isSelected}
              isHighlighted={!!isHighlighted}
              isCollapsed={isCollapsed}
              onToggle={handleToggle}
              onSelect={handleSelect}
            />
          </foreignObject>
        );
      },
      [attemptFocus, collapsedIds, handleSelect, handleToggle, highlightedId, selectedId]
    );

    if (!isReady) {
      return (
        <div ref={containerRef} className="relative h-full w-full overflow-hidden rounded-3xl bg-gradient-to-b from-soft-sand-100 via-soft-sand-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 animate-pulse rounded-full bg-misty-teal-200/70 dark:bg-misty-teal-500/30" />
          </div>
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        className="relative h-full w-full overflow-auto rounded-3xl bg-gradient-to-b from-soft-sand-100 via-soft-sand-50 to-white p-6 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"
      >
        <EdgeDefs />
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-500 dark:text-slate-400">
            No family data provided.
          </div>
        ) : (
          <Tree
            data={data}
            translate={translate}
            zoom={zoom}
            zoomable
            enableLegacyTransitions={false}
            transitionDuration={300}
            nodeSize={{ x: NODE_WIDTH + 60, y: NODE_HEIGHT + 40 }}
            separation={{ siblings: 1.25, nonSiblings: 1.5 }}
            orientation="vertical"
            renderCustomNodeElement={renderNode}
            collapsible={false}
            pathFunc="step"
            pathClassFunc={() => "family-edge"}
            scaleExtent={{ min: 0.4, max: 2 }}
            onUpdate={handleTreeUpdate}
          />
        )}
      </div>
    );
  }
);

TreeCanvas.displayName = "TreeCanvas";

export default TreeCanvas;

