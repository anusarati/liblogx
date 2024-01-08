require("dotenv").config();
const db = require("monk")(process.env.connectionString);
const bcrypt = require('bcrypt');

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
try {
  db.create("posts", {
    validator: {
      $jsonSchema: {
        // bsonType: "object", // could this even not be an object?
        required: ["Title", "date", "author"],
        properties: {
          Title: { bsonType: "string" },
          date: { bsonType: "date" },
          author: { bsonType: "string" }
        }
      }
    }
  });
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors
  db.create("registration keys", {
    validator: {
      $jsonSchema: {
        required: ["content", "uses"],
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

  let users = db.create("users", {
    validator: {
      $jsonSchema: {
        required: ["username", "hashed_password"],
        properties: {
          username: {
            bsonType: "string",
            minimum: 2
          },
          hashed_password: {
            bsonType: "string"
          },
          scope: {
            bsonType: "string"
          }
        }
      }
    }
  });

  // add a privileged user specified in .env and close the db
  let privileged = JSON.parse(process.env.admin);
  privileged.hashed_password = bcrypt.hashSync(privileged.password, 10);
  delete privileged.password;
  privileged.scope = "Author";

  users.insert(privileged, () => db.close());
} catch (error) {
  console.error(error);
  db.close();
}