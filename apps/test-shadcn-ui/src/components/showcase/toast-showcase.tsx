"use client";

import { Button } from "@/components/ui/button";
import { Section, SubSection } from "./helpers";
import { toast } from "sonner";

export function ToastShowcase() {
  return (
    <Section title="55. Toast" id="toast" docUrl="https://ui.shadcn.com/docs/components/toast">
      <SubSection title="Toast Notifications (via Sonner)">
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => toast("Event has been created")}>Simple Toast</Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("Event has been created", { description: "Monday, January 3rd at 6:00pm" })
            }
          >
            With Description
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
                loading: "Loading...",
                success: "Data loaded!",
                error: "Error loading",
              })
            }
          >
            Promise Toast
          </Button>
        </div>
      </SubSection>
    </Section>
  );
}
