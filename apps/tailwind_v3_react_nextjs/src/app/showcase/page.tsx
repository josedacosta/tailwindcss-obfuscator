"use client";

import * as React from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bold,
  Calendar as CalendarIcon,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  FileText,
  Folder,
  HelpCircle,
  Home,
  Info,
  Italic,
  Loader2,
  Mail,
  Plus,
  Settings,
  Smile,
  Terminal,
  Underline,
  User,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty } from "@/components/ui/empty";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Item, ItemContent, ItemTitle, ItemDescription as ItemDesc } from "@/components/ui/item";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bar, BarChart, XAxis } from "recharts";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

function Section({
  title,
  id,
  children,
}: {
  title: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="mb-16 scroll-mt-20">
      <h2 className="text-foreground mb-6 border-b pb-3 text-3xl font-bold">{title}</h2>
      <div className="space-y-8">{children}</div>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-foreground mb-4 text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
}

const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
});

// Chart data
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
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
const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

// Data for data table
const payments = [
  { id: "m5gr84i9", amount: 316, status: "success", email: "ken99@yahoo.com" },
  { id: "3u1reuv4", amount: 242, status: "success", email: "Abe45@gmail.com" },
  { id: "derv1ws0", amount: 837, status: "processing", email: "Monserrat44@gmail.com" },
  { id: "5kma53ae", amount: 874, status: "success", email: "Silas22@gmail.com" },
  { id: "bhqecj4p", amount: 721, status: "failed", email: "carmella@hotmail.com" },
];

export default function ShowcasePage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(),
    to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  const [progress, setProgress] = React.useState(13);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [showStatusBar, setShowStatusBar] = React.useState(true);
  const [showActivityBar, setShowActivityBar] = React.useState(false);
  const [position, setPosition] = React.useState("bottom");
  const [comboboxOpen, setComboboxOpen] = React.useState(false);
  const [comboboxValue, setComboboxValue] = React.useState("");
  const [datePickerDate, setDatePickerDate] = React.useState<Date>();
  const [nativeSelectValue, setNativeSelectValue] = React.useState("");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", email: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Form submitted!", { description: JSON.stringify(values) });
  }

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  const components = [
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

  const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);
  const artworks = [
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

  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
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

  return (
    <TooltipProvider>
      <div className="bg-background min-h-screen">
        {/* Header */}
        <div className="bg-muted/50 border-b py-8">
          <div className="mx-auto max-w-7xl px-8">
            <h1 className="text-foreground mb-2 text-4xl font-bold">
              shadcn/ui Components - Complete Showcase
            </h1>
            <p className="text-muted-foreground mb-4 text-lg">
              All {components.length} components with variations (matching official documentation)
            </p>
            <div className="flex flex-wrap gap-2">
              {components.map((name) => (
                <a
                  key={name}
                  href={`#${name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="bg-primary/10 hover:bg-primary/20 text-primary rounded-md px-2 py-1 text-xs transition-colors"
                >
                  {name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl p-8">
          {/* ==================== 1. ACCORDION ==================== */}
          <Section title="1. Accordion" id="accordion">
            <SubSection title="Single Selection (Collapsible)">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is it styled?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It comes with default styles that matches the other components.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is it animated?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It&apos;s animated by default, but you can disable it.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </SubSection>

            <SubSection title="Multiple Selection">
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Can I select multiple items?</AccordionTrigger>
                  <AccordionContent>
                    Yes! This accordion allows multiple items to be open at the same time.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How does it work?</AccordionTrigger>
                  <AccordionContent>
                    Set type=&quot;multiple&quot; to enable this behavior.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </SubSection>
          </Section>

          {/* ==================== 2. ALERT ==================== */}
          <Section title="2. Alert" id="alert">
            <SubSection title="Default Alert">
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  You can add components to your app using the CLI.
                </AlertDescription>
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

          {/* ==================== 3. ALERT DIALOG ==================== */}
          <Section title="3. Alert Dialog" id="alert-dialog">
            <SubSection title="Destructive & Confirmation">
              <div className="flex flex-wrap gap-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">Confirm Action</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm your action</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to proceed?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 4. ASPECT RATIO ==================== */}
          <Section title="4. Aspect Ratio" id="aspect-ratio">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <SubSection title="16:9 (Video)">
                <AspectRatio ratio={16 / 9} className="bg-muted overflow-hidden rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&q=80"
                    alt="16:9"
                    className="h-full w-full object-cover"
                  />
                </AspectRatio>
              </SubSection>
              <SubSection title="4:3 (Classic)">
                <AspectRatio ratio={4 / 3} className="bg-muted overflow-hidden rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&q=80"
                    alt="4:3"
                    className="h-full w-full object-cover"
                  />
                </AspectRatio>
              </SubSection>
              <SubSection title="1:1 (Square)">
                <AspectRatio ratio={1} className="bg-muted overflow-hidden rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&q=80"
                    alt="1:1"
                    className="h-full w-full object-cover"
                  />
                </AspectRatio>
              </SubSection>
              <SubSection title="21:9 (Ultrawide)">
                <AspectRatio ratio={21 / 9} className="bg-muted overflow-hidden rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&q=80"
                    alt="21:9"
                    className="h-full w-full object-cover"
                  />
                </AspectRatio>
              </SubSection>
            </div>
          </Section>

          {/* ==================== 5. AVATAR ==================== */}
          <Section title="5. Avatar" id="avatar">
            <SubSection title="Sizes & Fallbacks">
              <div className="flex flex-wrap items-center gap-4">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="text-xs">CN</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar className="h-12 w-12">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar className="h-16 w-16">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback className="bg-blue-500 text-white">AB</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback className="bg-green-500 text-white">CD</AvatarFallback>
                </Avatar>
              </div>
            </SubSection>
            <SubSection title="Avatar Group">
              <div className="flex -space-x-4">
                <Avatar className="border-background border-2">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar className="border-background border-2">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar className="border-background border-2">
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <Avatar className="border-background border-2">
                  <AvatarFallback className="bg-muted">+3</AvatarFallback>
                </Avatar>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 6. BADGE ==================== */}
          <Section title="6. Badge" id="badge">
            <SubSection title="All Variants">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </SubSection>
            <SubSection title="With Icons & Custom Colors">
              <div className="flex flex-wrap gap-2">
                <Badge>
                  <Check className="mr-1 h-3 w-3" /> Verified
                </Badge>
                <Badge variant="secondary">
                  <User className="mr-1 h-3 w-3" /> User
                </Badge>
                <Badge className="bg-green-500 hover:bg-green-600">Success</Badge>
                <Badge className="bg-yellow-500 hover:bg-yellow-600">Warning</Badge>
                <Badge className="bg-blue-500 hover:bg-blue-600">Info</Badge>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 7. BREADCRUMB ==================== */}
          <Section title="7. Breadcrumb" id="breadcrumb">
            <SubSection title="Basic & With Ellipsis">
              <div className="space-y-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">
                        <Home className="h-4 w-4" />
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbEllipsis />
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbPage>Current</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 8. BUTTON ==================== */}
          <Section title="8. Button" id="button">
            <SubSection title="All Variants">
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </SubSection>
            <SubSection title="Sizes">
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </SubSection>
            <SubSection title="With Icons & States">
              <div className="flex flex-wrap gap-4">
                <Button>
                  <Mail className="mr-2 h-4 w-4" /> Email
                </Button>
                <Button variant="outline">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
                </Button>
                <Button disabled>Disabled</Button>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 9. BUTTON GROUP ==================== */}
          <Section title="9. Button Group" id="button-group">
            <SubSection title="Horizontal Button Groups">
              <div className="space-y-4">
                <ButtonGroup>
                  <Button variant="outline">Left</Button>
                  <Button variant="outline">Center</Button>
                  <Button variant="outline">Right</Button>
                </ButtonGroup>
                <ButtonGroup>
                  <Button>Save</Button>
                  <Button variant="outline">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </ButtonGroup>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 10. CALENDAR ==================== */}
          <Section title="10. Calendar" id="calendar">
            <div className="grid gap-6 lg:grid-cols-2">
              <SubSection title="Single Selection">
                {mounted && (
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                )}
              </SubSection>
              <SubSection title="Range Selection">
                {mounted && (
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) =>
                      setDateRange(range as { from: Date | undefined; to: Date | undefined })
                    }
                    numberOfMonths={2}
                    className="rounded-md border"
                  />
                )}
              </SubSection>
            </div>
          </Section>

          {/* ==================== 11. CARD ==================== */}
          <Section title="11. Card" id="card">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Card Content</p>
                </CardContent>
                <CardFooter>
                  <p>Card Footer</p>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Create project</CardTitle>
                  <CardDescription>Deploy your new project in one-click.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <Label htmlFor="project-name">Name</Label>
                    <Input id="project-name" placeholder="My Project" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button>Deploy</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>You have 3 unread messages.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-muted-foreground text-sm">Sent you a message</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Section>

          {/* ==================== 12. CAROUSEL ==================== */}
          <Section title="12. Carousel" id="carousel">
            <SubSection title="Basic & Multiple Items">
              <div className="space-y-8">
                <Carousel className="mx-auto w-full max-w-xs">
                  <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <CarouselItem key={index}>
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-6">
                            <span className="text-4xl font-semibold">{index + 1}</span>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 13. CHART ==================== */}
          <Section title="13. Chart" id="chart">
            <SubSection title="Bar Chart">
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

          {/* ==================== 14. CHECKBOX ==================== */}
          <Section title="14. Checkbox" id="checkbox">
            <SubSection title="All States">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Checkbox id="check-1" />
                  <Label htmlFor="check-1">Default</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="check-2" defaultChecked />
                  <Label htmlFor="check-2">Checked</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="check-3" disabled />
                  <Label htmlFor="check-3" className="text-muted-foreground">
                    Disabled
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="check-4" disabled defaultChecked />
                  <Label htmlFor="check-4" className="text-muted-foreground">
                    Disabled Checked
                  </Label>
                </div>
              </div>
            </SubSection>
            <SubSection title="With Description">
              <div className="items-top flex space-x-2">
                <Checkbox id="terms" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="terms">Accept terms and conditions</Label>
                  <p className="text-muted-foreground text-sm">
                    You agree to our Terms of Service.
                  </p>
                </div>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 15. COLLAPSIBLE ==================== */}
          <Section title="15. Collapsible" id="collapsible">
            <SubSection title="Basic Collapsible">
              <Collapsible
                open={isCollapsibleOpen}
                onOpenChange={setIsCollapsibleOpen}
                className="w-[350px] space-y-2"
              >
                <div className="flex items-center justify-between space-x-4 px-4">
                  <h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      <ChevronsUpDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <div className="rounded-md border px-4 py-3 font-mono text-sm">
                  @radix-ui/primitives
                </div>
                <CollapsibleContent className="space-y-2">
                  <div className="rounded-md border px-4 py-3 font-mono text-sm">
                    @radix-ui/colors
                  </div>
                  <div className="rounded-md border px-4 py-3 font-mono text-sm">
                    @stitches/react
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </SubSection>
          </Section>

          {/* ==================== 16. COMBOBOX (Pattern) ==================== */}
          <Section title="16. Combobox" id="combobox">
            <SubSection title="Searchable Select (Command + Popover)">
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={comboboxOpen}
                    className="w-[200px] justify-between"
                  >
                    {comboboxValue
                      ? frameworks.find((f) => f.value === comboboxValue)?.label
                      : "Select framework..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {frameworks.map((framework) => (
                          <CommandItem
                            key={framework.value}
                            value={framework.value}
                            onSelect={(currentValue) => {
                              setComboboxValue(currentValue === comboboxValue ? "" : currentValue);
                              setComboboxOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                comboboxValue === framework.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {framework.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </SubSection>
          </Section>

          {/* ==================== 17. COMMAND ==================== */}
          <Section title="17. Command" id="command">
            <SubSection title="Full Featured Command">
              <Command className="rounded-lg border shadow-md md:min-w-[450px]">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Calendar</span>
                    </CommandItem>
                    <CommandItem>
                      <Smile className="mr-2 h-4 w-4" />
                      <span>Search Emoji</span>
                    </CommandItem>
                    <CommandItem>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help</span>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Settings">
                    <CommandItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                      <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                      <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </SubSection>
          </Section>

          {/* ==================== 18. CONTEXT MENU ==================== */}
          <Section title="18. Context Menu" id="context-menu">
            <SubSection title="Full Featured">
              <ContextMenu>
                <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
                  Right click here
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                  <ContextMenuItem>
                    Back <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem disabled>
                    Forward <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuSub>
                    <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-48">
                      <ContextMenuItem>Save Page As...</ContextMenuItem>
                      <ContextMenuItem>Developer Tools</ContextMenuItem>
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                  <ContextMenuSeparator />
                  <ContextMenuCheckboxItem
                    checked={showStatusBar}
                    onCheckedChange={setShowStatusBar}
                  >
                    Status Bar
                  </ContextMenuCheckboxItem>
                  <ContextMenuSeparator />
                  <ContextMenuRadioGroup value={position} onValueChange={setPosition}>
                    <ContextMenuLabel>Position</ContextMenuLabel>
                    <ContextMenuRadioItem value="top">Top</ContextMenuRadioItem>
                    <ContextMenuRadioItem value="bottom">Bottom</ContextMenuRadioItem>
                  </ContextMenuRadioGroup>
                </ContextMenuContent>
              </ContextMenu>
            </SubSection>
          </Section>

          {/* ==================== 19. DATA TABLE (Pattern) ==================== */}
          <Section title="19. Data Table" id="data-table">
            <SubSection title="Table with Sorting & Status">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payment.status === "success"
                              ? "default"
                              : payment.status === "processing"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.email}</TableCell>
                      <TableCell className="text-right">${payment.amount}.00</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </SubSection>
          </Section>

          {/* ==================== 20. DATE PICKER (Pattern) ==================== */}
          <Section title="20. Date Picker" id="date-picker">
            <SubSection title="Calendar + Popover">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !datePickerDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {datePickerDate ? format(datePickerDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={datePickerDate}
                    onSelect={setDatePickerDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </SubSection>
          </Section>

          {/* ==================== 21. DIALOG ==================== */}
          <Section title="21. Dialog" id="dialog">
            <SubSection title="Basic Dialog">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>Make changes to your profile here.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </SubSection>
          </Section>

          {/* ==================== 22. DRAWER ==================== */}
          <Section title="22. Drawer" id="drawer">
            <SubSection title="Bottom Drawer">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">Open Drawer</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Move Goal</DrawerTitle>
                    <DrawerDescription>Set your daily activity goal.</DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 text-center">
                    <div className="text-5xl font-bold">352</div>
                    <div className="text-muted-foreground text-sm">Calories/day</div>
                  </div>
                  <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </SubSection>
          </Section>

          {/* ==================== 23. DROPDOWN MENU ==================== */}
          <Section title="23. Dropdown Menu" id="dropdown-menu">
            <SubSection title="Full Featured">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Open Menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <User className="mr-2 h-4 w-4" />
                      Invite users
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Message
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={showStatusBar}
                    onCheckedChange={setShowStatusBar}
                  >
                    Status Bar
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SubSection>
          </Section>

          {/* ==================== 24. EMPTY ==================== */}
          <Section title="24. Empty" id="empty">
            <SubSection title="Empty State">
              <Empty>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Folder className="text-muted-foreground mb-4 h-12 w-12" />
                  <h3 className="text-lg font-semibold">No files</h3>
                  <p className="text-muted-foreground text-sm">Get started by uploading a file.</p>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" /> Add File
                  </Button>
                </div>
              </Empty>
            </SubSection>
          </Section>

          {/* ==================== 25. FIELD ==================== */}
          <Section title="25. Field" id="field">
            <SubSection title="Field with Validation">
              <div className="grid max-w-sm gap-4" suppressHydrationWarning>
                <div className="grid gap-2">
                  <Label htmlFor="field-email">Email</Label>
                  <Input id="field-email" type="email" placeholder="email@example.com" />
                  <p className="text-muted-foreground text-sm">Enter your email address.</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="field-error">With Error</Label>
                  <Input id="field-error" className="border-destructive" />
                  <p className="text-destructive text-sm">This field is required.</p>
                </div>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 26. FORM ==================== */}
          <Section title="26. Form" id="form">
            <SubSection title="With Validation">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full max-w-md space-y-6"
                  suppressHydrationWarning
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>
                        <FormDescription>This is your public display name.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </SubSection>
          </Section>

          {/* ==================== 27. HOVER CARD ==================== */}
          <Section title="27. Hover Card" id="hover-card">
            <SubSection title="User Preview">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link">@nextjs</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-4">
                    <Avatar>
                      <AvatarImage src="https://github.com/vercel.png" />
                      <AvatarFallback>VC</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">@nextjs</h4>
                      <p className="text-sm">
                        The React Framework – created and maintained by @vercel.
                      </p>
                      <div className="flex items-center pt-2">
                        <CalendarIcon className="text-muted-foreground mr-2 h-4 w-4" />
                        <span className="text-muted-foreground text-xs">Joined December 2021</span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </SubSection>
          </Section>

          {/* ==================== 28. INPUT ==================== */}
          <Section title="28. Input" id="input">
            <SubSection title="All Types">
              <div className="grid w-full max-w-sm gap-4" suppressHydrationWarning>
                <div className="grid gap-2">
                  <Label htmlFor="i-text">Text</Label>
                  <Input id="i-text" type="text" placeholder="Enter text..." />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="i-email">Email</Label>
                  <Input id="i-email" type="email" placeholder="john@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="i-pass">Password</Label>
                  <Input id="i-pass" type="password" placeholder="••••••••" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="i-file">File</Label>
                  <Input id="i-file" type="file" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="i-disabled">Disabled</Label>
                  <Input id="i-disabled" disabled placeholder="Disabled" />
                </div>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 29. INPUT GROUP ==================== */}
          <Section title="29. Input Group" id="input-group">
            <SubSection title="With Addons">
              <div className="grid w-full max-w-sm gap-4" suppressHydrationWarning>
                <InputGroup>
                  <InputGroupText>$</InputGroupText>
                  <InputGroupInput placeholder="0.00" />
                </InputGroup>
                <InputGroup>
                  <InputGroupText>
                    <Mail className="h-4 w-4" />
                  </InputGroupText>
                  <InputGroupInput placeholder="Email" />
                </InputGroup>
                <InputGroup>
                  <InputGroupText>https://</InputGroupText>
                  <InputGroupInput placeholder="example.com" />
                </InputGroup>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 30. INPUT OTP ==================== */}
          <Section title="30. Input OTP" id="input-otp">
            <SubSection title="6 Digits & 4 Digits">
              <div className="space-y-4">
                <InputOTP maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <InputOTP maxLength={4}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 31. ITEM ==================== */}
          <Section title="31. Item" id="item">
            <SubSection title="List Items">
              <div className="max-w-md space-y-2">
                <Item>
                  <ItemContent>
                    <ItemTitle>Documents</ItemTitle>
                    <ItemDesc>Your personal documents folder</ItemDesc>
                  </ItemContent>
                </Item>
                <Item>
                  <ItemContent>
                    <ItemTitle>Photos</ItemTitle>
                    <ItemDesc>Your photo library</ItemDesc>
                  </ItemContent>
                </Item>
                <Item>
                  <ItemContent>
                    <ItemTitle>Music</ItemTitle>
                    <ItemDesc>Your music collection</ItemDesc>
                  </ItemContent>
                </Item>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 32. KBD ==================== */}
          <Section title="32. Kbd" id="kbd">
            <SubSection title="Keyboard Shortcuts">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                  <span className="text-muted-foreground text-sm">Command menu</span>
                </div>
                <div className="flex items-center gap-2">
                  <Kbd>⌘</Kbd>
                  <Kbd>S</Kbd>
                  <span className="text-muted-foreground text-sm">Save</span>
                </div>
                <div className="flex items-center gap-2">
                  <Kbd>Ctrl</Kbd>
                  <Kbd>C</Kbd>
                  <span className="text-muted-foreground text-sm">Copy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Kbd>Shift</Kbd>
                  <Kbd>Enter</Kbd>
                  <span className="text-muted-foreground text-sm">New line</span>
                </div>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 33. LABEL ==================== */}
          <Section title="33. Label" id="label">
            <SubSection title="With Inputs">
              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="l-check" />
                  <Label htmlFor="l-check">Accept terms</Label>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="l-input">Email</Label>
                  <Input id="l-input" type="email" placeholder="email@example.com" />
                </div>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 34. MENUBAR ==================== */}
          <Section title="34. Menubar" id="menubar">
            <SubSection title="Full Featured">
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>File</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>
                      New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                      New Window <MenubarShortcut>⌘N</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarSub>
                      <MenubarSubTrigger>Share</MenubarSubTrigger>
                      <MenubarSubContent>
                        <MenubarItem>Email link</MenubarItem>
                        <MenubarItem>Messages</MenubarItem>
                      </MenubarSubContent>
                    </MenubarSub>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>Edit</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>
                      Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                      Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>View</MenubarTrigger>
                  <MenubarContent>
                    <MenubarCheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>
                      Status Bar
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem
                      checked={showActivityBar}
                      onCheckedChange={setShowActivityBar}
                    >
                      Activity Bar
                    </MenubarCheckboxItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </SubSection>
          </Section>

          {/* ==================== 35. NATIVE SELECT (Pattern) ==================== */}
          <Section title="35. Native Select" id="native-select">
            <SubSection title="HTML Native Select">
              <div className="grid max-w-sm gap-4" suppressHydrationWarning>
                <div className="grid gap-2">
                  <Label htmlFor="native-select">Choose an option</Label>
                  <select
                    id="native-select"
                    value={nativeSelectValue}
                    onChange={(e) => setNativeSelectValue(e.target.value)}
                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    <option value="">Select...</option>
                    <option value="apple">Apple</option>
                    <option value="banana">Banana</option>
                    <option value="orange">Orange</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="native-disabled">Disabled</Label>
                  <select
                    id="native-disabled"
                    disabled
                    className="border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option>Disabled option</option>
                  </select>
                </div>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 36. NAVIGATION MENU ==================== */}
          <Section title="36. Navigation Menu" id="navigation-menu">
            <SubSection title="With Dropdown">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 md:w-[400px] lg:grid-cols-2">
                        <NavigationMenuLink asChild>
                          <a className="hover:bg-accent block rounded-md p-3" href="#">
                            <div className="text-sm font-medium">Introduction</div>
                            <p className="text-muted-foreground text-sm">Re-usable components.</p>
                          </a>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <a className="hover:bg-accent block rounded-md p-3" href="#">
                            <div className="text-sm font-medium">Installation</div>
                            <p className="text-muted-foreground text-sm">How to install.</p>
                          </a>
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[200px] gap-3 p-4">
                        <NavigationMenuLink asChild>
                          <a className="hover:bg-accent block rounded-md p-3" href="#">
                            Alert Dialog
                          </a>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <a className="hover:bg-accent block rounded-md p-3" href="#">
                            Hover Card
                          </a>
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </SubSection>
          </Section>

          {/* ==================== 37. PAGINATION ==================== */}
          <Section title="37. Pagination" id="pagination">
            <SubSection title="Full Pagination">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">10</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </SubSection>
          </Section>

          {/* ==================== 38. POPOVER ==================== */}
          <Section title="38. Popover" id="popover">
            <SubSection title="With Form">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Dimensions</h4>
                      <p className="text-muted-foreground text-sm">Set the dimensions.</p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="width">Width</Label>
                        <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </SubSection>
          </Section>

          {/* ==================== 39. PROGRESS ==================== */}
          <Section title="39. Progress" id="progress">
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

          {/* ==================== 40. RADIO GROUP ==================== */}
          <Section title="40. Radio Group" id="radio-group">
            <SubSection title="Vertical & Horizontal">
              <div className="space-y-6">
                <RadioGroup defaultValue="comfortable">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="r1" />
                    <Label htmlFor="r1">Default</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="comfortable" id="r2" />
                    <Label htmlFor="r2">Comfortable</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="compact" id="r3" />
                    <Label htmlFor="r3">Compact</Label>
                  </div>
                </RadioGroup>
                <RadioGroup defaultValue="option-1" className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-1" id="o1" />
                    <Label htmlFor="o1">Option 1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-2" id="o2" />
                    <Label htmlFor="o2">Option 2</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-3" id="o3" />
                    <Label htmlFor="o3">Option 3</Label>
                  </div>
                </RadioGroup>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 41. RESIZABLE ==================== */}
          <Section title="41. Resizable" id="resizable">
            <SubSection title="Horizontal & Vertical">
              <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[200px] max-w-md rounded-lg border"
              >
                <ResizablePanel defaultSize={50}>
                  <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">One</span>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50}>
                  <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={25}>
                      <div className="flex h-full items-center justify-center p-6">
                        <span className="font-semibold">Two</span>
                      </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={75}>
                      <div className="flex h-full items-center justify-center p-6">
                        <span className="font-semibold">Three</span>
                      </div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </ResizablePanel>
              </ResizablePanelGroup>
            </SubSection>
          </Section>

          {/* ==================== 42. SCROLL AREA ==================== */}
          <Section title="42. Scroll Area" id="scroll-area">
            <div className="grid gap-6 md:grid-cols-2">
              <SubSection title="Vertical">
                <ScrollArea className="h-72 w-48 rounded-md border">
                  <div className="p-4">
                    <h4 className="mb-4 text-sm font-medium">Tags</h4>
                    {tags.slice(0, 15).map((tag) => (
                      <React.Fragment key={tag}>
                        <div className="text-sm">{tag}</div>
                        <Separator className="my-2" />
                      </React.Fragment>
                    ))}
                  </div>
                </ScrollArea>
              </SubSection>
              <SubSection title="Horizontal">
                <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
                  <div className="flex w-max space-x-4 p-4">
                    {artworks.map((artwork) => (
                      <figure key={artwork.artist} className="shrink-0">
                        <div className="overflow-hidden rounded-md">
                          <img
                            src={artwork.art}
                            alt={artwork.artist}
                            className="aspect-[3/4] h-48 w-36 object-cover"
                          />
                        </div>
                        <figcaption className="text-muted-foreground pt-2 text-xs">
                          {artwork.artist}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </SubSection>
            </div>
          </Section>

          {/* ==================== 43. SELECT ==================== */}
          <Section title="43. Select" id="select">
            <SubSection title="With Groups">
              <Select>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>North America</SelectLabel>
                    <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                    <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                    <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Europe</SelectLabel>
                    <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                    <SelectItem value="cet">Central European Time (CET)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </SubSection>
          </Section>

          {/* ==================== 44. SEPARATOR ==================== */}
          <Section title="44. Separator" id="separator">
            <SubSection title="Horizontal & Vertical">
              <div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Radix Primitives</h4>
                  <p className="text-muted-foreground text-sm">
                    An open-source UI component library.
                  </p>
                </div>
                <Separator className="my-4" />
                <div className="flex h-5 items-center space-x-4 text-sm">
                  <div>Blog</div>
                  <Separator orientation="vertical" />
                  <div>Docs</div>
                  <Separator orientation="vertical" />
                  <div>Source</div>
                </div>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 45. SHEET ==================== */}
          <Section title="45. Sheet" id="sheet">
            <SubSection title="All Sides">
              <div className="flex flex-wrap gap-4">
                {(["top", "right", "bottom", "left"] as const).map((side) => (
                  <Sheet key={side}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="capitalize">
                        {side}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side={side}>
                      <SheetHeader>
                        <SheetTitle>Sheet from {side}</SheetTitle>
                        <SheetDescription>This sheet slides in from the {side}.</SheetDescription>
                      </SheetHeader>
                      <div className="py-4">
                        <p>Sheet content goes here.</p>
                      </div>
                      <SheetFooter>
                        <SheetClose asChild>
                          <Button>Close</Button>
                        </SheetClose>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                ))}
              </div>
            </SubSection>
          </Section>

          {/* ==================== 46. SIDEBAR ==================== */}
          <Section title="46. Sidebar" id="sidebar">
            <SubSection title="Sidebar Preview">
              <div className="max-w-xs rounded-lg border p-4">
                <div className="mb-4 flex items-center gap-2">
                  <div className="bg-primary rounded p-1">
                    <Home className="text-primary-foreground h-4 w-4" />
                  </div>
                  <span className="font-semibold">Acme Inc</span>
                </div>
                <div className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Documents
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </div>
                <Separator className="my-4" />
                <p className="text-muted-foreground text-center text-xs">
                  See SidebarProvider for full implementation
                </p>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 47. SKELETON ==================== */}
          <Section title="47. Skeleton" id="skeleton">
            <SubSection title="Card & Content Skeleton">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 48. SLIDER ==================== */}
          <Section title="48. Slider" id="slider">
            <SubSection title="Different Values">
              <div className="max-w-md space-y-8">
                <div className="space-y-2">
                  <Label>Default (50)</Label>
                  <Slider defaultValue={[50]} max={100} step={1} />
                </div>
                <div className="space-y-2">
                  <Label>Range</Label>
                  <Slider defaultValue={[25, 75]} max={100} step={1} />
                </div>
                <div className="space-y-2">
                  <Label>With Steps (10)</Label>
                  <Slider defaultValue={[50]} max={100} step={10} />
                </div>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 49. SONNER ==================== */}
          <Section title="49. Sonner" id="sonner">
            <SubSection title="All Toast Types">
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" onClick={() => toast("Default toast")}>
                  Default
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.success("Success!", { description: "Your action was successful." })
                  }
                >
                  Success
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.error("Error!", { description: "Something went wrong." })}
                >
                  Error
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.warning("Warning!", { description: "Please be careful." })}
                >
                  Warning
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.info("Info", { description: "Here's some information." })}
                >
                  Info
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast("With Action", { action: { label: "Undo", onClick: () => {} } })
                  }
                >
                  With Action
                </Button>
              </div>
            </SubSection>
            <Toaster />
          </Section>

          {/* ==================== 50. SPINNER ==================== */}
          <Section title="50. Spinner" id="spinner">
            <SubSection title="All Sizes">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <Spinner className="h-4 w-4" />
                  <p className="text-muted-foreground mt-2 text-xs">Small</p>
                </div>
                <div className="text-center">
                  <Spinner className="h-6 w-6" />
                  <p className="text-muted-foreground mt-2 text-xs">Default</p>
                </div>
                <div className="text-center">
                  <Spinner className="h-8 w-8" />
                  <p className="text-muted-foreground mt-2 text-xs">Large</p>
                </div>
                <div className="text-center">
                  <Spinner className="h-12 w-12" />
                  <p className="text-muted-foreground mt-2 text-xs">X-Large</p>
                </div>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 51. SWITCH ==================== */}
          <Section title="51. Switch" id="switch">
            <SubSection title="All States">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="sw-1" />
                  <Label htmlFor="sw-1">Default</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="sw-2" defaultChecked />
                  <Label htmlFor="sw-2">Checked</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="sw-3" disabled />
                  <Label htmlFor="sw-3" className="text-muted-foreground">
                    Disabled
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="sw-4" disabled defaultChecked />
                  <Label htmlFor="sw-4" className="text-muted-foreground">
                    Disabled Checked
                  </Label>
                </div>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 52. TABLE ==================== */}
          <Section title="52. Table" id="table">
            <SubSection title="Full Table">
              <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.invoice}>
                      <TableCell className="font-medium">{invoice.invoice}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            invoice.paymentStatus === "Paid"
                              ? "default"
                              : invoice.paymentStatus === "Pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {invoice.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{invoice.paymentMethod}</TableCell>
                      <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$1,500.00</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </SubSection>
          </Section>

          {/* ==================== 53. TABS ==================== */}
          <Section title="53. Tabs" id="tabs">
            <SubSection title="Basic Tabs">
              <Tabs defaultValue="account" className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account</CardTitle>
                      <CardDescription>Make changes to your account.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor="t-name">Name</Label>
                        <Input id="t-name" defaultValue="Pedro Duarte" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Save</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="password">
                  <Card>
                    <CardHeader>
                      <CardTitle>Password</CardTitle>
                      <CardDescription>Change your password.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor="t-current">Current</Label>
                        <Input id="t-current" type="password" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="t-new">New</Label>
                        <Input id="t-new" type="password" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Save</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </SubSection>
          </Section>

          {/* ==================== 54. TEXTAREA ==================== */}
          <Section title="54. Textarea" id="textarea">
            <SubSection title="All States">
              <div className="grid max-w-md gap-4" suppressHydrationWarning>
                <div className="grid gap-2">
                  <Label htmlFor="ta-1">Default</Label>
                  <Textarea id="ta-1" placeholder="Type your message here." />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ta-2">Disabled</Label>
                  <Textarea id="ta-2" placeholder="Disabled" disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ta-3">With value</Label>
                  <Textarea id="ta-3" defaultValue="This textarea has a default value." />
                </div>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 55. TOAST (Pattern) ==================== */}
          <Section title="55. Toast" id="toast">
            <SubSection title="Toast Notifications (via Sonner)">
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => toast("Event has been created")}>Simple Toast</Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast("Event has been created", {
                      description: "Monday, January 3rd at 6:00pm",
                    })
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

          {/* ==================== 56. TOGGLE ==================== */}
          <Section title="56. Toggle" id="toggle">
            <SubSection title="All Variants">
              <div className="flex flex-wrap gap-4">
                <Toggle aria-label="Toggle bold">
                  <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle aria-label="Toggle italic">
                  <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle variant="outline" aria-label="Toggle underline">
                  <Underline className="h-4 w-4" />
                </Toggle>
                <Toggle disabled aria-label="Toggle disabled">
                  <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle defaultPressed aria-label="Toggle pressed">
                  <Check className="h-4 w-4" />
                </Toggle>
              </div>
            </SubSection>
            <SubSection title="With Text">
              <div className="flex flex-wrap gap-4">
                <Toggle aria-label="Toggle bold">
                  <Bold className="mr-2 h-4 w-4" /> Bold
                </Toggle>
                <Toggle aria-label="Toggle italic">
                  <Italic className="mr-2 h-4 w-4" /> Italic
                </Toggle>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 57. TOGGLE GROUP ==================== */}
          <Section title="57. Toggle Group" id="toggle-group">
            <SubSection title="Single & Multiple Selection">
              <div className="space-y-4">
                <ToggleGroup type="single">
                  <ToggleGroupItem value="bold" aria-label="Toggle bold">
                    <Bold className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="italic" aria-label="Toggle italic">
                    <Italic className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="underline" aria-label="Toggle underline">
                    <Underline className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
                <ToggleGroup type="multiple" variant="outline">
                  <ToggleGroupItem value="bold" aria-label="Toggle bold">
                    <Bold className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="italic" aria-label="Toggle italic">
                    <Italic className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="underline" aria-label="Toggle underline">
                    <Underline className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 58. TOOLTIP ==================== */}
          <Section title="58. Tooltip" id="tooltip">
            <SubSection title="Different Positions">
              <div className="flex flex-wrap gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Top</Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Tooltip on top</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Right</Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Tooltip on right</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Bottom</Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Tooltip on bottom</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Left</Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Tooltip on left</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </SubSection>
          </Section>

          {/* ==================== 59. TYPOGRAPHY (Pattern) ==================== */}
          <Section title="59. Typography" id="typography">
            <SubSection title="All Heading Levels">
              <div className="space-y-4">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Heading 1
                </h1>
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                  Heading 2
                </h2>
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Heading 3</h3>
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Heading 4</h4>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  This is a paragraph with some <strong>bold text</strong> and <em>italic text</em>.
                </p>
                <blockquote className="mt-6 border-l-2 pl-6 italic">
                  &ldquo;This is a blockquote.&rdquo;
                </blockquote>
                <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                  inline code
                </code>
                <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                  <li>First item</li>
                  <li>Second item</li>
                  <li>Third item</li>
                </ul>
              </div>
            </SubSection>
            <SubSection title="Text Styles">
              <div className="space-y-2">
                <p className="text-muted-foreground text-xl">Lead paragraph style</p>
                <p className="text-lg font-semibold">Large text</p>
                <p className="text-muted-foreground text-sm">Small muted text</p>
                <p className="text-sm font-medium leading-none">Small medium text</p>
              </div>
            </SubSection>
          </Section>

          {/* Footer */}
          <div className="border-t pt-8 text-center">
            <p className="text-muted-foreground text-sm">
              Total: {components.length} shadcn/ui components (matching official documentation)
            </p>
            <p className="text-muted-foreground mt-2 text-xs">Tailwind CSS v3 + Next.js</p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
