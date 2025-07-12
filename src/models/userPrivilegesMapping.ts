import mongoose, { Schema, Document } from "mongoose";

export interface IUserPrivilegesMapping extends Document {
    userId: number;
    privilegeId: number;
    createdOn: Date;
    createdBy?: number;
    updatedOn?: Date | null;
    updatedBy?: number;
    isDeleted: number;
    deletedOn?: Date | null;
    deletedBy?: number;
}

const UserPrivilegesMappingSchema = new Schema<IUserPrivilegesMapping>(
    {
        userId: {
            type: Number,
            required: true,
            alias: "user_id",
        },
        privilegeId: {
            type: Number,
            required: true,
            alias: "privilege_id",
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

const UserPrivilegesMapping = mongoose.model<IUserPrivilegesMapping>(
    "UserPrivilegesMapping", UserPrivilegesMappingSchema
);

export default UserPrivilegesMapping;
