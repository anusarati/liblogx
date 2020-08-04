require("dotenv").config();
let Hapi = require("@hapi/hapi");
let Inert = require("@hapi/inert");
let fs = require("fs");

let db = require("monk")(process.env.connectionString);
let posts = db.get("posts");

let webpackCompiler = require("webpack")(require("./webpack.config.js"));
let webpackCallback = function (err, stats) {
  // https://webpack.js.org/api/node/#error-handling
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  // https://webpack.js.org/api/node/#statstostringoptions
  console.log(stats.toString({
    chunks: false,
    colors: true
  }));
}

let server = Hapi.server({
  port: 3000,
  host: "localhost"
});

server.route({
    method: "GET",
    path: "/blog-posts",
    handler: function (request, h) {
      return posts.find();
    }
});

let init = async () => {

  /*
  let getDate = {
    name: "getDate",
    register: async function (server, options) {
      let currentDate = () => {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
        // return (new Date()).toDateString();
      }

      server.decorate("toolkit", "getDate", currentDate);
    }
  }*/

  //await server.register([getDate, Inert]);
  await server.register(Inert);

  server.route({
    method: '*',
    path: "/{param*}",
    handler: {
      directory: {
        path: "dist",
        redirectToSlash: true
      }
    }
  });

  server.route({
    method: "POST",
    path: "/create-post",
    handler: function (request, h) {
      posts.insert({ Title: request.payload.Title, date: new Date(), author: "Xingzhe" })
      .then((post) => {
        console.log(post);
        // https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
        fs.writeFile(`posts/${post._id}.md`, request.payload.content, (err) => {
            if (err) throw err;
        });
      })
      .then(() => {
        webpackCompiler.run(webpackCallback);
      })
      .catch(console.error);
      return h.redirect('/');
    }
  });

  await server.start();
  return `Server running on ${server.info.uri}`;
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

// https://webpack.js.org/api/node/
// .run() takes a callback
webpackCompiler.run(webpackCallback);
init().then(console.log);
