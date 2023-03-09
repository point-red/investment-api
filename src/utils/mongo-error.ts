import { ApiError, BaseError, IError, IHttpStatus, find } from "@point-hub/express-error-handler";
import { MongoServerError } from "mongodb";

export default class MongoError extends BaseError {
  constructor(err: MongoServerError) {
    const error: IError = find(400) as IHttpStatus;
    if (err.code === 121) {
      error.errors = {} as any;
      const errorMessage = err.errInfo?.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied;
      errorMessage.forEach((element: any) => {
        const obj: any = {};
        obj[element.propertyName] = element.details;
        error.errors = obj;
      });
    } else if (err.code === 11000) {
      error.errors = {} as any;

      const fields = Object.keys(err.keyPattern);
       
      for (const field of fields) {
        const obj: any = {};
        obj[field] = `The ${field} is exists.`;
        error.errors = obj;
      }

      throw new ApiError(422, error.errors);
    }
    super(error);
  }
  get isOperational() {
    return true;
  }
}
