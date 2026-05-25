# Latest Admin + Frontend Fixes

This package is the corrected version for the issue where the deployed admin still showed the old two-column panel.

## What is included

- New admin tab navigation: Settings, Content, Products, Stats, Enquiries.
- Homepage Stats editor for counters such as `5000+ Daily Pair Capacity`.
- Enquiries inbox for contact form submissions.
- About/Homepage content editor.
- Green floating WhatsApp button using the WhatsApp icon.
- Product image cards changed to `object-contain` so slippers/products show fully instead of cropping.
- Supabase schema updated for older databases and policies simplified for authenticated admin users.

## Required deployment steps

1. Replace your GitHub repository files with this package.
2. Commit and push to GitHub.
3. In Supabase SQL Editor, run `supabase/schema.sql` once.
4. Then run `supabase/seed-products.sql` if you want the default product data/images reset.
5. In Vercel, confirm env vars exist:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_EMAIL` optional, only pre-fills login email.
6. In Vercel, click **Redeploy** and select **Clear build cache / Redeploy without cache**.
7. Open `/admin`. You should now see the tab bar: Settings / Content / Products / Stats / Enquiries.

If `/admin` still shows the old left settings + product form layout, Vercel is deploying an older GitHub commit or different project/repository.
