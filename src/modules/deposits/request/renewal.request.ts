import { ApiError } from "@point-hub/express-error-handler";
import Validator from "validatorjs";
import Validatorjs from "validatorjs";

Validator.register(
  "unique",
  function (value, requirement, attribute) {
    const values = Object.assign([], value);
    const uniqueData = Array.from(
      new Set(values.map((row) => row[requirement]))
    );
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
    baseDate: "required",
    tenor: "required",
    isRollOver: "required",
    amount: "required",
    paymentMethod: "required",
    interestRate: "required",
    taxRate: "required",
    isCashback: "required",
  });

  if (validation.fails()) {
    throw new ApiError(422, validation.errors.errors);
  }
};
