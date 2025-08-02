import BaseResponse from "./common/baseResponse";
import mongoose, { Schema, Document } from "mongoose";
import CommonRequestModel from "./common/commonRequestModel";


export class UserUsageModelDTO extends BaseResponse {
    public filterModel: CommonRequestModel | undefined;
}


export interface IUserUsageMaster extends Document {
    userId: string;
    totalSearch: number;
    usedSearch: number,
    remainingSearch: number;
    totalPages: number;
    totalRowsToDownload: number;
    isActive: number;
    createdOn: Date;
    createdBy?: string | null;
    updatedOn?: Date | null;
    updatedBy?: string | null;
    isDeleted: number;
    deletedOn?: Date | null;
    deletedBy?: string | null;
}


const UserUsageSchema = new Schema<IUserUsageMaster>(
    {
        userId: {
            type: String,
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
        isActive: {
            type: Number,
            required: true,
            alias: "is_active",
            default: 1
        },
        createdOn: {
            type: Date,
            required: true,
            default: new Date(),
            alias: "created_on",
        },
        createdBy: {
            type: String,
            default: null,
            alias: "created_by",
        },
        updatedOn: {
            type: Date,
            default: null,
            alias: "updated_on",
        },
        updatedBy: {
            type: String,
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
            type: String,
            default: null,
            alias: "deleted_by",
        },
    },
    {
        timestamps: false,
        collection: "user_usage", // 👈 force MongoDB to use this collection name
    }
);


const UsersUsage = mongoose.model<IUserUsageMaster>("UserUsage", UserUsageSchema);


export default UsersUsage;
