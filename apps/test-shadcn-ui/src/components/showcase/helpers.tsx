"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Section({
  title,
  id,
  docUrl,
  children,
}: {
  title: string;
  id: string;
  docUrl?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="mb-16 scroll-mt-20">
      <h2 className="text-foreground mb-2 text-3xl font-bold">{title}</h2>
      {docUrl && (
        <a
          href={docUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground mb-6 inline-block text-sm underline transition-colors"
        >
          Documentation →
        </a>
      )}
      <div className={cn("space-y-8", docUrl ? "" : "mt-6 border-t pt-6")}>{children}</div>
    </div>
  );
}

export function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-foreground mb-4 text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
}
