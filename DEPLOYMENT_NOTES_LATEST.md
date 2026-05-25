# Latest Deployment Notes

This revision includes:

- More aesthetic full website UI with polished hero, cards, product pages and contact section.
- Product images use `object-contain` in large image frames, so full footwear images display clearly without cropping.
- Contact form client-side email validation.
- Contact form phone field accepts digits only and is limited to exactly 10 digits.
- API-side validation for name, email, phone, enquiry type and message before inserting into Supabase.
- Vercel config and Node 20 engine added for stable deployment.
- Production build checked successfully with `npm run build`.

## Deploy

1. Upload all files from this folder to your GitHub repo.
2. In Vercel, keep the same existing project.
3. Reconnect the latest GitHub repo if Vercel still points to the deleted repository.
4. Keep your existing Supabase environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Redeploy.
