let monk = require("monk");
let db = monk(process.env.connectionString);
let users = db.get("users");
let keys = db.get("registration keys");
let bcrypt = require("bcrypt");

let Joi = require("joi");

module.exports.db = db;
module.exports.plugin = {
  name: "UsersPlugin",
  async register(server, options) {
    await server.register(require("@hapi/cookie"));
    // https://hapi.dev/tutorials/auth
    server.auth.strategy("session", "cookie", {
      cookie: {
        password: process.env.secret_key
      },
      redirectTo: '/login',
      async validateFunc(request, session) {
        // https://automattic.github.io/monk/docs/collection/findOne.html
        let result = await users.findOne({ _id: session.id });
        if (result) {
          return { valid: true, credentials: result };
        } else {
          return { valid: false };
        }
      }
    });

    server.auth.default({ strategy: "session", mode: "optional" });

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Restrict_access_to_cookies
    server.state("vue-scope", {
      isHttpOnly: false
    });
    server.state("user", {
      isHttpOnly: false
    });
    server.state("auth_error", {
      isHttpOnly: false,
      ttl: 1000
    });

    server.route({
      method: "POST",
      path: "/register",
      async handler(request, h) {
        let { username, password, key } = request.payload;
        // https://auth0.com/blog/hapijs-authentication-secure-your-api-with-json-web-tokens/#Creating-Users
        let result = await users.findOne({ username });
        if (result) {
          h.state("auth_error", "username_taken");
          return h.redirect("/register");
        }
        result = await keys.findOne({ content: key });
        console.log(result);
        if (result) {
          if (!--result.uses) { // if no more uses after decrement
            keys.remove({ _id: result._id });
          } else {
            keys.update({ _id: result._id }, { $set: { uses: result.uses } });
          }
          let hashed_password = await bcrypt.hash(password, 10);
          let user = await users.insert({
            username, // username: username
            hashed_password
          });
          request.cookieAuth.set({ id: user._id });
          h.state("vue-scope", "Authenticated");
          h.state("user", username);
          return h.redirect('/');
        } else {
          h.state("auth_error", "invalid_registration_key");
          return h.redirect("/register");
        }
      },
      options: {
        validate: {
          payload: Joi.object({
            username: Joi.string().min(2),
            password: Joi.string().min(2),
            key: Joi.string().min(1)
          })
        }
      }
    });

    server.route({
      method: "POST",
      path: "/login",
      async handler(request, h) {
        let { username, password } = request.payload;
        let result = await users.findOne({ username });
        if (result) {
          let isValid = await bcrypt.compare(password, result.hashed_password);
          if (isValid) {
            request.cookieAuth.set({ id: result._id });
            h.state("vue-scope", result.scope || "Authenticated");
            h.state("user", username);
            return h.redirect('/');
          } else {
            h.state("auth_error", "password_mismatch");
            return h.redirect("/login");
          }
        } else {
          h.state("auth_error", "did_not_find_user_with_username");
          return h.redirect("/login");
        }
      },
      options: {
        validate: {
          payload: Joi.object({
            username: Joi.string().min(2),
            password: Joi.string().min(2)
          })
        }
      }
    });

    // https://hapi.dev/module/cookie/api?v=11.0.1
    server.route({
      method: "GET",
      path: "/logout",
      handler(request, h) {
        request.cookieAuth.clear();
        h.unstate("user");
        h.unstate("vue-scope");
        return h.redirect('/');
      },
      options: {
        auth: false
      }
    });

    server.route({
      method: "GET",
      path: "/reg-keys",
      handler(request, h) {
        // https://automattic.github.io/monk/docs/collection/find.html
        return keys.find();
      },
      options: {
        auth: {
          access: { scope: "Author" },
          mode: "required"
        }
      }
    });

    server.route({
      method: "POST",
      path: "/reg-keys",
      handler(request, h) {
        keys.insert({ content: request.payload.content, uses: Number(request.payload.uses) });
        return h.response();
      },
      options: {
        auth: {
          access: { scope: "Author" },
          mode: "required"
        }
      }
    });
  }
}
