import { ApiError } from "@point-hub/express-error-handler";
import Validatorjs from "validatorjs";

export const validate = (body: any) => {
  const validation = new Validatorjs(body, {
    payments: "required|array",
    "payments.*.bank": "required",
    "payments.*.account": "required",
    "payments.*.remaining": "required",
    "payments.*.date": "required",
    "payments.*.amount": "required",
  });

  if (validation.fails()) {
    throw new ApiError(422, validation.errors.errors);
  }
};
