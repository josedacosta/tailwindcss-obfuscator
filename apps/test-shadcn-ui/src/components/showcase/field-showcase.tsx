"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Section, SubSection } from "./helpers";

export function FieldShowcase() {
  const [priceRange, setPriceRange] = React.useState([200, 800]);

  return (
    <Section title="25. Field" id="field" docUrl="https://ui.shadcn.com/docs/components/field">
      <SubSection title="Field">
        <div className="w-full max-w-md">
          <form>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Payment Method</FieldLegend>
                <FieldDescription>All transactions are secure and encrypted</FieldDescription>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="checkout-card-name">Name on Card</FieldLabel>
                    <Input id="checkout-card-name" placeholder="Evil Rabbit" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="checkout-card-number">Card Number</FieldLabel>
                    <Input id="checkout-card-number" placeholder="1234 5678 9012 3456" required />
                    <FieldDescription>Enter your 16-digit card number</FieldDescription>
                  </Field>
                  <div className="grid grid-cols-3 gap-4">
                    <Field>
                      <FieldLabel htmlFor="checkout-exp-month">Month</FieldLabel>
                      <Select defaultValue="">
                        <SelectTrigger id="checkout-exp-month">
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "01",
                            "02",
                            "03",
                            "04",
                            "05",
                            "06",
                            "07",
                            "08",
                            "09",
                            "10",
                            "11",
                            "12",
                          ].map((m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="checkout-exp-year">Year</FieldLabel>
                      <Select defaultValue="">
                        <SelectTrigger id="checkout-exp-year">
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {["2024", "2025", "2026", "2027", "2028", "2029"].map((y) => (
                            <SelectItem key={y} value={y}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="checkout-cvv">CVV</FieldLabel>
                      <Input id="checkout-cvv" placeholder="123" required />
                    </Field>
                  </div>
                </FieldGroup>
              </FieldSet>
              <FieldSeparator />
              <FieldSet>
                <FieldLegend>Billing Address</FieldLegend>
                <FieldDescription>
                  The billing address associated with your payment method
                </FieldDescription>
                <FieldGroup>
                  <Field orientation="horizontal">
                    <Checkbox id="checkout-same-as-shipping" defaultChecked />
                    <FieldLabel htmlFor="checkout-same-as-shipping" className="font-normal">
                      Same as shipping address
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="checkout-comments">Comments</FieldLabel>
                    <Textarea
                      id="checkout-comments"
                      placeholder="Add any additional comments"
                      className="resize-none"
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <Field orientation="horizontal">
                <Button type="submit">Submit</Button>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </SubSection>
      <SubSection title="Input">
        <div className="w-full max-w-md">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="field-username">Username</FieldLabel>
                <Input id="field-username" type="text" placeholder="Max Leiter" />
                <FieldDescription>Choose a unique username for your account.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="field-password">Password</FieldLabel>
                <FieldDescription>Must be at least 8 characters long.</FieldDescription>
                <Input id="field-password" type="password" placeholder="••••••••" />
              </Field>
            </FieldGroup>
          </FieldSet>
        </div>
      </SubSection>
      <SubSection title="Textarea">
        <div className="w-full max-w-md">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="field-feedback">Feedback</FieldLabel>
                <Textarea
                  id="field-feedback"
                  placeholder="Your feedback helps us improve..."
                  rows={4}
                />
                <FieldDescription>Share your thoughts about our service.</FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
        </div>
      </SubSection>
      <SubSection title="Select">
        <div className="w-full max-w-md">
          <Field>
            <FieldLabel>Department</FieldLabel>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="support">Customer Support</SelectItem>
                <SelectItem value="hr">Human Resources</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>Select your department or area of work.</FieldDescription>
          </Field>
        </div>
      </SubSection>
      <SubSection title="Slider">
        <div className="w-full max-w-md">
          <Field>
            <FieldTitle>Price Range</FieldTitle>
            <FieldDescription>
              Set your budget range ($
              <span className="font-medium tabular-nums">{priceRange[0]}</span> -{" "}
              <span className="font-medium tabular-nums">{priceRange[1]}</span>).
            </FieldDescription>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={1000}
              min={0}
              step={10}
              className="mt-2 w-full"
              aria-label="Price Range"
            />
          </Field>
        </div>
      </SubSection>
      <SubSection title="Fieldset">
        <div className="w-full max-w-md space-y-6">
          <FieldSet>
            <FieldLegend>Address Information</FieldLegend>
            <FieldDescription>We need your address to deliver your order.</FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="field-street">Street Address</FieldLabel>
                <Input id="field-street" type="text" placeholder="123 Main St" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="field-city">City</FieldLabel>
                  <Input id="field-city" type="text" placeholder="New York" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="field-zip">Postal Code</FieldLabel>
                  <Input id="field-zip" type="text" placeholder="90502" />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
        </div>
      </SubSection>
      <SubSection title="Checkbox">
        <div className="w-full max-w-md">
          <FieldGroup>
            <FieldSet>
              <FieldLegend variant="label">Show these items on the desktop</FieldLegend>
              <FieldDescription>Select the items you want to show on the desktop.</FieldDescription>
              <FieldGroup className="gap-3">
                <Field orientation="horizontal">
                  <Checkbox id="finder-hard-disks" defaultChecked />
                  <FieldLabel htmlFor="finder-hard-disks" className="font-normal">
                    Hard disks
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="finder-external-disks" />
                  <FieldLabel htmlFor="finder-external-disks" className="font-normal">
                    External disks
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="finder-cds-dvds" />
                  <FieldLabel htmlFor="finder-cds-dvds" className="font-normal">
                    CDs, DVDs, and iPods
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="finder-connected-servers" />
                  <FieldLabel htmlFor="finder-connected-servers" className="font-normal">
                    Connected servers
                  </FieldLabel>
                </Field>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <Field orientation="horizontal">
              <Checkbox id="finder-sync-folders" defaultChecked />
              <FieldContent>
                <FieldLabel htmlFor="finder-sync-folders">
                  Sync Desktop & Documents folders
                </FieldLabel>
                <FieldDescription>
                  Your Desktop & Documents folders are being synced with iCloud Drive. You can
                  access them from other devices.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </div>
      </SubSection>
      <SubSection title="Radio">
        <div className="w-full max-w-md">
          <FieldSet>
            <FieldLabel>Subscription Plan</FieldLabel>
            <FieldDescription>
              Yearly and lifetime plans offer significant savings.
            </FieldDescription>
            <RadioGroup defaultValue="monthly">
              <Field orientation="horizontal">
                <RadioGroupItem value="monthly" id="plan-monthly" />
                <FieldLabel htmlFor="plan-monthly" className="font-normal">
                  Monthly ($9.99/month)
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="yearly" id="plan-yearly" />
                <FieldLabel htmlFor="plan-yearly" className="font-normal">
                  Yearly ($99.99/year)
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value="lifetime" id="plan-lifetime" />
                <FieldLabel htmlFor="plan-lifetime" className="font-normal">
                  Lifetime ($299.99)
                </FieldLabel>
              </Field>
            </RadioGroup>
          </FieldSet>
        </div>
      </SubSection>
      <SubSection title="Switch">
        <div className="w-full max-w-md">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="field-2fa">Multi-factor authentication</FieldLabel>
              <FieldDescription>
                Enable multi-factor authentication. If you do not have a two-factor device, you can
                use a one-time code sent to your email.
              </FieldDescription>
            </FieldContent>
            <Switch id="field-2fa" />
          </Field>
        </div>
      </SubSection>
      <SubSection title="Choice Card">
        <div className="w-full max-w-md">
          <FieldGroup>
            <FieldSet>
              <FieldLabel htmlFor="compute-environment">Compute Environment</FieldLabel>
              <FieldDescription>Select the compute environment for your cluster.</FieldDescription>
              <RadioGroup defaultValue="kubernetes">
                <FieldLabel htmlFor="kubernetes-option">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Kubernetes</FieldTitle>
                      <FieldDescription>
                        Run GPU workloads on a K8s configured cluster.
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="kubernetes" id="kubernetes-option" />
                  </Field>
                </FieldLabel>
                <FieldLabel htmlFor="vm-option">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Virtual Machine</FieldTitle>
                      <FieldDescription>
                        Access a VM configured cluster to run GPU workloads.
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="vm" id="vm-option" />
                  </Field>
                </FieldLabel>
              </RadioGroup>
            </FieldSet>
          </FieldGroup>
        </div>
      </SubSection>
      <SubSection title="Field Group">
        <div className="w-full max-w-md">
          <FieldGroup>
            <FieldSet>
              <FieldLabel>Responses</FieldLabel>
              <FieldDescription>
                Get notified when ChatGPT responds to requests that take time, like research or
                image generation.
              </FieldDescription>
              <FieldGroup data-slot="checkbox-group">
                <Field orientation="horizontal">
                  <Checkbox id="notif-push" defaultChecked disabled />
                  <FieldLabel htmlFor="notif-push" className="font-normal">
                    Push notifications
                  </FieldLabel>
                </Field>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            <FieldSet>
              <FieldLabel>Tasks</FieldLabel>
              <FieldDescription>
                Get notified when tasks you&apos;ve created have updates.{" "}
                <a href="#" className="underline">
                  Manage tasks
                </a>
              </FieldDescription>
              <FieldGroup data-slot="checkbox-group">
                <Field orientation="horizontal">
                  <Checkbox id="notif-push-tasks" />
                  <FieldLabel htmlFor="notif-push-tasks" className="font-normal">
                    Push notifications
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="notif-email-tasks" />
                  <FieldLabel htmlFor="notif-email-tasks" className="font-normal">
                    Email notifications
                  </FieldLabel>
                </Field>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </div>
      </SubSection>
      <SubSection title="Responsive Layout">
        <div className="w-full max-w-4xl">
          <form>
            <FieldSet>
              <FieldLegend>Profile</FieldLegend>
              <FieldDescription>Fill in your profile information.</FieldDescription>
              <FieldSeparator />
              <FieldGroup>
                <Field orientation="responsive">
                  <FieldContent>
                    <FieldLabel htmlFor="profile-name">Name</FieldLabel>
                    <FieldDescription>Provide your full name for identification</FieldDescription>
                  </FieldContent>
                  <Input id="profile-name" placeholder="Evil Rabbit" required />
                </Field>
                <FieldSeparator />
                <Field orientation="responsive">
                  <FieldContent>
                    <FieldLabel htmlFor="profile-message">Message</FieldLabel>
                    <FieldDescription>
                      You can write your message here. Keep it short, preferably under 100
                      characters.
                    </FieldDescription>
                  </FieldContent>
                  <Textarea
                    id="profile-message"
                    placeholder="Hello, world!"
                    required
                    className="min-h-[100px] resize-none sm:min-w-[300px]"
                  />
                </Field>
                <FieldSeparator />
                <Field orientation="responsive">
                  <Button type="submit">Submit</Button>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </div>
      </SubSection>
    </Section>
  );
}
