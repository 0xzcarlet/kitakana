"use client";

import type { ReactNode } from "react";
import { AppShell } from "@kitakana/ui";
import { usePathname } from "next/navigation";

function getActiveHref(pathname: string): string {
  if (pathname === "/") {
    return "/";
  }

  const section = pathname.split("/")[1];
  return section ? `/${section}` : "/";
}

export type RouteAwareAppShellProps = {
  children: ReactNode;
};

export function RouteAwareAppShell({ children }: RouteAwareAppShellProps) {
  const pathname = usePathname();

  if (pathname === "/") {
    return <>{children}</>;
  }

  return <AppShell activeHref={getActiveHref(pathname)}>{children}</AppShell>;
}
