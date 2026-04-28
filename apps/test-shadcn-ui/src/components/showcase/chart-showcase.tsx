"use client";

import * as React from "react";
import { Bar, BarChart, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Section, SubSection } from "./helpers";
import { chartData, chartConfig } from "./data";

export function ChartShowcase() {
  return (
    <Section title="13. Chart" id="chart" docUrl="https://ui.shadcn.com/docs/components/chart">
      <SubSection title="Bar Chart with Tooltip & Legend">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </SubSection>
    </Section>
  );
}
