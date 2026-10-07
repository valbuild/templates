import { test } from "node:test";
import assert from "node:assert/strict";
import { docsLinkProblems, docsOrder, type DocLink } from "./docsOrder.val";

const page = (
  url: string,
  group: string,
  next: string | null = null,
): DocLink => ({
  url,
  group,
  next,
});

test("a chain is read along its links, whatever the URLs say", () => {
  const order = docsOrder([
    page("/docs/a", "Start", null),
    page("/docs/c", "Start", "/docs/b"),
    page("/docs/b", "Start", "/docs/a"),
  ]);
  assert.deepEqual(order.sequence, ["/docs/c", "/docs/b", "/docs/a"]);
});

test("pages with no links come after the chains, in URL order", () => {
  const order = docsOrder([
    page("/docs/z", "Start", "/docs/y"),
    page("/docs/y", "Start"),
    page("/docs/b", "Start"),
    page("/docs/a", "Start"),
  ]);
  assert.deepEqual(order.sequence, [
    "/docs/z",
    "/docs/y",
    "/docs/a",
    "/docs/b",
  ]);
});

test("chains are taken in the order of their first page's URL", () => {
  const order = docsOrder([
    page("/docs/m", "G", "/docs/n"),
    page("/docs/n", "G"),
    page("/docs/b", "G", "/docs/c"),
    page("/docs/c", "G"),
  ]);
  assert.deepEqual(order.sequence, [
    "/docs/b",
    "/docs/c",
    "/docs/m",
    "/docs/n",
  ]);
});

test("a cycle is started at its lowest URL, and every page still appears once", () => {
  const order = docsOrder([
    page("/docs/c", "G", "/docs/a"),
    page("/docs/a", "G", "/docs/b"),
    page("/docs/b", "G", "/docs/c"),
    page("/docs/x", "G"),
  ]);
  assert.deepEqual(order.sequence, [
    "/docs/a",
    "/docs/b",
    "/docs/c",
    "/docs/x",
  ]);
});

test("a link to a missing page, or to itself, is ignored", () => {
  const order = docsOrder([
    page("/docs/a", "G", "/docs/gone"),
    page("/docs/b", "G", "/docs/b"),
  ]);
  assert.deepEqual(order.sequence, ["/docs/a", "/docs/b"]);
  assert.equal(order.next.size, 0);
  assert.equal(order.previous.size, 0);
});

test("previous is the page that links here", () => {
  const order = docsOrder([
    page("/docs/a", "G", "/docs/b"),
    page("/docs/b", "G"),
  ]);
  assert.equal(order.previous.get("/docs/b"), "/docs/a");
  assert.equal(order.next.get("/docs/a"), "/docs/b");
  assert.equal(order.previous.get("/docs/a"), undefined);
});

test("two pages linking to one: the first by URL is its previous", () => {
  const order = docsOrder([
    page("/docs/b", "G", "/docs/c"),
    page("/docs/a", "G", "/docs/c"),
    page("/docs/c", "G"),
  ]);
  assert.equal(order.previous.get("/docs/c"), "/docs/a");
  assert.equal(new Set(order.sequence).size, 3);
});

test("groups are in the order of their first page, and a group is listed once", () => {
  const order = docsOrder([
    page("/docs/a", "Start", "/docs/b"),
    page("/docs/b", "Guides", "/docs/c"),
    page("/docs/c", "Start"),
  ]);
  assert.deepEqual(order.groups, [
    { label: "Start", urls: ["/docs/a", "/docs/c"] },
    { label: "Guides", urls: ["/docs/b"] },
  ]);
});

test("group spellings that differ in case and spacing are one group", () => {
  const order = docsOrder([
    page("/docs/a", "Getting started ", "/docs/b"),
    page("/docs/b", "getting  Started"),
  ]);
  assert.deepEqual(order.groups, [
    { label: "Getting started", urls: ["/docs/a", "/docs/b"] },
  ]);
});

test("clear links report no problems", () => {
  assert.deepEqual(
    docsLinkProblems([
      page("/docs/a", "G", "/docs/b"),
      page("/docs/b", "G"),
      page("/docs/c", "G"),
    ]),
    [],
  );
});

test("a cycle is reported once, naming its pages", () => {
  const problems = docsLinkProblems([
    page("/docs/b", "G", "/docs/c"),
    page("/docs/a", "G", "/docs/b"),
    page("/docs/c", "G", "/docs/a"),
  ]);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /\/docs\/a → \/docs\/b → \/docs\/c → \/docs\/a/);
});

test("two pages naming the same next page are reported", () => {
  const problems = docsLinkProblems([
    page("/docs/a", "G", "/docs/c"),
    page("/docs/b", "G", "/docs/c"),
    page("/docs/c", "G"),
  ]);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /\/docs\/a and \/docs\/b/);
});

test("a page that comes after itself is reported", () => {
  assert.equal(docsLinkProblems([page("/docs/a", "G", "/docs/a")]).length, 1);
});
