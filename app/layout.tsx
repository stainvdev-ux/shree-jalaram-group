import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter-tight";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "lenis/dist/lenis.css";
import "./globals.css";
import Shell from "@/components/Shell";

export const metadata: Metadata = {
  metadataBase: new URL("https://shreejalaramgroup.com"),
  title: { default: "Shree Jalaram Group — Many ventures. One legacy.", template: "%s — Shree Jalaram Group" },
  description:
    "Shree Jalaram Group is a Mumbai-headquartered diversified business conglomerate spanning lottery, gaming, hospitality, beverages, design, construction, manufacturing and technology. Since 1977.",
  openGraph: {
    type: "website",
    siteName: "Shree Jalaram Group",
    images: ["https://shreejalaramgroup.com/admin/uploads/1770293937company.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#00030c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
