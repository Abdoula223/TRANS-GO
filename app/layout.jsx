import "./globals.css";

export const metadata = { title: "TransGo – Voyage Express", description: "Votre billet de bus interurbain en 3 clics" };
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
