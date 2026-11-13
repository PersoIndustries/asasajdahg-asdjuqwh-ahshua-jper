<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Resolve CMS media through `media-local.ts` in public views and admin previews; blank product/material image fields use the construction placeholder, so external hosting and the manager show the same result.
- Cultivation guides use the `guias` table as their content source with admin CRUD and public published-only reads; never restore deleted guides from static content.
- Gallery descriptions live in `galerias.ts`; the manager only drafts and copies changes, keeping these texts out of the database.
