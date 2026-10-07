import type { Meta, StoryObj } from "@storybook/react";
import { text } from "../../stories/fixtures";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import type { DocPageSchema } from "./doc.val";
import { DocsPager } from "./DocsPager";
import { DocsSidebar } from "./DocsSidebar";
import { docsOrder } from "./docsOrder.val";

const meta = {
  title: "Docs",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const page = (title: string): DocPageSchema => ({
  title: text(title),
  description: null,
  group: text("Getting started"),
  next: null,
  blocks: [],
});

const order = docsOrder([
  {
    url: "/docs/introduction",
    group: "Getting started",
    next: "/docs/install",
  },
  {
    url: "/docs/install",
    group: "Getting started",
    next: "/docs/guides/deploy",
  },
  { url: "/docs/guides/deploy", group: "Guides", next: null },
  { url: "/docs/guides/themes", group: "Guides", next: null },
]);
const byUrl = new Map<string, DocPageSchema>([
  ["/docs/introduction", page("Introduction")],
  ["/docs/install", page("Installation")],
  ["/docs/guides/deploy", page("Deploying")],
  ["/docs/guides/themes", page("Themes")],
]);

export const Sidebar: Story = {
  render: () => (
    <div className="max-w-56">
      <DocsSidebar
        groups={order.groups}
        byUrl={byUrl}
        current="/docs/install"
      />
    </div>
  ),
};

export const Code: Story = {
  render: () => (
    <CodeBlock
      filename={text("Terminal")}
      code={text("pnpm install\npnpm dev")}
    />
  ),
};

export const Callouts: Story = {
  render: () => (
    <div className="max-w-2xl">
      {(["note", "tip", "warning"] as const).map((tone) => (
        <Callout
          key={tone}
          tone={tone}
          title={null}
          text={[{ tag: "p", children: [`A ${tone}, in a sentence or two.`] }]}
        />
      ))}
    </div>
  ),
};

export const Pager: Story = {
  render: () => (
    <div className="max-w-2xl">
      <DocsPager
        previous={{ url: "/docs/introduction", page: page("Introduction") }}
        next={{ url: "/docs/guides/deploy", page: page("Deploying") }}
      />
    </div>
  ),
};
