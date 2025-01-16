import { ApiError } from "@point-hub/express-error-handler";
import Validator from "validatorjs";
import Validatorjs from "validatorjs";

Validator.register(
  "unique",
  function (value, requirement, attribute) {
    const values = Object.assign([], value);
    const uniqueData = Array.from(new Set(values.map((row) => row[requirement])));
    const isUnique = values.length === uniqueData.length;
    if (isUnique) {
      return true;
    }
    return false;
  },
  "Please provide a unique :attribute number."
);

export const validate = (body: any) => {
  const validation = new Validatorjs(body, {
    date: "required",
    bilyetNumber: "required",
    bank: {
      _id: "string|required",
      name: "string|required",
    },
    account: {
      number: "required",
      name: "string|required",
    },
    owner: {
      _id: "string|required",
      name: "string|required",
    },
    baseDate: "required",
    tenor: "required",
    isRollOver: "required",
    amount: "required",
    sourceBank: {
      _id: "string|required",
      name: "string|required",
    },
    sourceBankAccount: {
      number: "required",
      name: "string|required",
    },
    recipientBank: {
      _id: "string|required",
      name: "string|required",
    },
    recipientBankAccount: {
      number: "required",
      name: "string|required",
    },
    paymentMethod: "required",
    interestRate: "required",
    taxRate: "required",
    isCashback: "required",
  });

  if (validation.fails()) {
    throw new ApiError(422, validation.errors.errors);
  }
};
