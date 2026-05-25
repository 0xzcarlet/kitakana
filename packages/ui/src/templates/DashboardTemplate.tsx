import type { ReactNode } from "react";
import { Card } from "../atoms";

export type DashboardTemplateProps = {
  aside?: ReactNode;
  children: ReactNode;
};

export function DashboardTemplate({ aside, children }: DashboardTemplateProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0">{children}</div>
      {aside ? <Card className="h-fit">{aside}</Card> : null}
    </div>
  );
}
