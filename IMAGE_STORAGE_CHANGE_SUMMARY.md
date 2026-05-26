# Product Image Storage Change Summary

## Requirement checked
Product images must not be stored as binary files in the database. The database should store only image URLs/paths. When a product image is replaced, the old image must be automatically deleted from Supabase Storage unless another product still uses it.

## Result
The schema already stores product images in `public.products.image_url` as `text`, not binary data.

The admin dashboard has been updated so that, after a product is saved with a different image URL/path, the previous Supabase Storage object is removed automatically if no other product references the same image.

## Files changed

### `app/admin/AdminDashboard.jsx`
- Added `originalProductImageUrl` state to remember the image that was loaded when editing started.
- Added `getProductImageStoragePath()` to safely extract the Supabase Storage object path from public URLs, bucket-relative paths, or stored file paths.
- Added `isProductImageUsedElsewhere()` to check all products before deleting an old image.
- Added `deleteProductImageFromStorageIfUnused()` to delete unused old images from the `product-images` bucket.
- Added `beginProductEdit()` and `closeProductEditor()` so the original image URL is tracked and cleared correctly.
- Updated product save logic to delete the previous storage image only after the product update succeeds and only when no other product uses it.
- Updated product delete logic to also remove that product's storage image when it is not used by any other product.
- Updated Add/Edit/Cancel buttons to use the new helper functions.

## Validation performed
- Confirmed `supabase/schema.sql` uses `image_url text` for products.
- Searched the project for binary image database patterns such as `bytea`, `base64`, `data:image`, `image_data`, and `binary`; no binary image database storage was found.
- Parsed `app/admin/AdminDashboard.jsx` with the TypeScript compiler parser in JSX mode; syntax passed.

## Note
`npm install` / full Next.js build could not be completed in the sandbox because package download access timed out. The code syntax check passed, and the change is limited to the admin product image flow.
