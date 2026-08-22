# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Deploy to Netlify

This project is configured to deploy to **Netlify Functions** using the Nitro `netlify` preset.

1. Push the repository to GitHub/GitLab/Bitbucket.
2. In the Netlify dashboard, click **Add new site → Import an existing project** and select the repo.
3. Netlify will detect the `netlify.toml` file and use:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add the following environment variables in **Site settings → Environment variables**:
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
5. Deploy the site.

> **Note:** The Lovable sandbox builds the app for its own Cloudflare preview, so the Netlify preset is only applied when building outside the sandbox (e.g., in Netlify's CI).

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
- Supabase

