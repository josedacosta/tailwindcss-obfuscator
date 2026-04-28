"use client";

import * as React from "react";
import { Terminal, AlertCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Section, SubSection } from "./helpers";

export function AlertShowcase() {
  return (
    <Section title="2. Alert" id="alert" docUrl="https://ui.shadcn.com/docs/components/alert">
      <SubSection title="Default Alert">
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
        </Alert>
      </SubSection>

      <SubSection title="Destructive Alert">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
        </Alert>
      </SubSection>

      <SubSection title="Success, Warning, Info (Custom)">
        <div className="space-y-4">
          <Alert className="border-green-500 bg-green-50 text-green-800 dark:border-green-400 dark:bg-green-950 dark:text-green-300">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>Your changes have been saved.</AlertDescription>
          </Alert>
          <Alert className="border-yellow-500 bg-yellow-50 text-yellow-800 dark:border-yellow-400 dark:bg-yellow-950 dark:text-yellow-300">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>Your account is about to expire.</AlertDescription>
          </Alert>
          <Alert className="border-blue-500 bg-blue-50 text-blue-800 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-300">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>A new update is available.</AlertDescription>
          </Alert>
        </div>
      </SubSection>
    </Section>
  );
}
