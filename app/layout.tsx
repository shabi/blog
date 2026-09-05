import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "./analytics";
import { Header } from "./header";
import { Footer } from "./footer";


const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});


const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Consolas",
    "Liberation Mono",
    "Menlo",
    "monospace",
  ],
});


export const metadata = {
  title: "GANG's BLOG",

  description:
    "A Blog by a Collective of Revelers",

  metadataBase: new URL("https://blog.ohhoba.com"),


  verification: {
    other: {
      "msvalidate.01": "C4EC9949BE7CEE814CEC78AB96DC7527",
    },
  },


  openGraph: {
    title: "GANG's BLOG",

    description:
      "A Blog by a Collective of Revelers.",

    url: "https://blog.ohhoba.com",

    siteName: "GANG's BLOG",

    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "GANG's BLOG",
      },
    ],

    locale: "en_US",

    type: "website",
  },
};


export const viewport = {
  themeColor: "transparent",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${geist.className} antialiased`}
      suppressHydrationWarning={true}
    >

      <body className="dark:text-gray-100 max-w-3xl m-auto">


        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({

              "@context": "https://schema.org",

              "@graph": [

                {
                  "@type": "WebSite",

                  "name": "GANG's BLOG",

                  "url": "https://blog.ohhoba.com",

                  "description":
                    "A Blog by a Collective of Revelers",
                },


                {
                  "@type": "Person",

                  "name": "GANG",

                  "url": "https://blog.ohhoba.com",

                  "description":
                    "A Blog by a Collective of Revelers",
                },

              ],

            }),
          }}
        />


        <main className="p-6 pt-3 md:pt-6 min-h-screen">

          <Header />

          {children}

        </main>


        <Footer />


        <Analytics />

      </body>

    </html>

  );
}
