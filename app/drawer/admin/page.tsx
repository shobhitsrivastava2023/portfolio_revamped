import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import DrawerAdmin from "./DrawerAdmin";
import AdminLogin from "./AdminLogin";
import { isAdmin } from "../../lib/drawer/auth";
import { listAllDrawerItems } from "../../lib/drawer/db";

export const metadata: Metadata = {
  title: "Drawer admin",
  robots: { index: false, follow: false },
};

// Always check the session; never cache this page.
export const dynamic = "force-dynamic";

export default async function DrawerAdminPage() {
  const loggedIn = await isAdmin();
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FFE7D0] font-sans">
      <main className="flex w-full max-w-[562px] flex-col px-4 min-[563px]:px-0" style={{ marginBottom: 80 }}>
        <Navbar />
        <h1
          className="mt-12 font-outfit font-medium text-[#1B1B1B]"
          style={{ fontSize: "clamp(40px, 11vw, 64px)", letterSpacing: "-0.08em", lineHeight: 1 }}
        >
          drawer admin
        </h1>
        {loggedIn ? <DrawerAdmin initialItems={await listAllDrawerItems()} /> : <AdminLogin />}
      </main>
    </div>
  );
}
