import { body } from "express-validator";
import CommonValidations from "./commonValidations.js";

class UserValidations {
  public static signInValidation = [
    body("data.emailId")
      .isEmail()
      .withMessage("Provide Valid Email")
      .custom(async (value, { req }) => {
        const existingData: any =
          await CommonValidations.getDataByFieldValidations("UserMaster", "emailId", value);

        if (!existingData) {
          return Promise.reject("User does not exist with this email. Please Sign Up");
        }
      }),
  ];
  public static signUpValidation = [
    body("data.emailId")
      .isEmail()
      .withMessage("Provide Valid Email")
      .custom(async (value, { req }) => {
        const id = req?.data?.id;

        const existingData: any = await CommonValidations.getDataByFieldValidations("UserMaster", "emailId", value);

        if (existingData) {
          return Promise.reject("Email Already Exists");
        }
      }),
    body("data.mobileNumber")
      .notEmpty()
      .withMessage("Mobile Number is Required")
      .custom(async (value, { req }) => {
        const id = req?.data?.id;

        const existingData: any = await CommonValidations.getDataByFieldValidations("UserMaster", "mobileNumber", value);

        if (existingData) {
          return Promise.reject("Mobile Number Already Exists");
        }
      }),
    body("data.companyName")
      .notEmpty()
      .withMessage("Company Name is Required")
      
  ];
}
export default UserValidations;
