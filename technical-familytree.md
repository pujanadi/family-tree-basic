(## Member management — page idea and technical spec)

This section describes a proposed page and associated APIs for managing people in a family tree: creating new members, editing existing members, adding a member into the tree (attach as child/spouse/parent), and deleting members.

### Purpose

Provide backoffice users (admins) with a single, focused interface to manage Person records and their relationships within a family tree. The UI should be simple, accessible, and optimistic where reasonable. All operations must be authenticated and authorized.

### Page overview

- Route: `/backoffice/trees/[treeId]/members` (or a modal within the existing tree UI)
- Layout: reuse existing `BackofficeLayout` and `TopBar`/`SideNav` components.
- Main sections:
	- Member list (searchable) — left pane
	- Member detail / edit form — right pane
	- Quick actions: Create member, Add to tree, Delete

### Data shapes

Use the existing `Person` type in `lib/types.ts` as the canonical shape. Example:

```
Person {
	id: string;
	name: string;
	birthYear?: number | null;
	deathYear?: number | null;
	spouseIds?: string[];
	childIds?: string[];
}
```

Requests/Responses

- GET /api/admin/trees/:treeId/people?search=... -> { people: Person[] }
- POST /api/admin/trees/:treeId/people -> { person: Person }
	- Body: { name, birthYear?, deathYear?, spouseIds?: string[], childIds?: string[] }
- PUT /api/admin/trees/:treeId/people/:personId -> { person: Person }
	- Body: partial Person fields to update
- POST /api/admin/trees/:treeId/people/:personId/attach -> { person: Person }
	- Body: { relation: 'child'|'spouse'|'parent', targetId: string }
- DELETE /api/admin/trees/:treeId/people/:personId -> { ok: boolean }

Notes:
- The attach endpoint is a convenience endpoint that will update both affected Person records atomically on the server (e.g., adding childId to parent and setting parent reference on child if a parent field exists). If the backend storage doesn't support transactions, implement compensating actions and return meaningful error states.

### UI details

- Member list
	- Paginated/searchable.
	- Each row: avatar (initials), name, years, quick action icons (edit, add-to-tree, delete).

- Member form (edit/create)
	- Fields: Name (required), Birth year (optional numeric), Death year (optional numeric), Spouses (multi-select), Children (multi-select), Notes (optional textarea).
	- Validation: name required; years numeric and birthYear <= deathYear when both present.
	- Autosave: optional toggle — use optimistic updates for small edits, but require explicit save for critical relationship changes.

- Add-to-tree flow
	- Modal that lets admin place an existing Person into a selected tree position or create a new Person and attach.
	- Options: Attach as child of selected node, attach as spouse to selected node, attach as parent (prepend) to selected node.
	- Preview relationships before confirm.

- Delete flow
	- Soft-delete by default (mark person as archived) with hard-delete as a separate action.
	- Warn when deleting a person with relationships; show a summary of impacted nodes (spouses, children).
	- If hard delete is chosen, cascade rules: either reparent children to 'unknown' or prevent delete unless relationships removed. Require a confirmation text input (e.g., enter person's full name) to confirm destructive actions.

### Frontend contract

- Inputs:
	- treeId: string
	- initialPeople?: Person[] (prefetch on page load)
- Outputs:
	- CRUD operations over API endpoints listed above
	- Events: onPersonCreated(person), onPersonUpdated(person), onPersonDeleted(personId)

### Authentication & Authorization

- Only authenticated admin users may access these routes and API endpoints. Reuse existing auth middleware/context (`lib/auth-context.tsx`) and NextAuth session checks.
- Server-side checks for every write operation that the session user belongs to the appropriate tenant and has admin privileges.

### Validation & Error handling

- Client-side: basic form validation for required fields and type checks.
- Server-side: canonical validation (unique IDs, referential integrity — spouse/child ids exist and belong to same tree), return 4xx for validation errors with a JSON body { error: string, fields?: Record<string,string> }.
- Concurrency: if two users edit the same Person simultaneously, use optimistic locking: include updatedAt or version field on Person and reject outdated updates with 409 Conflict and the latest person payload.

### Edge cases & rules

- Circular relationships: prevent direct cycles (person A as child of B and B as child of A). Prevent spouses being their own ancestor/descendant.
- Multiple trees: a Person record may be shared across trees (if your model supports it) or copied per tree — choose one and document. Recommended: store Person records scoped to tree (treeId on Person) to avoid cross-tree leakage.
- Missing ancestors/unknown parent: allow creating placeholder nodes (name: 'Unknown') and mark them specially.

### Accessibility

- Keyboard accessible modal dialogs and forms.
- Clear labels, ARIA attributes on dynamic elements, color contrast checks for badges and warnings.

### Small component suggestions (implementation-level)

- `MemberList` — props: { people, onSelect, onEdit, onDelete }
- `MemberForm` — props: { person?, onSubmit, onCancel }
- `AttachModal` — props: { mode: 'child'|'spouse'|'parent', sourcePersonId, onConfirm }

### Tests to add

- Unit tests for `tree-utils` relationship helpers (prevent cycle, attach/detach logic).
- Integration tests for API endpoints: create, update, attach, delete with authorization checks.

### Next steps (engineering tasks)

- Implement backend endpoints under `pages/api/admin/trees/[treeId]/people`.
- Create `MemberList`, `MemberForm`, and `AttachModal` components in `components/`.
- Wire UI into `backoffice/trees` pages and add routes.
- Add tests and update README with admin usage notes.

### Acceptance criteria

- Admins can create a new Person record, see it in the list, and attach it to a tree node.
- Admins can edit Person details and have relationships updated correctly.
- Admins can delete (soft/hard) a Person with clear warnings and no silent data corruption.

Completion: first draft spec added to repository documentation for review.

