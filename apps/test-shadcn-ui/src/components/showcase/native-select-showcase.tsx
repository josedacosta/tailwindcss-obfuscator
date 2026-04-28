"use client";

import * as React from "react";
import {
  NativeSelect,
  NativeSelectOption,
  NativeSelectOptGroup,
} from "@/components/ui/native-select";
import { Section, SubSection } from "./helpers";

export function NativeSelectShowcase() {
  const [nativeSelectValue, setNativeSelectValue] = React.useState("");

  return (
    <Section
      title="35. Native Select"
      id="native-select"
      docUrl="https://ui.shadcn.com/docs/components/native-select"
    >
      <SubSection title="Default">
        <NativeSelect
          value={nativeSelectValue}
          onChange={(e) => setNativeSelectValue(e.target.value)}
        >
          <NativeSelectOption value="">Select status</NativeSelectOption>
          <NativeSelectOption value="todo">Todo</NativeSelectOption>
          <NativeSelectOption value="in-progress">In Progress</NativeSelectOption>
          <NativeSelectOption value="done">Done</NativeSelectOption>
          <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
        </NativeSelect>
      </SubSection>
      <SubSection title="With Groups">
        <NativeSelect>
          <NativeSelectOption value="">Select department</NativeSelectOption>
          <NativeSelectOptGroup label="Engineering">
            <NativeSelectOption value="frontend">Frontend</NativeSelectOption>
            <NativeSelectOption value="backend">Backend</NativeSelectOption>
            <NativeSelectOption value="devops">DevOps</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Sales">
            <NativeSelectOption value="sales-rep">Sales Rep</NativeSelectOption>
            <NativeSelectOption value="account-manager">Account Manager</NativeSelectOption>
            <NativeSelectOption value="sales-director">Sales Director</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Operations">
            <NativeSelectOption value="support">Customer Support</NativeSelectOption>
            <NativeSelectOption value="product-manager">Product Manager</NativeSelectOption>
            <NativeSelectOption value="ops-manager">Operations Manager</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
      </SubSection>
      <SubSection title="Disabled">
        <NativeSelect disabled>
          <NativeSelectOption value="">Select priority</NativeSelectOption>
          <NativeSelectOption value="low">Low</NativeSelectOption>
          <NativeSelectOption value="medium">Medium</NativeSelectOption>
          <NativeSelectOption value="high">High</NativeSelectOption>
          <NativeSelectOption value="critical">Critical</NativeSelectOption>
        </NativeSelect>
      </SubSection>
      <SubSection title="Invalid">
        <NativeSelect aria-invalid="true">
          <NativeSelectOption value="">Select role</NativeSelectOption>
          <NativeSelectOption value="admin">Admin</NativeSelectOption>
          <NativeSelectOption value="editor">Editor</NativeSelectOption>
          <NativeSelectOption value="viewer">Viewer</NativeSelectOption>
          <NativeSelectOption value="guest">Guest</NativeSelectOption>
        </NativeSelect>
      </SubSection>
    </Section>
  );
}
