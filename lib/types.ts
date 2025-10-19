export interface Person {
  id: string;
  name: string;
  birthYear?: number | null;
  deathYear?: number | null;
  spouseIds?: string[];
  childIds?: string[];
}

export interface FamilyTree {
  people: Record<string, Person>;
  rootIds: string[];
}

export interface PositionedNode extends Person {
  depth: number;
  parentId?: string;
}
