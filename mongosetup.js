require("dotenv").config();
let db = require("monk")(process.env.connectionString);

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
try {
  db.create("posts", {
    validator: {
      $jsonSchema: {
        // bsonType: "object", // could this even not be an object?
        required: [ "Title", "date", "author" ],
        properties: {
          Title: { bsonType: "string" },
          date: { bsonType: "date" },
          author: { bsonType: "string" }
        }
      }
    }
  });
  db.create("users", {
    validator: {
      $jsonSchema: {
        required: [ "username", "hashed_password" ],
        properties: {
          username: {
            bsonType: "string",
            minimum: 2
          },
          hashed_password: {
            bsonType: "string"
          }
        }
      }
    }
  });
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors
  db.create("registration keys", {
    validator: {
      $jsonSchema: {
        required: [ "content", "uses" ],
        properties: {
          content: {
            bsonType: "string"
          },
          uses: {
            bsonType: "int",
            minimum: 1
          }
        }
      }
    }
  });
} catch (error) {
  console.error(error);
} finally {
  db.close();
}
