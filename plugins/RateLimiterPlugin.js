// https://github.com/animir/node-rate-limiter-flexible/wiki/Hapi-plugin
let Boom = require("@hapi/boom");
let { RateLimiterMemory } = require("rate-limiter-flexible");

let rateLimiter = new RateLimiterMemory({
  points: 17,
  duration: 1
});

module.exports = {
  name: "RateLimiterPlugin",
  register(server) {
    server.ext("onPreAuth", async (request, h) => {
      try {
        await rateLimiter.consume(request.info.remoteAddress);
        return h.continue;
      } catch (rej) {
        let error = Boom.tooManyRequests("Rate limit exceeded");
        error.output.headers["Retry-After"] = Math.round(rej.msBeforeNext / 1000) || 1;
        return error;
      }
    });
  }
};
