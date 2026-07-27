Add a guides section ("Guías / Blog") to the remixed Jardiper site. Start with a static, SEO-friendly implementation that does not require a backend.

What will be built
- `/guias` — a listing page showing all growing guides and articles, with search/filter by category (huerto, jardín, frutales, sustratos).
- `/guias/$slug` — a detail page for each guide with rich text content, published date, reading time, related guides, and SEO metadata.
- Guide data stored as static JSON/markdown modules under `src/content/guides/` so content is version-controlled and fast.
- Navigation updated to include a "Guías" link in the top nav and footer.
- i18n entries added for the new pages in `es`, `en`, `fr`, and `de`.
- SEO: unique `head()` metadata, canonical links, and JSON-LD `Article` schema on detail pages.

Initial content (5 guides)
1. Calendario de siembra de primavera
2. Cómo plantar tomates en el Bajo Cinca
3. Poda básica de frutales de hoja caduca
4. Elegir sustrato: tierra universal vs. específica
5. Compostaje doméstico paso a paso

Technical notes
- Uses existing TanStack Start file-based routing.
- No database or auth required; content is static.
- Reuses existing `SiteLayout`, `Section`, and design tokens.
- Keeps the existing PDF asset guides available and links them from the new section.

Verification
- Build passes and routes resolve correctly.
- Listing and detail pages render in the preview.
- Navigation links work in desktop and mobile menus.