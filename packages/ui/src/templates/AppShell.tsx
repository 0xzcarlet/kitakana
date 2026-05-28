import type { ReactNode } from "react";
import { AppHeader, AppSidebar, MobileBottomNav } from "../organisms";

export type AppShellProps = {
  activeHref?: string;
  children: ReactNode;
};

export function AppShell({ activeHref = "/", children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_10%,rgba(193,235,233,0.7),transparent_26rem),radial-gradient(circle_at_85%_0%,rgba(244,174,82,0.25),transparent_22rem)]" />
      <div className="relative z-10 flex min-h-screen">
        <AppSidebar activeHref={activeHref} />
        <div className="min-w-0 flex-1 lg:pl-72">
          <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 lg:px-10 lg:py-8">
            <AppHeader />
            {children}
          </main>
        </div>
      </div>
      <MobileBottomNav activeHref={activeHref} />
    </div>
  );
}
