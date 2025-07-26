import mongoose, { Schema, Document } from "mongoose";

export interface IUserPrivilegesMapping extends Document {
    userId: string;
    privilegeId: string;
    createdOn: Date;
    createdBy?: string;
    updatedOn?: Date | null;
    updatedBy?: string;
    isDeleted: number;
    deletedOn?: Date | null;
    deletedBy?: string;
}

const UserPrivilegesMappingSchema = new Schema<IUserPrivilegesMapping>(
    {
        userId: {
            type: String,
            required: true,
            alias: "user_id",
        },
        privilegeId: {
            type: String,
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
        collection: "user_privileges_mapping",
    }
);

const UserPrivilegesMapping = mongoose.model<IUserPrivilegesMapping>("UserPrivilegesMapping", UserPrivilegesMappingSchema);

export default UserPrivilegesMapping;
