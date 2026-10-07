/**
 * The order of the docs, worked out from the pages themselves.
 *
 * Nothing here is stored as an order. Each page says which group it belongs to
 * and, optionally, which page comes next; from that:
 *
 * 1. Pages are read along their `next` links. A chain starts at a page no other
 *    page points to, and chains are taken in the order of their first page's
 *    URL.
 * 2. Pages that link to nothing and are linked from nothing come after every
 *    chain, in URL order.
 * 3. A cycle (A → B → C → A) has no page nobody points to, so it would never be
 *    started. It is started at its lowest URL instead, and the link back into
 *    it is not followed. `docsLinkProblems` reports it, so an editor sees it in
 *    the Studio; this only keeps the site working while it is there.
 * 4. Groups are shown in the order their first page appears, and every page
 *    of a group is listed under it — a chain that leaves a group and comes back
 *    does not make the group appear twice.
 *
 * "Previous" is not stored at all. It is the page whose `next` is this one, so
 * the Previous and Next links at the bottom of a page cannot disagree.
 *
 * Plain strings in, plain data out, and no import of Val: the module's own
 * validation (`_site.docs.$.val.ts`) runs this on raw source, and the site runs
 * it on what the hooks return, after `val.raw`.
 */

export type DocLink = {
  /** The page's URL: its key in the docs module. */
  url: string;
  group: string;
  /** The URL of the page that comes after this one, if any. */
  next: string | null;
};

export type DocsGroup = { label: string; urls: string[] };

export type DocsOrder = {
  /** Every page, in reading order. */
  sequence: string[];
  /** The sidebar: groups in order, each with its pages in order. */
  groups: DocsGroup[];
  /** The page whose `next` is this one; first by URL if several are. */
  previous: Map<string, string>;
  /** The page this one links to, where that page exists. */
  next: Map<string, string>;
};

/**
 * Two spellings of a group that a person would call the same group.
 *
 * Case and the spaces at either end do not matter, and runs of spaces count as
 * one, so "Getting started " and "getting  Started" are one heading, labelled
 * the way its first page spells it.
 */
export function groupKey(group: string): string {
  return group.trim().replace(/\s+/g, " ").toLowerCase();
}

const byUrl = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

export function docsOrder(pages: DocLink[]): DocsOrder {
  const byKey = new Map(pages.map((page) => [page.url, page]));
  const urls = [...byKey.keys()].sort(byUrl);

  // Only links to a page that exists, and not to itself, count.
  const next = new Map<string, string>();
  for (const url of urls) {
    const target = byKey.get(url)?.next;
    if (target && target !== url && byKey.has(target)) {
      next.set(url, target);
    }
  }
  const previous = new Map<string, string>();
  for (const url of urls) {
    const target = next.get(url);
    if (target !== undefined && !previous.has(target)) {
      previous.set(target, url);
    }
  }

  const sequence: string[] = [];
  const visited = new Set<string>();
  const walk = (start: string) => {
    let current: string | undefined = start;
    while (current !== undefined && !visited.has(current)) {
      visited.add(current);
      sequence.push(current);
      current = next.get(current);
    }
  };
  const isLinked = (url: string) => next.has(url) || previous.has(url);
  // 1. Chains, from the pages nobody points to.
  for (const url of urls) {
    if (isLinked(url) && !previous.has(url)) walk(url);
  }
  // 3. Cycles: whatever is linked and still unvisited, from its lowest URL.
  for (const url of urls) {
    if (isLinked(url)) walk(url);
  }
  // 2. Everything else.
  for (const url of urls) {
    walk(url);
  }

  // 4. Groups, in the order of their first page.
  const groups = new Map<string, DocsGroup>();
  for (const url of sequence) {
    const raw = byKey.get(url)?.group ?? "";
    const key = groupKey(raw);
    const group = groups.get(key);
    if (group) {
      group.urls.push(url);
    } else {
      groups.set(key, { label: raw.trim().replace(/\s+/g, " "), urls: [url] });
    }
  }

  return { sequence, groups: [...groups.values()], previous, next };
}

/**
 * What is wrong with the links, in words an editor can act on.
 *
 * Empty when the links make one clear order. The docs module's validation
 * shows these in the Studio; `docsOrder` copes with every one of them, so the
 * site keeps working while they are fixed.
 */
export function docsLinkProblems(pages: DocLink[]): string[] {
  const urls = new Set(pages.map((page) => page.url));
  const problems: string[] = [];

  const pointedFrom = new Map<string, string[]>();
  for (const page of [...pages].sort((a, b) => byUrl(a.url, b.url))) {
    if (!page.next) continue;
    if (page.next === page.url) {
      problems.push(`${page.url} is set to come after itself.`);
      continue;
    }
    if (!urls.has(page.next)) continue; // the route field reports this one
    const sources = pointedFrom.get(page.next) ?? [];
    sources.push(page.url);
    pointedFrom.set(page.next, sources);
  }
  for (const [target, sources] of pointedFrom) {
    if (sources.length > 1) {
      problems.push(
        `${sources.join(" and ")} all say ${target} comes next. Only one page can come before it; change the others.`,
      );
    }
  }

  // A cycle is a walk along `next` that comes back to where it started.
  const next = new Map(
    pages
      .filter(
        (page) => page.next && page.next !== page.url && urls.has(page.next),
      )
      .map((page) => [page.url, page.next as string]),
  );
  const reported = new Set<string>();
  for (const start of [...urls].sort(byUrl)) {
    if (reported.has(start)) continue;
    const path: string[] = [];
    const onPath = new Set<string>();
    let current: string | undefined = start;
    while (
      current !== undefined &&
      !onPath.has(current) &&
      !reported.has(current)
    ) {
      path.push(current);
      onPath.add(current);
      current = next.get(current);
    }
    if (current !== undefined && onPath.has(current)) {
      const cycle = path.slice(path.indexOf(current));
      cycle.forEach((url) => reported.add(url));
      problems.push(
        `${[...cycle, cycle[0]].join(" → ")} goes round in a circle. Clear "Next" on one of them.`,
      );
    }
    path.forEach((url) => reported.add(url));
  }
  return problems;
}
