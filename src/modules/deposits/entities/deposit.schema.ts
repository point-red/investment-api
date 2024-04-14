import { IDatabaseAdapter } from "@src/database/connection";

export const name = "deposits";

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
      properties: {
        date: {
          bsonType: "date",
          description: "timestamp when deposit placement was made",
        },
        bilyetNumber: {
          bsonType: "string",
          description: "bilyet Number for deposit",
        },
        number: {
          bsonType: "string",
          description: "deposit number",
        },
        bank: {
          bsonType: "object",
          properties: {
            _id: {
              bsonType: "objectId",
              description: "bank identifier from master bank",
            },
            name: {
              bsonType: "string",
              description: "bank name from master bank",
            },
          },
        },
        account: {
          bsonType: "object",
          properties: {
            number: {
              bsonType: "string",
              description: " account number from the bank account",
            },
            name: {
              bsonType: "string",
              description: " account name for the bank account",
            },
          },
        },
        owner: {
          bsonType: "object",
          properties: {
            _id: {
              bsonType: "objectId",
              description: "owner identifier from master owner",
            },
            name: {
              bsonType: "string",
              description: "owner name from master owner",
            },
          },
        },
        baseDate: {
          bsonType: "number",
          description: "deposit base date in days",
        },
        tenor: {
          bsonType: "number",
          description: "deposit tenor",
        },
        dueDate: {
          bsonType: "date",
          description: "deposit due date",
        },
        isRollOver: {
          bsonType: "boolean",
          description: "is the deposit interest roll over or not",
        },
        amount: {
          bsonType: "number",
          description: "deposit placement amount",
        },
        remaining: {
          bsonType: "number",
          description: "deposit placement remaining",
        },
        sourceBank: {
          bsonType: "object",
          properties: {
            _id: {
              bsonType: "objectId",
              description: "bank identifier from master bank",
            },
            name: {
              bsonType: "string",
              description: "bank name from master bank",
            },
          },
        },
        sourceBankAccount: {
          bsonType: "object",
          properties: {
            number: {
              bsonType: "string",
              description: " account number from the bank account",
            },
            name: {
              bsonType: "string",
              description: " account name for the bank account",
            },
          },
        },
        recipientBank: {
          bsonType: "object",
          properties: {
            _id: {
              bsonType: "objectId",
              description: "bank identifier from master bank",
            },
            name: {
              bsonType: "string",
              description: "bank name from master bank",
            },
          },
        },
        recipientBankAccount: {
          bsonType: "object",
          properties: {
            number: {
              bsonType: "string",
              description: " account number from the bank account",
            },
            name: {
              bsonType: "string",
              description: " account name for the bank account",
            },
          },
        },
        paymentMethod: {
          bsonType: "string",
          enum: ["advance", "in_arrear"],
          description: " deposit payment method",
        },
        interestRate: {
          bsonType: "number",
          description: " deposit interest rate",
        },
        baseInterest: {
          bsonType: "number",
          description: " deposit base interest",
        },
        grossInterest: {
          bsonType: "number",
          description: " deposit gross interest amount",
        },
        taxRate: {
          bsonType: "number",
          description: " deposit tax rate",
        },
        taxAmount: {
          bsonType: "number",
          description: "deposit tax amount",
        },
        netInterest: {
          bsonType: "number",
          description: "deposit net interest",
        },
        returns: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              _id: {
                bsonType: "objectId",
                description: "The _id for the interest",
              },
              baseDays: {
                bsonType: "number",
                description: "deposit interest base day",
              },
              dueDate: {
                bsonType: "date",
                description: "deposit interest due date",
              },
              gross: {
                bsonType: "number",
                description: "deposit gross interest amount",
              },
              taxAmount: {
                bsonType: "number",
                description: "deposit interest tax amount",
              },
              net: {
                bsonType: "number",
                description: "deposit interest net interest amount",
              },
              remaining: {
                bsonType: "number",
                description: "deposit interest remaining",
              },
            },
          },
        },
        isCashback: {
          bsonType: "boolean",
          description: "deposit cashback availability",
        },
        cashbacks: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              _id: {
                bsonType: "objectId",
                description: "The _id for the cashback",
              },
              rate: {
                bsonType: "number",
                description: "deposit cashback rate",
              },
              amount: {
                bsonType: "number",
                description: "deposit cashback amount",
              },
              remaining: {
                bsonType: "number",
                description: "deposit cashback remaining",
              },
              payments: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  properties: {
                    _id: {
                      bsonType: "objectId",
                      description: "The _id for the cashback payments",
                    },
                    rate: {
                      bsonType: "number",
                      description: "cashback payment rate",
                    },
                    date: {
                      bsonType: "date",
                      description: "cashback payment date",
                    },
                    amount: {
                      bsonType: "number",
                      description: "cashback payment amount",
                    },
                    note: {
                      bsonType: "string",
                      description: "cashback payment note",
                    },
                    createdBy: {
                      bsonType: "object",
                      properties: {
                        _id: {
                          bsonType: "objectId",
                          description: "The user_id for the users",
                        },
                        username: {
                          bsonType: "string",
                          description: "The username for the user",
                        },
                        name: {
                          bsonType: "string",
                          description: "The name for the user",
                        },
                      },
                    },
                    createdAt: {
                      bsonType: "date",
                      description: "date when the deposit was created",
                    },
                  },
                },
              },
            },
          },
        },
        note: {
          bsonType: "string",
          description: "deposit note",
        },
        formStatus: {
          bsonType: "string",
          enum: ["pending", "on_process", "done", "deleted"],
          description: "The form status for the invoice",
        },
        createdBy: {
          bsonType: "object",
          properties: {
            _id: {
              bsonType: "objectId",
              description: "The user_id for the users",
            },
            username: {
              bsonType: "string",
              description: "The username for the user",
            },
            name: {
              bsonType: "string",
              description: "The name for the user",
            },
          },
        },
        createdAt: {
          bsonType: "date",
          description: "date when the deposit was created",
        },
        updatedBy: {
          bsonType: "object",
          properties: {
            _id: {
              bsonType: "objectId",
              description: "The user_id for the users",
            },
            username: {
              bsonType: "string",
              description: "The username for the user",
            },
            name: {
              bsonType: "string",
              description: "The name for the user",
            },
          },
        },
        updatedAt: {
          bsonType: "date",
          description: "date when the deposit was updated",
        },
        deletedBy: {
          bsonType: "object",
          properties: {
            _id: {
              bsonType: "objectId",
              description: "The user_id for the users",
            },
            username: {
              bsonType: "string",
              description: "The username for the user",
            },
            name: {
              bsonType: "string",
              description: "The name for the user",
            },
          },
        },
        deletedAt: {
          bsonType: "date",
          description: "date when the deposit was deleted",
        },
        deletedReason: {
          bsonType: "string",
          description: "delete reason",
        },
        renewalDeposit_id: {
          bsonType: "objectId",
          description: "identifier from parent deposit",
        },
        interestPayments: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              _id: {
                bsonType: "objectId",
                description: "The _id for the interest payments",
              },
              baseDays: {
                bsonType: "number",
                description: "interest payment base days",
              },
              date: {
                bsonType: "date",
                description: "interest payment date",
              },
              amount: {
                bsonType: "number",
                description: "interest payment amount",
              },
              recipientBank_id: {
                bsonType: "objectId",
                description: "bank identifier from master bank",
              },
              recipientAccount: {
                bsonType: "object",
                properties: {
                  number: {
                    bsonType: "string",
                    description: " account number from the bank account",
                  },
                  name: {
                    bsonType: "string",
                    description: " account name for the bank account",
                  },
                },
              },
              note: {
                bsonType: "string",
                description: "interest payment note",
              },
              createdBy_id: {
                bsonType: "objectId",
                description: "The user_id for the users",
              },
              createdAt: {
                bsonType: "date",
                description: "date when the deposit was created",
              },
            },
          },
        },
        withdrawalPayments: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              _id: {
                bsonType: "objectId",
                description: "The _id for the interest payments",
              },
              date: {
                bsonType: "date",
                description: "interest payment date",
              },
              amount: {
                bsonType: "number",
                description: "interest payment amount",
              },
              recipientBank_id: {
                bsonType: "objectId",
                description: "bank identifier from master bank",
              },
              recipientAccount: {
                bsonType: "object",
                properties: {
                  number: {
                    bsonType: "string",
                    description: " account number from the bank account",
                  },
                  name: {
                    bsonType: "string",
                    description: " account name for the bank account",
                  },
                },
              },
              note: {
                bsonType: "string",
                description: "interest payment note",
              },
              createdBy_id: {
                bsonType: "objectId",
                description: "The user_id for the users",
              },
              createdAt: {
                bsonType: "date",
                description: "date when the deposit was created",
              },
            },
          },
        },
      },
    });
    await db.createIndex(
      name,
      { number: -1 },
      {
        unique: true,
        collation: {
          locale: "en",
          strength: 2,
        },
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
