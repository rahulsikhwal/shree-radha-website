import "./globals.css";

export const metadata = {
  title: "Shree Radha Enterprises | Footwear Manufacturer",
  description:
    "Premium orthopedic, comfort and lifestyle footwear manufacturer.",
  keywords: [
    "footwear manufacturer",
    "orthopedic footwear",
    "comfort footwear",
    "SRE Footwears",
    "Shree Radha Enterprises",
  ],
  alternates: {
    canonical: "https://www.srefootwears.com",
  },
  openGraph: {
    title: "Shree Radha Enterprises | Footwear Manufacturer",
    description:
      "Premium orthopedic, comfort and lifestyle footwear manufacturer.",
    url: "https://www.srefootwears.com",
    siteName: "Shree Radha Enterprises",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
