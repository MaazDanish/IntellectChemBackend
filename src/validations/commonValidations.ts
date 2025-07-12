import { body } from "express-validator";
import UserMaster from "../models/userMaster";
import { log } from "console";

const models: Record<string, { model: any; attributes: string[] }> = {
    UserMaster: { model: UserMaster, attributes: ["_id"] },
};


class CommonValidations {
    public static filterModelValidations = [
        body("data.currentPage")
            .optional()
            .customSanitizer((value) => value || 1),

        body("data.pageSize")
            .optional()
            .customSanitizer((value) => value || 10),
    ];

    /**
     * Validation for getting data by field
     * @param table - Table name
     * @param column - Column name
     * @param value - Value to be searched
     * @returns - Data from the table
     */
    public static async getDataByFieldValidations(
        collection: string,
        field: string,
        value: string
    ): Promise<any> {
        const modelInfo = models[collection];

        if (!modelInfo) {
            throw new Error(`Model for collection "${collection}" not found.`);
        }

        const { model } = modelInfo;

        try {
            const query: any = { [field]: value };
            // log(`Query in getDataByFieldValidations: ${JSON.stringify(query)}`, collection, field, value);
            const data = await model.findOne(query).lean(); // no need to access `.model` inside `model`
            // console.log(data, "data in getDataByFieldValidations");
            return data;
        } catch (error: any) {
            console.error("Error in getDataByFieldValidations:", error);
            throw error;
        }
    }


    /**
     * Fetch all data from a specified table with optional filtering by a column and value.
     * 
     * @param table - The name of the table to fetch data from.
     * @param column - (Optional) The column name to filter data by.
     * @param value - (Optional) The value to filter the specified column by.
     * @returns - A promise that resolves to an array of data from the table.
     * @throws - An error if the specified model for the table is not found.
     */
    public static async getAllData(table: string, column?: string, value?: any): Promise<any> {
        const modelInfo = models[table];

        if (!modelInfo) {
            throw new Error(`Model for table "${table}" not found.`);
        }

        const { model, attributes } = modelInfo;
        const whereCondition: any = { isDeleted: 0 };

        // Apply column and value filtering if provided
        if (column && value !== undefined) {
            whereCondition[column] = value;
        }

        try {
            // Fetch data from the database with the specified conditions
            const data = await model.findAll({
                where: whereCondition,
                attributes,
            });

            return data;
        } catch (error: any) {
            console.error(`Error fetching from table ${table}:`, error);
            return [];
        }
    }


    public static commonNameValidation = (tableName: string, columnName: string, payloadValue: string) => {
        return [
            body(payloadValue)
                .notEmpty()
                .withMessage(`${columnName} is required.`)
                .custom(async (value, { req }) => {

                    const { id } = req.body.data || {};

                    const existingData: any =
                        await CommonValidations.getDataByFieldValidations(
                            tableName,
                            columnName,
                            value
                        );

                    if (existingData && existingData.id != id) {
                        return Promise.reject(`${value} already exists.`);
                    }
                }),
        ];
    };


}

export default CommonValidations;
