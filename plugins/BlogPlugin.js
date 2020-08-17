let UsersPlugin = require("./UsersPlugin.js");
let fs = require("fs");
let monk = require("monk");
let db = UsersPlugin.db;
let posts = db.get("posts");
let Boom = require("@hapi/boom");

// https://webpack.js.org/api/node/
// let webpack = require("webpack");
// let webpackCompiler = webpack(require("./webpack.config.js"));
let webpackCompiler = require("webpack")(require("../webpack.config.js"));
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind#Syntax
let runWebpackCompiler = require("util").promisify(webpackCompiler.run).bind(webpackCompiler);

module.exports.db = db;
module.exports.plugin = {
  name: "BlogPlugin",
  async register(server, options) {
    await server.register([UsersPlugin]);

    server.route({
        method: "GET",
        path: "/posts",
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
      path: "/create-post",
      async handler(request, h) {
        let post = await posts.insert({ Title: request.payload.Title, date: new Date(), author: request.auth.credentials.username });

        await fs.promises.writeFile(`posts/${post._id}.md`, request.payload.content);
        await runWebpackCompiler();
        return h.redirect('/');
      },
      options: {
        auth: {
          mode: "required"
        }
      }
    });

    // either I or the author of the post can edit or delete it
    let checkAuthority = {
        async method(request, h) {
        // https://hapi.dev/tutorials/expresstohapi/?lang=en_US#-parameters
        let postID = request.params.postID;
        let post = await posts.findOne({ _id: postID});
        let credentials = request.auth.credentials;
        if (credentials.scope != "Author") {
          if (post.author != credentials.username) {
            return Boom.unauthorized("session does not have enough permission");
          }
        }
        return postID;
      },
      assign: "postID",
      failAction: "error"
    };

    server.route({
      method: "POST",
      path: "/posts/{postID}",
      options: {
        auth: {
          mode: "required"
        },
        pre: [checkAuthority]
      },
      async handler(request, h) {
        // https://hapi.dev/tutorials/expresstohapi/?lang=en_US#-parameters
        let postID = request.pre.postID;
        let post = await posts.findOne({ _id: postID});
        let credentials = request.auth.credentials;
        if (credentials.scope != "Author") {
          if (post.author != credentials.username) {
            return Boom.unauthorized("session does not have enough permission");
          }
        }
        posts.update(
          { _id: monk.id(postID) },
          // https://docs.mongodb.com/manual/reference/operator/update/currentDate/#up._S_currentDate
          { $set: { Title: request.payload.Title },
          $currentDate: { edited_on: true } }
        );

        await fs.promises.writeFile(`posts/${postID}.md`, request.payload.content);
        await runWebpackCompiler();
        return h.redirect('/');
      }
    });

    server.route({
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE
      method: "DELETE",
      path: "/posts/{postID}",
      options: {
        auth: {
          mode: "required"
        },
        pre: [checkAuthority],
        response: {
          emptyStatusCode: 204
        }
      },
      async handler(request, h) {
        let postID = request.pre.postID;
        posts.remove({ _id: monk.id(postID) });

        // https://nodejs.org/api/fs.html#fs_fspromises_unlink_path
        await fs.promises.unlink(`posts/${postID}.md`);
        await runWebpackCompiler();
        return h.response();
      }
    });

    await runWebpackCompiler();
  }
}
