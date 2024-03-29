require("dotenv").config();
let Hapi = require("@hapi/hapi");
let Inert = require("@hapi/inert");

let monk = require("monk");
let BlogPlugin = require("./plugins/BlogPlugin.js");

let server = Hapi.server({
  port: process.env.port || 80,
  state: {
    isSecure: false // does not require HTTPS or localhost-only connection
  }
});

let init = async () => {

  await server.register([Inert, BlogPlugin, require("./plugins/RateLimiterPlugin.js"),
  {
    plugin: require("hapi-pulse"),
    options: {
      async postServerStop() {
        await BlogPlugin.db.close();
      }
    }
  }]);

  // https://hapi.dev/tutorials/servingfiles/?lang=en_US#-static-file-server
  server.route({
    method: "GET",
    path: "/{param*}",
    // https://hapi.dev/api/?v=19.2.0#-routeoptionshandler
    handler: {
      directory: { // directory handler from Inert
        path: "dist",
        redirectToSlash: true
      }
    }
  });

  server.route({
    method: "GET",
    path: "/images/{image}",
    handler: {
      directory: {
        path: "images"
      }
    }
  });

  server.route({
    method: "GET",
    path: "/highlight/{param*}",
    handler: {
      directory: {
        path: "highlight"
      }
    }
  });

  // https://router.vuejs.org/guide/essentials/history-mode.html
  // duplicated routes in Vue app
  for (let path of ["/guest", "/register", "/login", "/terms", "/privacy-policy"]) {
    server.route({
      method: "GET",
      path, // path: path
      handler(request, h) {
        return h.file("dist/index.html");
      }
    });
  }

  for (let path of ["/create", "/upload", "/edit/{id?}"]) {
    server.route({
      method: "GET",
      path,
      handler(request, h) {
        return h.file("dist/index.html");
      },
      options: {
        auth: {
          mode: "required"
        }
      }
    });
  }

  server.route({
    method: "GET",
    path: "/key-menu",
    handler(request, h) {
      return h.file("dist/index.html");
    },
    options: {
      auth: {
        access: { scope: "Author" },
        mode: "required"
      }
    }
  });

  server.route({
    method: "GET",
    path: "/i",
    handler(request, h) {
      return monk.id();
    },
    options: {
      auth: {
        access: { scope: "Author" },
        mode: "required"
      }
    }
  });

  await server.start();
  return `Server running on ${server.info.uri}\n${Date()}`;
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init().then(console.log);
