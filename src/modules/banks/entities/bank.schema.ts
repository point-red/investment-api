import { IDatabaseAdapter } from "@src/database/connection";

export const name = "banks";

export const restrictedFields = [];

const isExists = async (db: IDatabaseAdapter) => {
  const collections = (await db.listCollections()) as [];
  return collections.some(function (el: any) {
    return el.name === name;
  });
};

export async function createCollection(db: IDatabaseAdapter) {
  try {
    if (!(await isExists(db))) {
      await db.createCollection(name);
    }

    await db.updateSchema(name, {
      bsonType: "object",
      required: ["name", "branch", "code", "notes", "accounts"],
      properties: {
        createdAt: {
          bsonType: "date",
          description: "must be a date and is required",
        },
        updatedAt: {
          bsonType: "date",
          description: "must be a date and is required",
        },
        name: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        branch: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        code: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        notes: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        accounts: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["number", "name", "notes"],
            properties: {
              name: {
                bsonType: "string",
                description: "must be a string and is required",
              },
              number: {
                bsonType: "string",
                description: "must be a string and is required",
              },
              notes: {
                bsonType: "string",
                description: "must be a string and is required",
              }
            },
          },
        },
      },
    });
    await db.createIndex(
      name,
      { name: -1, code: -1, "accounts.number": -1 },
      {
        unique: true,
      }
    );
  } catch (error) {
    throw error;
  }
}

export async function dropCollection(db: IDatabaseAdapter) {
  try {
    if (await isExists(db)) {
      await db.dropCollection(name);
    }
  } catch (error) {
    throw error;
  }
}
