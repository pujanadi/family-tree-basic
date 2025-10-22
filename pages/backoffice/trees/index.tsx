import Head from "next/head";
import BackofficeLayout from "@/components/backoffice/BackofficeLayout";

const TreesPage = () => (
  <>
    <Head>
      <title>Backoffice - Family Trees</title>
    </Head>
    <BackofficeLayout
      title="Family trees"
      subtitle="Browse, filter, and manage published family trees across the workspace."
    >
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-sm text-slate-400">
        Tree management tools coming soon. You will be able to review submissions, archive trees, and open detailed
        lineage views from here.
      </div>
    </BackofficeLayout>
  </>
);

export default TreesPage;
