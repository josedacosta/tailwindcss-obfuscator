import { z } from "zod";
import { ChartConfig } from "@/components/ui/chart";

// Form schema for Form showcase
export const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
});

// Chart data for Chart showcase
export const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

export const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// Frameworks for combobox
export const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

// Statuses for combobox popover
export const statuses = [
  { value: "backlog", label: "Backlog" },
  { value: "todo", label: "Todo" },
  { value: "in progress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "canceled", label: "Canceled" },
];

// Payment type for data table
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

// Data for drawer chart
export const goalData = [
  { goal: 400 },
  { goal: 300 },
  { goal: 200 },
  { goal: 300 },
  { goal: 200 },
  { goal: 278 },
  { goal: 189 },
  { goal: 239 },
  { goal: 300 },
  { goal: 200 },
  { goal: 278 },
  { goal: 189 },
  { goal: 349 },
];

// Data for data table
export const payments: Payment[] = [
  { id: "m5gr84i9", amount: 316, status: "success", email: "ken99@example.com" },
  { id: "3u1reuv4", amount: 242, status: "success", email: "Abe45@example.com" },
  { id: "derv1ws0", amount: 837, status: "processing", email: "Monserrat44@example.com" },
  { id: "5kma53ae", amount: 874, status: "success", email: "Silas22@example.com" },
  { id: "bhqecj4p", amount: 721, status: "failed", email: "carmella@example.com" },
];

// Helper functions for date picker
export function formatDateLong(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" });
}

export function isValidDate(date: Date | undefined) {
  if (!date) return false;
  return !isNaN(date.getTime());
}

// Tags for scroll area
export const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

// Artworks for scroll area
export const artworks = [
  {
    artist: "Ornella Binni",
    art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?w=300&h=300&q=80",
  },
  {
    artist: "Tom Byrom",
    art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?w=300&h=300&q=80",
  },
  {
    artist: "Vladimir Malyavko",
    art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?w=300&h=300&q=80",
  },
];

// Invoices for table
export const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150.00", paymentMethod: "PayPal" },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  { invoice: "INV005", paymentStatus: "Paid", totalAmount: "$550.00", paymentMethod: "PayPal" },
];

// Components list
export const componentsList = [
  "Accordion",
  "Alert",
  "Alert Dialog",
  "Aspect Ratio",
  "Avatar",
  "Badge",
  "Breadcrumb",
  "Button",
  "Button Group",
  "Calendar",
  "Card",
  "Carousel",
  "Chart",
  "Checkbox",
  "Collapsible",
  "Combobox",
  "Command",
  "Context Menu",
  "Data Table",
  "Date Picker",
  "Dialog",
  "Drawer",
  "Dropdown Menu",
  "Empty",
  "Field",
  "Form",
  "Hover Card",
  "Input",
  "Input Group",
  "Input OTP",
  "Item",
  "Kbd",
  "Label",
  "Menubar",
  "Native Select",
  "Navigation Menu",
  "Pagination",
  "Popover",
  "Progress",
  "Radio Group",
  "Resizable",
  "Scroll Area",
  "Select",
  "Separator",
  "Sheet",
  "Sidebar",
  "Skeleton",
  "Slider",
  "Sonner",
  "Spinner",
  "Switch",
  "Table",
  "Tabs",
  "Textarea",
  "Toast",
  "Toggle",
  "Toggle Group",
  "Tooltip",
  "Typography",
];
