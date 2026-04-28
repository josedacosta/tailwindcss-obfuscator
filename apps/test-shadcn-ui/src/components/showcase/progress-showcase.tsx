"use client";

import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { Section, SubSection } from "./helpers";

export function ProgressShowcase() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Section
      title="39. Progress"
      id="progress"
      docUrl="https://ui.shadcn.com/docs/components/progress"
    >
      <SubSection title="Different Values">
        <div className="max-w-md space-y-4">
          <div className="space-y-2">
            <span className="text-sm">0%</span>
            <Progress value={0} />
          </div>
          <div className="space-y-2">
            <span className="text-sm">25%</span>
            <Progress value={25} />
          </div>
          <div className="space-y-2">
            <span className="text-sm">50%</span>
            <Progress value={50} />
          </div>
          <div className="space-y-2">
            <span className="text-sm">75%</span>
            <Progress value={75} />
          </div>
          <div className="space-y-2">
            <span className="text-sm">100%</span>
            <Progress value={100} />
          </div>
          <div className="space-y-2">
            <span className="text-sm">Animated: {progress}%</span>
            <Progress value={progress} />
          </div>
        </div>
      </SubSection>
    </Section>
  );
}
