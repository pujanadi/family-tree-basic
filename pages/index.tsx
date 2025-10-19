import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import TreeCanvas, { type TreeCanvasHandle } from "@/components/TreeCanvas";
import Toolbar from "@/components/Toolbar";
import type { FamilyTree } from "@/lib/types";
import sampleTree from "@/data/sample.json";
import { flattenPeople, searchPeople } from "@/lib/tree-utils";

const SAMPLE_TREE = sampleTree as FamilyTree;

const HomePage = () => {
  const [tree] = useState<FamilyTree>(SAMPLE_TREE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const treeCanvasRef = useRef<TreeCanvasHandle>(null);

  const people = useMemo(() => flattenPeople(tree), [tree]);
  const searchResults = useMemo(
    () => (searchQuery.trim() ? searchPeople(tree, searchQuery).slice(0, 8) : []),
    [tree, searchQuery]
  );

  useEffect(() => {
    if (tree.rootIds.length > 0) {
      const rootId = tree.rootIds[0];
      setSelectedId(rootId);
      setHighlightedId(rootId);
    }
  }, [tree]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    const timeout = window.setTimeout(() => setToastMessage(null), 2400);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const focusOnPerson = (id: string) => {
    treeCanvasRef.current?.revealAncestors(id);
    window.requestAnimationFrame(() => {
      treeCanvasRef.current?.focusNode(id);
    });
  };

  const handleSelectPerson = (id: string) => {
    setSelectedId(id);
    setHighlightedId(id);
    focusOnPerson(id);
  };

  const handleSearchSelect = (id: string) => {
    handleSelectPerson(id);
    setSearchQuery("");
  };

  const handleExport = async () => {
    try {
      const dataUrl = await treeCanvasRef.current?.exportAsImage();
      if (!dataUrl) {
        throw new Error("Unable to export tree");
      }
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `family-tree-${Date.now()}.png`;
      link.click();
      setToastMessage("Tree exported as PNG");
    } catch (error) {
      console.error(error);
      setToastMessage("Export failed. Please try again.");
    }
  };

  const handleResetView = () => {
    const rootId = tree.rootIds[0];
    if (rootId) {
      handleSelectPerson(rootId);
    }
  };

  return (
    <>
      <Head>
        <title>Family Tree Explorer</title>
        <meta name="description" content="Interactive family tree explorer with export and theme controls." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-soft-sand-100 via-white to-misty-teal-50 pb-16 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 pt-10">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-misty-teal-500 dark:text-misty-teal-300">
              Family Atlas
            </p>
            <h1 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">
              Explore your family tree with calm clarity
            </h1>
            <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Search, zoom, and highlight relatives with a soothing theme that adapts to your surroundings. Export your
              current view as a PNG snapshot to share with family members.
            </p>
          </div>

          <Toolbar
            query={searchQuery}
            onQueryChange={setSearchQuery}
            results={searchResults}
            onSelectResult={handleSearchSelect}
            onExport={handleExport}
            onResetView={handleResetView}
          />

          <section className="h-[65vh] min-h-[500px] rounded-[2.5rem] border border-slate-200/50 bg-white/60 p-4 shadow-lg backdrop-blur dark:border-slate-700/40 dark:bg-slate-900/70 sm:h-[70vh]">
            <TreeCanvas
              ref={treeCanvasRef}
              tree={tree}
              selectedId={selectedId}
              highlightedId={highlightedId}
              onSelect={handleSelectPerson}
            />
          </section>
        </main>

        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform">
            <div className="rounded-full border border-misty-teal-200 bg-white/90 px-6 py-3 text-sm font-medium text-misty-teal-700 shadow-ambient dark:border-misty-teal-500/40 dark:bg-slate-900/90 dark:text-misty-teal-200">
              {toastMessage}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
