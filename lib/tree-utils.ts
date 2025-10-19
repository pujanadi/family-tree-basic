import type { RawNodeDatum } from "react-d3-tree";
import type { FamilyTree, Person } from "./types";

export interface FamilyNodeDatum extends RawNodeDatum {
  id: string;
  person: Person;
  spouses: Person[];
  hasChildren: boolean;
  depth: number;
}

type Nullable<T> = T | null;

export function buildFamilyTreeData(
  tree: FamilyTree,
  collapsedIds: Set<string>
): FamilyNodeDatum[] {
  return tree.rootIds
    .map((rootId) => buildNode(tree, rootId, 0, collapsedIds, new Set<string>()))
    .filter((node): node is FamilyNodeDatum => Boolean(node));
}

function buildNode(
  tree: FamilyTree,
  personId: string,
  depth: number,
  collapsedIds: Set<string>,
  path: Set<string>
): Nullable<FamilyNodeDatum> {
  const person = tree.people[personId];

  if (!person || path.has(personId)) {
    return null;
  }

  path.add(personId);

  const spouseIds = person.spouseIds ?? [];
  const spouses = spouseIds
    .map((id) => tree.people[id])
    .filter((entry): entry is Person => Boolean(entry));

  const childIds = person.childIds ?? [];
  const childNodes = childIds
    .map((childId) => buildNode(tree, childId, depth + 1, collapsedIds, new Set(path)))
    .filter((node): node is FamilyNodeDatum => Boolean(node));

  const hasChildren = childNodes.length > 0;
  const isCollapsed = collapsedIds.has(personId);

  const node: FamilyNodeDatum = {
    id: person.id,
    name: person.name,
    attributes: {
      birth: person.birthYear ? `${person.birthYear}` : undefined,
      death: person.deathYear ? `${person.deathYear}` : undefined
    },
    children: !isCollapsed && hasChildren ? childNodes : undefined,
    person,
    spouses,
    hasChildren,
    depth
  };

  path.delete(personId);

  return node;
}

export function flattenPeople(tree: FamilyTree): Person[] {
  return Object.values(tree.people).sort((a, b) =>
    a.name.localeCompare(b.name, "en")
  );
}

export function findAncestors(tree: FamilyTree, personId: string): string[] {
  const ancestors = new Set<string>();
  const visited = new Set<string>();

  const traverse = (targetId: string) => {
    if (visited.has(targetId)) {
      return;
    }
    visited.add(targetId);

    Object.values(tree.people).forEach((candidate) => {
      if (candidate.childIds?.includes(targetId)) {
        ancestors.add(candidate.id);
        candidate.spouseIds?.forEach((spouseId) => ancestors.add(spouseId));
        traverse(candidate.id);
      }
    });
  };

  traverse(personId);

  ancestors.delete(personId);

  return Array.from(ancestors);
}

export function getPersonWithRelations(tree: FamilyTree, id: string) {
  const person = tree.people[id];
  if (!person) {
    return null;
  }

  const spouses =
    person.spouseIds
      ?.map((spouseId) => tree.people[spouseId])
      .filter((entry): entry is Person => Boolean(entry)) ?? [];

  const children =
    person.childIds
      ?.map((childId) => tree.people[childId])
      .filter((entry): entry is Person => Boolean(entry)) ?? [];

  return { person, spouses, children };
}

export function searchPeople(tree: FamilyTree, query: string): Person[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  return flattenPeople(tree).filter((person) =>
    person.name.toLowerCase().includes(normalized)
  );
}
