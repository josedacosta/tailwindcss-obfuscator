"use client";

import { Section, SubSection } from "./helpers";

export function TypographyShowcase() {
  return (
    <Section
      title="59. Typography"
      id="typography"
      docUrl="https://ui.shadcn.com/docs/components/typography"
    >
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
      <SubSection title="Real Use Case: The Joke Tax Chronicles">
        <div>
          <h1 className="scroll-m-20 text-balance text-4xl font-extrabold tracking-tight">
            Taxing Laughter: The Joke Tax Chronicles
          </h1>
          <p className="text-muted-foreground text-xl leading-7 [&:not(:first-child)]:mt-6">
            Once upon a time, in a far-off land, there was a very lazy king who spent all day
            lounging on his throne. One day, his advisors came to him with a problem: the kingdom
            was running out of money.
          </p>
          <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            The King&apos;s Plan
          </h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            The king thought long and hard, and finally came up with{" "}
            <a href="#" className="text-primary font-medium underline underline-offset-4">
              a brilliant plan
            </a>
            : he would tax the jokes in the kingdom.
          </p>
          <blockquote className="mt-6 border-l-2 pl-6 italic">
            &quot;After all,&quot; he said, &quot;everyone enjoys a good joke, so it&apos;s only
            fair that they should pay for the privilege.&quot;
          </blockquote>
          <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">The Joke Tax</h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            The king&apos;s subjects were not amused. They grumbled and complained, but the king was
            firm:
          </p>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>1st level of puns: 5 gold coins</li>
            <li>2nd level of jokes: 10 gold coins</li>
            <li>3rd level of one-liners: 20 gold coins</li>
          </ul>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            As a result, people stopped telling jokes, and the kingdom fell into a gloom. But there
            was one person who refused to let the king&apos;s foolishness get him down: a court
            jester named Jokester.
          </p>
          <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
            Jokester&apos;s Revolt
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Jokester began sneaking into the castle in the middle of the night and leaving jokes all
            over the place: under the king&apos;s pillow, in his soup, even in the royal toilet. The
            king was furious, but he couldn&apos;t seem to stop Jokester.
          </p>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            And then, one day, the people of the kingdom discovered that the jokes left by Jokester
            were so funny that they couldn&apos;t help but laugh. And once they started laughing,
            they couldn&apos;t stop.
          </p>
          <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
            The People&apos;s Rebellion
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            The people of the kingdom, feeling uplifted by the laughter, started to tell jokes and
            puns again, and soon the entire kingdom was in on the joke.
          </p>
          <div className="my-6 w-full overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="even:bg-muted m-0 border-t p-0">
                  <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                    King&apos;s Treasury
                  </th>
                  <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                    People&apos;s happiness
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="even:bg-muted m-0 border-t p-0">
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    Empty
                  </td>
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    Overflowing
                  </td>
                </tr>
                <tr className="even:bg-muted m-0 border-t p-0">
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    Modest
                  </td>
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    Satisfied
                  </td>
                </tr>
                <tr className="even:bg-muted m-0 border-t p-0">
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    Full
                  </td>
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    Ecstatic
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            The king, seeing how much happier his subjects were, realized the error of his ways and
            repealed the joke tax. Jokester was declared a hero, and the kingdom lived happily ever
            after.
          </p>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            The moral of the story is: never underestimate the power of a good laugh and always be
            careful of bad ideas.
          </p>
        </div>
      </SubSection>
    </Section>
  );
}
