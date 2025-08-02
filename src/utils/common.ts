import fs from "fs";
import path from "path";
import express from "express";
import sendMail from "./sendEmail";
import EncryptUtils from "./encrypt";
import multer, { StorageEngine } from "multer";
import { promises as deletePromises } from 'fs';
import { eReturnCodes } from "../enums/commonEnums";
import ResponseModel from "../models/common/responseModel";


class CommonUtils {

  /**
   * Returns a ResponseModel based on the return code passed in.
   * @param {eReturnCodes} returnCode The return code to be used to generate the response.
   * @returns {ResponseModel} A ResponseModel with the appropriate values set.
   */
  static getDataResponse(returnCode: eReturnCodes) {
    const responseModel = new ResponseModel(
      returnCode,
      new Date(),
      "No data found"
    );

    /*
    * Switch on the return code to set the description of the response.
    * If no match found, description remains as "No data found".
    */
    switch (returnCode) {
      case eReturnCodes.R_SUCCESS:
        responseModel.description = "Success";
        break;
      case eReturnCodes.R_NOT_FOUND:
        responseModel.description = "Data not found";
        break;
      case eReturnCodes.R_AUTHENTICATION_FAILED:
        responseModel.description = "Authentication failed";
        break;
      case eReturnCodes.R_DB_ERROR:
        responseModel.description = "Database error";
        break;
      default:
        break;
    }

    return responseModel;
  }

  /**
   * Initializes and sends an email based on the provided email options.
   * @param {TEmailOptions} emailOptions - Options for sending the email, including receiver email, password, and email purpose.
//    */
  static initializeEmail(emailOptions: any) {
    switch (emailOptions.emailPurpose) {
      case "SignIn":
        // Read the HTML template file for the "SignIn" email purpose
        fs.readFile("assets/Welcome.html", "utf8", (err: any, htmlContent: any) => {
          if (err) {
            console.error("Error reading HTML file:", err);
            // Handle error cases here
            return;
          }
          // Replace placeholders in the HTML content with actual email and decrypted password
          //console.log("htmlContent", htmlContent);
          htmlContent = htmlContent
            .replace("@EMAIL@", emailOptions.receiverEmail)
            .replace("@PASSWORD@", EncryptUtils.decrypt(emailOptions.password || ""));

          let mailOptions = {
            // Configure mail options for sending the email
            from: process.env.MAIL_FROM_ADDRESS,
            to: emailOptions.receiverEmail,
            subject: "Welcome",
            html: htmlContent,
          };
          sendMail(mailOptions, "");
        });

        break;
      case "ResetPassword": fs.readFile("assets/ForgetPassword.html", "utf8", (err: any, htmlContent: any) => {
        if (err) {
          console.error("Error reading HTML file:", err);
          // Handle error cases here
          return;
        }
        htmlContent = htmlContent
          .replace("@ResetLink@", emailOptions.resetLink)
        let mailOption = {
          from: process.env.MAIL_FROM_ADDRESS,
          to: emailOptions.receiverEmail,
          subject: "Forget Password",
          html: htmlContent,
        };
        sendMail(mailOption, "");
      })

        break;

      case "ScheduleDemo":
        fs.readFile("assets/ScheduleDemo.html", "utf8", (err: any, htmlContent: any) => {
          if (err) {
            console.error("Error reading HTML file:", err);
            // Handle error cases here
            return;
          }
          htmlContent = htmlContent
            .replaceAll("@NAME@", emailOptions.name)
            .replaceAll("@EMAIL@", emailOptions.email)
            .replaceAll("@PHONE@", emailOptions.phone)
            .replaceAll("@DATE@", emailOptions.date)
            .replaceAll("@TIME@", emailOptions.time)
            .replaceAll("@COMPANY@", emailOptions.company)

          let mailOption = {
            from: emailOptions.email,
            to: process.env.ICMA_COMPANY_EMAIL || 'mohammad531@gmail.com',
            subject: "User Scheduled a Demo",
            html: htmlContent,
          };
          sendMail(mailOption, "");
        })

        break;

      case "ContactUs":
        fs.readFile("assets/ContactUs.html", "utf8", (err: any, htmlContent: any) => {
          if (err) {
            console.error("Error reading HTML file:", err);
            // Handle error cases here
            return;
          }
          htmlContent = htmlContent
            .replaceAll("@NAME@", emailOptions.name)
            .replaceAll("@EMAIL@", emailOptions.email)
            .replaceAll("@PHONE@", emailOptions.phone)
            .replaceAll("@SUBJECT@", emailOptions.subject)
            .replaceAll("@MESSAGE@", emailOptions.message)

          let mailOption = {
            from: emailOptions.email,
            to: process.env.ICMA_COMPANY_EMAIL || 'mohammad531@gmail.com',
            subject: "User Want to connect",
            html: htmlContent,
          };
          sendMail(mailOption, "");
        })

        break;

      case "Subscribe":
        fs.readFile("assets/Subscribe.html", "utf8", (err: any, htmlContent: any) => {
          if (err) {
            console.error("Error reading HTML file:", err);
            // Handle error cases here
            return;
          }
          htmlContent = htmlContent
            .replaceAll("@EMAIL@", emailOptions.email)
            
          let mailOption = {
            from: emailOptions.email,
            to: process.env.ICMA_COMPANY_EMAIL || 'mohammad531@gmail.com',
            subject: "User Subscribe your website",
            html: htmlContent,
          };
          sendMail(mailOption, "");
        })

        break;

      default:
        break;
    }
  }




  static uploadFile() {
    // Set up storage options for multer
    const storage: StorageEngine = multer.diskStorage({

      destination: (req: express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {


        const uploadDir = `uploads/`;
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir);
        }

        // creating personal folder for each user by his username and id
        const personalFolder = path.join(uploadDir, `excels/`);
        if (!fs.existsSync(personalFolder)) {
          fs.mkdirSync(personalFolder)
        }


        cb(null, personalFolder);
      },
      filename: (
        req: express.Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
      ) => {
        cb(null, Date.now() + "-" + file.originalname);
      },
    });

    // Initialize multer with the storage options
    const upload = multer({ storage });
    return upload;
  }




  /**
   * Deletes the specified images from the file system.
   * @param {string[]} imagePaths - An array of file paths to the images to be deleted.
   * @returns {Promise<string[]>} - A promise that resolves to an array of strings, where each string is a message indicating the result of deleting the corresponding image.
   * If an image does not exist or could not be deleted, an error message is returned instead.
   */
  static async deleteImages(imagePaths: string[]): Promise<string[]> {

    const results: string[] = [];

    try {

      const deletedPromises = imagePaths.map(async (path) => {
        // Check if the file exists before attempting to delete it
        // import promises as anyname from fs module and use it to delete image or file
        try {
          await deletePromises.access(path);
        } catch (error: any) {
          results.push(`Error: Image does not exist or could not be deleted: ${path}`);
          return;
        }

        // Attempt to delete the file
        try {
          await deletePromises.unlink(path);
          results.push(`Successfully deleted: ${path}`);
        } catch (error: any) {
          results.push(`Error: Could not delete image: ${path}`);
          results.push(`Error: Image does not exist or could not be deleted: ${path}`);
        }
      });

      // Use Promise.all to run all deletion operations concurrently
      await Promise.all(deletedPromises);

      return results;
    } catch (error) {
      console.error('Error deleting images:', error);
      return Promise.reject("Error deleting images");
    }
    /******  ec31dcd7-53fa-49cf-a7b4-8e0192b36409  *******/
  }

}
export default CommonUtils;
