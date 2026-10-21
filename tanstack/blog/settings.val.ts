import { s, c } from "./val.config";

/**
 * The project's settings: what Val Studio does in this project.
 *
 * One per project, at the root of the content tree. Every section is
 * optional, so `{}` is a complete settings module: open Settings in the
 * Studio to set the assistant up, give the Studio your colours and logo, or
 * add the languages the site is in. What is set there is published like any
 * other content.
 */
export default c.define("/settings.val.ts", s.settings(), {});
