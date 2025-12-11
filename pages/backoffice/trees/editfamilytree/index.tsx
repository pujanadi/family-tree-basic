import React, { useState } from "react";

type Member = {
  id: number;
  name: string;
  gender: "male" | "female";
  birthYear: number | "";
  deathYear?: number | "";
  spouse?: string;
};

export default function EditFamilyTreePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [form, setForm] = useState<Member>({
    id: 0,
    name: "",
    gender: "male",
    birthYear: "",
    deathYear: "",
    spouse: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add or Update Member
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId === null) {
      // Add new member
      setMembers([...members, { ...form, id: Date.now() }]);
    } else {
      // Update existing member
      setMembers(
        members.map((m) => (m.id === editingId ? { ...m, ...form } : m))
      );
      setEditingId(null);
    }

    // Reset form
    setForm({
      id: 0,
      name: "",
      gender: "male",
      birthYear: "",
      deathYear: "",
      spouse: "",
    });
  };

  // Edit button clicked
  const handleEdit = (member: Member) => {
    setForm(member);
    setEditingId(member.id);
  };

  // Delete member
  const handleDelete = (id: number) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">

        <h1 className="text-2xl font-bold mb-4">Family Tree — Edit Members</h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <div>
            <label className="block font-semibold">Name</label>
            <input
              type="text"
              name="name"
              className="w-full border p-2 rounded-md"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Gender</label>
            <select
              name="gender"
              className="w-full border p-2 rounded-md"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold">Birth Year</label>
            <input
              type="number"
              name="birthYear"
              className="w-full border p-2 rounded-md"
              value={form.birthYear}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block font-semibold">Death Year (optional)</label>
            <input
              type="number"
              name="deathYear"
              className="w-full border p-2 rounded-md"
              value={form.deathYear}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold">Spouse Name (optional)</label>
            <input
              type="text"
              name="spouse"
              className="w-full border p-2 rounded-md"
              value={form.spouse}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="md:col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {editingId ? "Update Member" : "Add Member"}
          </button>
        </form>

        {/* Member List */}
        <h2 className="text-xl font-semibold mt-6 mb-2">Member List</h2>

        {members.length === 0 ? (
          <p className="text-gray-500">No members added yet.</p>
        ) : (
          <table className="w-full border mt-2">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Gender</th>
                <th className="border p-2">Birth</th>
                <th className="border p-2">Death</th>
                <th className="border p-2">Spouse</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="text-center">
                  <td className="border p-2">{m.name}</td>
                  <td className="border p-2 capitalize">{m.gender}</td>
                  <td className="border p-2">{m.birthYear}</td>
                  <td className="border p-2">{m.deathYear || "-"}</td>
                  <td className="border p-2">{m.spouse || "-"}</td>
                  <td className="border p-2 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(m)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
