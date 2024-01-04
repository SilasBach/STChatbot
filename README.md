# STChatbot

royrao2333/template-vite-react-ts-tailwind used as frontend template

poetry used as package manager for backend

DB:
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password", "fullName", "role", "createdAt"],
      properties: {
        email: { bsonType: "string", description: "Must be a string and is required" },
        password: { bsonType: "string", description: "Must be a string and is required" },
        fullName: { bsonType: "string", description: "Must be a string and is required" },
        role: { bsonType: "string", description: "Must be a string and is required" },
        bureauAffiliation: { bsonType: "string", description: "Must be a string if the field exists" },
        createdAt: { bsonType: "date", description: "Must be a date and is required" },
        updatedAt: { bsonType: "date", description: "Must be a date if the field exists" },
        lastLogin: { bsonType: "date", description: "Must be a date if the field exists" },
        accountStatus: { bsonType: "string", description: "Must be a string if the field exists" }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
})
