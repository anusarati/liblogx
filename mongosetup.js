require("dotenv").config();
let db = require("monk")(process.env.connectionString);

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
try {
  db.create("posts", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [ "Title", "date", "author" ],
        properties: {
          Title: { bsonType: "string" },
          date: { bsonType: "date" },
          author: { bsonType: "string" }
        }
      }
    }
  });
} catch (error) {
  console.error(error);
}
