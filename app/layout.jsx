import "./globals.css";

export const metadata = {
  title: "Shree Radha Enterprises | Footwear Manufacturer",
  description: "Premium orthopedic, comfort and lifestyle footwear manufacturer.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
