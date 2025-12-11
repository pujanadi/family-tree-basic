import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BackofficeLayout from "@/components/backoffice/BackofficeLayout";
import MemberList from "@/components/MemberList";
import MemberForm from "@/components/MemberForm";
import AttachModal from "@/components/AttachModal";
import ConfirmModal from "@/components/ConfirmModal";
import { Person } from "@/lib/types";

const MembersPage = () => {
  const router = useRouter();
  const { treeId } = router.query as { treeId?: string };

  const [people, setPeople] = useState<Person[]>([]);
  const [selected, setSelected] = useState<Person | null>(null);
  const [showAttach, setShowAttach] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [attaching, setAttaching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [confirmDeletePerson, setConfirmDeletePerson] = useState<Person | null>(null);

  useEffect(() => {
    if (!treeId) return;
    const load = async () => {
      setLoadingList(true);
      setErrorMsg(null);
      try {
        const res = await fetch(`/api/admin/trees/${treeId}/people`);
        if (!res.ok) throw new Error("Failed to fetch people");
        const json = await res.json();
        const items: Person[] = json.people || [];
        setPeople(items);
      } catch (err) {
        console.error(err);
        setErrorMsg(String(err));
        setPeople([]);
      } finally {
        setLoadingList(false);
      }
    };
    void load();
  }, [treeId]);

  const handleSave = async (p: Person) => {
    if (!treeId) return setErrorMsg("Missing treeId");
    setSaving(true);
    setErrorMsg(null);
    try {
      const exists = people.find((x) => x.id === p.id);
      if (exists) {
        const res = await fetch(`/api/admin/trees/${treeId}/people/${p.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p)
        });
        if (!res.ok) throw new Error("Update failed");
        const json = await res.json();
        setPeople((prev) => prev.map((x) => (x.id === p.id ? json.person : x)));
        setSuccessMsg("Person updated");
      } else {
        const res = await fetch(`/api/admin/trees/${treeId}/people`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p)
        });
        if (!res.ok) throw new Error("Create failed");
        const json = await res.json();
        setPeople((prev) => [json.person, ...prev]);
        setSuccessMsg("Person created");
      }
      setSelected(null);
    } catch (err) {
      console.error(err);
      setErrorMsg(String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p?: Person) => {
    if (!p) return;
    setConfirmDeletePerson(p);
  };

  const runDelete = async () => {
    const p = confirmDeletePerson;
    if (!p || !treeId) return setErrorMsg("Missing data for delete");
    setDeletingId(p.id);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/admin/trees/${treeId}/people/${p.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setPeople((prev) => prev.filter((x) => x.id !== p.id));
      if (selected?.id === p.id) setSelected(null);
      setSuccessMsg("Person deleted");
    } catch (err) {
      console.error(err);
      setErrorMsg(String(err));
    } finally {
      setDeletingId(null);
      setConfirmDeletePerson(null);
    }
  };

  return (
    <BackofficeLayout title="Members" subtitle={`Tree ${treeId ?? "-"}`}>
      {errorMsg && (
        <div className="mb-4 rounded-md bg-rose-900/40 px-4 py-2 text-sm text-rose-200">{errorMsg}</div>
      )}
      {successMsg && (
        <div className="mb-4 rounded-md bg-misty-teal-700/20 px-4 py-2 text-sm text-misty-teal-200">{successMsg}</div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300">People</h2>
            <div>
              <button onClick={() => setSelected(null)} className="rounded-md bg-misty-teal-500 px-3 py-1 text-xs font-semibold text-white">New</button>
            </div>
          </div>
          <div className="mt-4">
            <MemberList
              people={people}
              onSelect={setSelected}
              onEdit={setSelected}
              onDelete={handleDelete}
              loading={loadingList}
              actionDisabled={saving || !!deletingId || attaching}
            />
          </div>
        </div>

        <div className="col-span-8">
          <h2 className="text-sm font-semibold text-slate-300">Details</h2>
          <div className="mt-4">
            <MemberForm person={selected ?? undefined} onCancel={() => setSelected(null)} onSave={handleSave} saving={saving} />
          </div>

          <div className="mt-6">
            <button onClick={() => setShowAttach(true)} className="rounded-md bg-white/5 px-3 py-2 text-sm text-slate-200">Attach to tree</button>
          </div>
        </div>
      </div>

      <AttachModal
        open={showAttach}
        mode="child"
        sourceId={selected?.id}
        onClose={() => setShowAttach(false)}
        loading={attaching}
        error={null}
        onConfirm={async (opts) => {
          setShowAttach(false);
          if (!treeId || !selected) return setErrorMsg("Missing tree or source");
          setAttaching(true);
          setErrorMsg(null);
          try {
            const res = await fetch(`/api/admin/trees/${treeId}/people/${selected.id}/attach`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ targetId: opts.targetId, relation: opts.mode })
            });
            if (!res.ok) throw new Error("Attach failed");
            // Reload people to reflect changes
            const listRes = await fetch(`/api/admin/trees/${treeId}/people`);
            const json = await listRes.json();
            setPeople(json.people || []);
            setSuccessMsg("Attached successfully");
          } catch (err) {
            console.error(err);
            setErrorMsg(String(err));
          } finally {
            setAttaching(false);
          }
        }}
      />

        {/* Confirm delete modal */}
        <ConfirmModal
          open={!!confirmDeletePerson}
          title="Delete person"
          message={confirmDeletePerson ? `Delete ${confirmDeletePerson.name}? This will remove references from other records.` : ""}
          onCancel={() => setConfirmDeletePerson(null)}
          onConfirm={runDelete}
        />
    </BackofficeLayout>
  );
};

export default MembersPage;
