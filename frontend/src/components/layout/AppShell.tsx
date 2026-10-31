"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { SessionProvider } from "@/hooks/useSession";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <SessionProvider>
      <div className="gradient-mesh min-h-screen">
        <Sidebar />
        <main className="main-content">
          <div className="page-section">{children}</div>
        </main>
      </div>
    </SessionProvider>
  );
}

