import { body } from "express-validator";
import UsersUsage from "../models/userUsageModel";

class ProductValidations {
    public static getProductListValidations = [
        body("data.pageSize")
            .isNumeric()
            .withMessage("Provide Valid Page Size"),
        body("data.currentPage")
            .isNumeric()
            .withMessage("Provide Valid Page Number")
            .custom(async (value, { req }) => {
                const userId = req?.body.auth_token?.userId;

                const userUsage = await UsersUsage.findOne({ userId: userId, isActive: 1 });

                if (userUsage) {
                    if (userUsage.remainingSearch <= 0) {
                        return Promise.reject("You have used up your daily search limit. To continue, please upgrade your plan or reach out to the admin for assistance.");
                    }

                    await UsersUsage.updateOne(
                        {
                            userId: req.body.auth_token.userId,
                            isActive: 1
                        }, // filter
                        {
                            $inc: {
                                usedSearch: 1,        // increment usedSearch by 1
                                remainingSearch: -1   // decrement remainingSearch by 1
                            }
                        }
                    );
                }

            }),
    ];

}
export default ProductValidations;
