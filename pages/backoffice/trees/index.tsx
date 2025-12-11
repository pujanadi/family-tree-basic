import { useState } from "react";
import Head from "next/head";
import BackofficeLayout from "@/components/backoffice/BackofficeLayout";
import data from "@/data/sample.json";


const TreesPage = () => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<string[]>([]);
  const [show, setShow] = useState(false);

  const items: string[] = Object.values(data.people).map(
    (person: any) => person.name
  );

  // const items = [
  //     "M. Badjuri",
  //     "Herdis Pagih",
  //     "John Doe",
  //     "Jane Smith",
  //     "Michael Jackson",
  //     "Jenny Anderson",
  //     "Jonathan Davis",
  //     "Mike Tyson",
  //   ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 0) {
      const result = items.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(result);
      setShow(true);
    } else {
      setShow(false);
    }
  };

  const handleSelect = (value: string) => {
    setQuery(value);
    setShow(false);
  };

  return (
  <>
    <Head>
      <title>Backoffice - Family Trees</title>
    </Head>
    <BackofficeLayout
      title="Family trees"
      subtitle="Browse, filter, and manage published family trees across the workspace."
    >
      {/* <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-sm text-slate-400">
        Tree management tools coming soon. You will be able to review submissions, archive trees, and open detailed
        lineage views from here.
      </div> */}

      <h1 className="text-2xl font-bold mb-4">Family Tree — Search family</h1>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-sm text-slate-400">
        <input 
        type="text" 
        placeholder="Search trees..." 
        value={query}
        onChange={handleChange}
        className="w-full rounded-md border border-white/10 bg-slate-800/50 px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-misty-teal-400 focus:outline-none focus:ring-1 focus:ring-misty-teal-400" 
        />

        {/* Suggestions Box */}
        {show && filtered.length > 0 && (
          <ul className="left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filtered.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelect(item)}
                className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        )}

        <input 
          type="button" 
          value="Search" 
          onClick={() => window.location.href="/backoffice/trees/searchtree" }
          className="mt-4 rounded-md bg-misty-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-misty-teal-600 transition-colors" />
      </div>

      
    </BackofficeLayout>
  </>
  );
}

export default TreesPage;
