import { themeAttributes, themeCss } from "./themeCss";
import type { Theme } from "./types";

/**
 * Applies a theme to everything inside it.
 *
 * Renders the theme's variables as a `<style>` (on `:root`, so `<html>` gets
 * the background too) and the attribute-shaped choices on a wrapping element.
 * Server rendered, so the first paint is already themed.
 *
 * Knows nothing about Val: the site layout reads `theme.val.ts` and passes the
 * resolved theme in, and Storybook passes a preset.
 */
export function ThemeRoot({
  theme,
  children,
  className,
}: {
  theme: Theme;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeCss(theme) }} />
      <div {...themeAttributes(theme)} className={className}>
        {children}
      </div>
    </>
  );
}
