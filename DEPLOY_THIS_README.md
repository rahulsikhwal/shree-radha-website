# Deploy this exact folder to Vercel

The Vercel error `No Next.js version detected` happens when Vercel cannot see the `package.json` that contains `next` in dependencies.

This revised zip is packaged with `package.json` at the zip root. After unzipping, upload/commit the files from this folder directly to your GitHub repository root.

Your GitHub repository root must look like this:

- app/
- components/
- lib/
- public/
- supabase/
- package.json
- next.config.js
- vercel.json
- tailwind.config.js
- postcss.config.js

Do not upload the whole parent folder as a nested folder like `shree-radha-website-main/package.json` unless Vercel Root Directory is set to `shree-radha-website-main`.

Recommended Vercel settings:

- Framework Preset: Next.js
- Root Directory: leave blank / repository root
- Install Command: npm install
- Build Command: npm run build
- Output Directory: .next
- Node.js: 20.x

Required environment variables if using Supabase:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## Latest admin image upload update
- Product edit section now shows the currently selected/existing image preview.
- Admin can select a new image using the Choose Image dialog box.
- Recommended product image: 1200 x 1200 px square, under 2 MB.
- Supported formats: JPG, PNG, WEBP.
- Run `supabase/schema.sql` once in Supabase SQL Editor to create/update the `product-images` public storage bucket and policies.
