import BaseResponse from "./common/baseResponse.js";
import mongoose, { Schema, Document } from "mongoose";
import CommonRequestModel from "./common/commonRequestModel.js";


export class UserUsageModelDTO extends BaseResponse {
    public filterModel: CommonRequestModel | undefined;
}


export interface IUserUsageMaster extends Document {
    userId: number;
    totalSearch: number;
    usedSearch: number,
    remainingSearch: number;
    totalPages: number;
    totalRowsToDownload: number;
    createdOn: Date;
    createdBy?: number;
    updatedOn?: Date | null;
    updatedBy?: number;
    isDeleted: number;
    deletedOn?: Date | null;
    deletedBy?: number;
}


const UserUsageSchema = new Schema<IUserUsageMaster>(
    {
        userId: {
            type: Number,
            required: true,
            alias: "user_id",
        },
        totalSearch: {
            type: Number,
            required: true,
            alias: "total_search",
            default: 15
        },
        usedSearch: {
            type: Number,
            required: true,
            alias: "used_search",
            default: 0
        },
        remainingSearch: {
            type: Number,
            required: true,
            alias: "remaining_search",
            default: 15
        },
        totalPages: {
            type: Number,
            required: true,
            alias: "total_pages",
            default: 5
        },
        totalRowsToDownload: {
            type: Number,
            required: true,
            alias: "total_rows_to_download",
            default: 100
        },
        createdOn: {
            type: Date,
            required: true,
            default: new Date(),
            alias: "created_on",
        },
        createdBy: {
            type: Number,
            default: null,
            alias: "created_by",
        },
        updatedOn: {
            type: Date,
            default: null,
            alias: "updated_on",
        },
        updatedBy: {
            type: Number,
            default: null,
            alias: "updated_by",
        },
        isDeleted: {
            type: Number,
            default: 0,
            required: true,
            alias: "is_deleted",
        },
        deletedOn: {
            type: Date,
            default: null,
            alias: "deleted_on",
        },
        deletedBy: {
            type: Number,
            default: null,
            alias: "deleted_by",
        },
    },
    {
        timestamps: false,
        collection: "user_privileges_mapping",
    }
);


const UsersUsage = mongoose.model<IUserUsageMaster>("UserUsage", UserUsageSchema);


export default UsersUsage;
