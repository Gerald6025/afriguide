import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AfriGuide",
  description: "Whether you're looking for adventure or culture, Afriguide brings the continent to your fingertips.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var cookies = document.cookie.split(";");
                  for (var i = 0; i < cookies.length; i++) {
                    var c = cookies[i].trim();
                    if (c.indexOf("sb-") === 0 && (c.indexOf("data%3Aimage") !== -1 || c.indexOf("data:image") !== -1 || c.length > 3500)) {
                      var eqPos = c.indexOf("=");
                      var name = eqPos > -1 ? c.substr(0, eqPos) : c;
                      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
                    }
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full font-sans bg-white text-black selection:bg-[#1B3D2F] selection:text-white flex justify-center">
        {children}
      </body>
    </html>
  );
}
