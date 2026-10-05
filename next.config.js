const NextFederationPlugin = require("@module-federation/nextjs-mf");

// URL del backend Spring (por defecto el puerto estandar de Spring Boot)
const API_URL = process.env.API_URL || "http://localhost:8080";
// URL donde corre el microfront
const MICROFRONT_URL = process.env.MICROFRONT_URL || "http://localhost:3001";

module.exports = {
  webpack(config, { isServer }) {
    const location = isServer ? "ssr" : "chunks";
    config.plugins.push(
      new NextFederationPlugin({
        name: "container",
        filename: "static/chunks/remoteEntry.js",
        remotes: {
          microfront: `microfront@${MICROFRONT_URL}/_next/static/${location}/remoteEntry.js`,
        },
        shared: {},
      })
    );
    return config;
  },

  // El navegador llama a /api/* y Next lo reenvia al backend.
  // El microfront, cuando corre dentro del contenedor, usa este mismo proxy.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/:path*` }];
  },
};
