require("dotenv").config();
let Hapi = require("@hapi/hapi");
let Inert = require("@hapi/inert");
let fs = require("fs");

let monk = require("monk");
let db = monk(process.env.connectionString);
let posts = db.get("posts");

// please don't give an error when running the compiler without a callback
let webpackCompiler = require("webpack")(require("./webpack.config.js"));

let server = Hapi.server({
  port: 3000,
  host: "localhost"
});

server.route({
    method: "GET",
    path: "/blog-posts",
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions
    handler(request, h) {
      // since this works, it seems that hapi resolves promises
      return posts.find();
    }
});

server.route({
  method: "GET",
  path: "/posts/{postID}",
  handler(request, h) {
    // https://nodejs.org/api/fs.html#fs_fs_promises_api
    //let mdContent = await fs.promises.readFile(`posts/${request.params.postID}.md`);
    return fs.promises.readFile(`posts/${request.params.postID}.md`);
  }
});

server.route({
  method: "POST",
  path: "/posts/{postID}",
  async handler(request, h) {
    // https://hapi.dev/tutorials/expresstohapi/?lang=en_US#-parameters
    let postID = request.params.postID;
    posts.update(
      { _id: monk.id(postID) },
      // https://docs.mongodb.com/manual/reference/operator/update/currentDate/#up._S_currentDate
      { $set: { Title: request.payload.Title },
      $currentDate: { edited_on: true } }
    );

    await fs.promises.writeFile(`posts/${postID}.md`, request.payload.content);
    webpackCompiler.run();
    return h.redirect('/');
  }
});

server.route({
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE
  method: "DELETE",
  path: "/posts/{postID}",
  async handler(request, h) {
    let postID = request.params.postID;
    posts.remove( { _id: monk.id(postID) } );

    // https://nodejs.org/api/fs.html#fs_fspromises_unlink_path
    await fs.promises.unlink(`posts/${postID}.md`);
    webpackCompiler.run();
    return h.response();
  },
  options: {
    response: {
      emptyStatusCode: 204
    }
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
    method: "POST",
    path: "/create-post",
    async handler(request, h) {
      let post = await posts.insert({ Title: request.payload.Title, date: new Date(), author: "Xingzhe" });

      await fs.promises.writeFile(`posts/${post._id}.md`, request.payload.content);
      webpackCompiler.run();
      return h.redirect('/');
    }
  });

  await server.start();
  return `Server running on ${server.info.uri}\n${Date()}`;
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

// https://webpack.js.org/api/node/
webpackCompiler.run();
init().then(console.log);
