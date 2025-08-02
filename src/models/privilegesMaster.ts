// import CommonUtils from "../../utils/common";
import BaseResponse from "./common/baseResponse";
import mongoose, { Schema, Document } from "mongoose";
import CommonRequestModel from "./common/commonRequestModel";

export class PrivilegesMasterModelDTO extends BaseResponse {
    public filterModel: CommonRequestModel | undefined;
}

export interface IPrivilegesMaster extends Document {
    name: string;
    privilegeUniqueId: string;
    createdOn: Date;
    createdBy?: number;
    updatedOn?: Date | null;
    updatedBy?: number;
    isDeleted: number;
    deletedOn?: Date | null;
    deletedBy?: number;
}

const PrivilegesMasterSchema = new Schema<IPrivilegesMaster>(
    {
        name: {
            type: String,
            maxlength: 255,
        },
        privilegeUniqueId: {
            type: String,
            maxlength: 255,
            alias: "privilege_unique_id",
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
        collection: "privileges_master", // Matches the table name
    }
);

export const PrivilegesMaster = mongoose.model<IPrivilegesMaster>("PrivilegesMaster", PrivilegesMasterSchema);

