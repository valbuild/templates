import type { Meta, StoryObj } from "@storybook/react";
import { Grid } from "../base/Grid";
import { Byline } from "./Byline";
import { PostBody } from "./PostBody";
import { PostCard } from "./PostCard";
import type { PostSchema } from "./post.val";
import { landscape, portrait, square, text } from "../../stories/fixtures";

const meta = {
  title: "Blog",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const post: PostSchema = {
  title: text("Hello, world"),
  description: text(
    "The first post on a new blog: what is here, where it lives, and how to change it.",
  ),
  published: text("2026-10-01"),
  author: text("ada"),
  cover: landscape,
  body: [
    {
      tag: "p",
      children: [
        "Every post on this blog is content in the repository. ",
        { tag: "span", styles: ["bold"], children: ["New page"] },
        " in Val Studio adds one.",
      ],
    },
    { tag: "h2", children: ["What a post is made of"] },
    {
      tag: "ul",
      children: [
        { tag: "li", children: [{ tag: "p", children: ["A title"] }] },
        { tag: "li", children: [{ tag: "p", children: ["A date"] }] },
        { tag: "li", children: [{ tag: "p", children: ["An author"] }] },
      ],
    },
    { tag: "p", children: [{ tag: "img", src: square }] },
    {
      tag: "p",
      children: [
        "Links can go anywhere: ",
        { tag: "a", href: "https://val.build", children: ["val.build"] },
        ".",
      ],
    },
  ],
};

export const Cards: Story = {
  render: () => (
    <Grid columns={3}>
      <PostCard url="/blog/hello-world" post={post} />
      <PostCard
        url="/blog/portrait"
        post={{
          ...post,
          title: text("A post with a tall cover"),
          cover: portrait,
        }}
      />
      <PostCard
        url="/blog/no-cover"
        post={{ ...post, title: text("A post with no cover"), cover: null }}
      />
    </Grid>
  ),
};

export const Author: Story = {
  render: () => (
    <Byline
      author={{
        name: text("Ada Hansen"),
        role: text("Editor"),
        avatar: square,
        bio: null,
      }}
      published={text("2026-10-01")}
    />
  ),
};

export const Body: Story = {
  render: () => (
    <div className="max-w-2xl">
      <PostBody value={post.body} />
    </div>
  ),
};
