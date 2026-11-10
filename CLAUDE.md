# Project guidelines

Parallel reader: Codex Sinaiticus (Greek) beside an Arabic Gospel translation.
Next.js (App Router) + Tailwind CSS. See README.md for the data pipeline.

## Layout

- Side-by-side text columns (Greek sheet / Arabic sheet) always end at the same
  level: equal-height columns (grid `items-stretch`), never `items-start`.
- The chapter navigation (‹ Book N ▾ ›) in every header is always centred on the
  page: header uses a `grid-cols-[1fr_auto_1fr]` grid, not `justify-between`.

## Keep components and files small

- One component per file, with one clear job. Aim for under ~100 lines per
  component file; treat ~150 as the point where it must be split.
- When adding a feature, create new small components in `src/components/`
  rather than growing an existing page or component.
- Pages in `src/app/` should mostly compose components: load data, pass props,
  lay out. Move rendering details into components and logic into `src/lib/`.
- Pull out repeated markup (headers, menus, sheets, ornaments) into shared
  components instead of copying it between pages.
- Pure helpers (formatting, grouping, numbering) go in `src/lib/`, not inside
  components.
- Generated data (`src/data/`) and raw sources (`sources/`) are exempt.
