# Shree Radha Enterprises Dynamic Website

This project is a Next.js website connected to Supabase and ready for Vercel.

## What is dynamic now

- Homepage company text, phone, email, address and social links
- Product listing, product detail pages, images, category, MRP and features
- Hide/show products from the admin panel
- Homepage animated stats
- Contact enquiries saved in Supabase
- Admin login through Supabase Authentication

## Local setup

1. Install Node.js LTS from https://nodejs.org if it is not installed.
2. Open this project folder in a terminal.
3. Run `npm install`.
4. Copy `.env.example` to `.env.local`.
5. Fill these values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_EMAIL=rahul.sikhwal5@gmail.com
```

6. Run `npm run dev`.
7. Open `http://localhost:3000`.

## Supabase setup

1. Go to https://supabase.com and open your project.
2. Open SQL Editor.
3. Paste and run `supabase/schema.sql`.
4. Paste and run `supabase/seed-products.sql`.
5. Go to Authentication -> Users -> Add user.
6. Create the admin user with this email:

```text
rahul.sikhwal5@gmail.com
```

7. Set a strong password and remember it for `/admin`.

Important: if you want another admin email, change it in two places:

- `NEXT_PUBLIC_ADMIN_EMAIL` in Vercel
- the email inside `supabase/schema.sql` policies before running SQL

## Vercel deployment steps

1. Upload or push this project folder to GitHub.
2. In Vercel, import the GitHub repository.
3. Open Project Settings -> Environment Variables.
4. Add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_EMAIL=rahul.sikhwal5@gmail.com
```

5. Redeploy the project.
6. Open `https://your-domain.vercel.app/admin`.
7. Login with the Supabase admin email and password.

## Admin usage

Open `/admin` after deployment.

You can:

- Edit company settings
- Add, edit and delete products
- Change product image URLs
- Hide products without deleting them
- Edit homepage stats
- View submitted enquiries

## Product images

You can use either:

- Existing public image paths such as `/product-flynfit.jpg`
- A direct public image URL such as `https://example.com/product.jpg`

If using Google Drive, make sure the URL is a direct public image URL. Normal Google Drive sharing pages may not display as images.

## MRP behavior

If MRP is blank, the website hides MRP.

If MRP is filled, the website shows:

```text
MRP: Rs. amount
```

## Build check

Before final deployment, run:

```bash
npm install
npm run build
```

Then deploy to Vercel. Vercel will run the same production build.
