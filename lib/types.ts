export interface Person {
  id: string;
  name: string;
  birthYear?: number | null;
  deathYear?: number | null;
  parentId?: string | null;
  spouseIds?: string[];
  childIds?: string[];
}

export interface FamilyTree {
  people: Record<string, Person>;
  rootIds: string[];
}

export interface PositionedNode extends Person {
  depth: number;
}
