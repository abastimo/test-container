import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Agente de navegador de New Relic (public/newrelic.js), lo mas arriba posible en el head */}
        <script src="/newrelic.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
