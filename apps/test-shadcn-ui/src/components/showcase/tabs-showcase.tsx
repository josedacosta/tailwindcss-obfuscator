"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Section, SubSection } from "./helpers";

export function TabsShowcase() {
  return (
    <Section title="53. Tabs" id="tabs" docUrl="https://ui.shadcn.com/docs/components/tabs">
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
  );
}
