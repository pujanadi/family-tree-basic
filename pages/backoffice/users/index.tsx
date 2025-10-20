import Head from "next/head";
import BackofficeLayout from "@/components/backoffice/BackofficeLayout";

const UsersPage = () => (
  <>
    <Head>
      <title>Backoffice · Users & Roles</title>
    </Head>
    <BackofficeLayout
      title="Users & roles"
      subtitle="Assign admin privileges, review invitations, and manage collaborator access."
    >
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-sm text-slate-400">
        User management will surface here. We&apos;ll show administrators, active contributors, and pending invites.
      </div>
    </BackofficeLayout>
  </>
);

export default UsersPage;
