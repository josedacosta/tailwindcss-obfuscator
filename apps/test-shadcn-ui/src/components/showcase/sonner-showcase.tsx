"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Section, SubSection } from "./helpers";

export function SonnerShowcase() {
  return (
    <Section title="49. Sonner" id="sonner" docUrl="https://ui.shadcn.com/docs/components/sonner">
      <SubSection title="Default with Action">
        <Button
          variant="outline"
          onClick={() =>
            toast("Event has been created", {
              description: "Sunday, December 03, 2023 at 9:00 AM",
              action: {
                label: "Undo",
                onClick: () => console.log("Undo"),
              },
            })
          }
        >
          Show Toast
        </Button>
      </SubSection>
      <SubSection title="All Toast Types">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast("Event has been created")}>
            Default
          </Button>
          <Button variant="outline" onClick={() => toast.success("Event has been created")}>
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info("Be at the area 10 minutes before the event time")}
          >
            Info
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.warning("Event start time cannot be earlier than 8am")}
          >
            Warning
          </Button>
          <Button variant="outline" onClick={() => toast.error("Event has not been created")}>
            Error
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              toast.promise<{ name: string }>(
                () => new Promise((resolve) => setTimeout(() => resolve({ name: "Event" }), 2000)),
                {
                  loading: "Loading...",
                  success: (data) => `${data.name} has been created`,
                  error: "Error",
                }
              );
            }}
          >
            Promise
          </Button>
        </div>
      </SubSection>
      <Toaster position="top-center" />
    </Section>
  );
}
