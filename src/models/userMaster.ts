import BaseResponse from "./common/baseResponse";
import mongoose, { Schema, Document } from "mongoose";
import CommonRequestModel from "./common/commonRequestModel";


export class UserMasterModelDTO extends BaseResponse {
    public filterModel: CommonRequestModel | undefined;
}


export interface IUserMaster extends Document {
    honorifics: number;
    fullName: string;
    companyName: string;
    designation: string;
    emailId: string;
    mobileNumber: string;
    password: string;
    address: string;
    countryId?: number;
    stateId?: number;
    districtId?: number;
    pinCode: string;
    gender: number;
    isAdmin: number;
    isActive: number;
}


const UserMasterSchema = new Schema<IUserMaster>(
    {
        honorifics: {
            type: Number,
            required: true,
            default: 1,
        },
        companyName: {
            type: String,
            maxlength: 255,
            default: null,
            required: true,
            alias: "company_name",
        },
        fullName: {
            type: String,
            maxlength: 255,
            required: true,
            alias: "full_name",
        },
        emailId: {
            type: String,
            required: true,
            unique: true,
            maxlength: 100,
            alias: "email_id",
        },
        mobileNumber: {
            type: String,
            required: true,
            unique: true,
            maxlength: 30,
            default: "",
            alias: "mobile_number",
        },
        password: {
            type: String,
            required: true,
            maxlength: 200,
        },
        address: {
            type: String,
            required: true,
            maxlength: 1000,
            default: "",
        },
        countryId: {
            type: Number,
            default: null,
            alias: "country_id",
        },
        stateId: {
            type: Number,
            default: null,
            alias: "state_id",
        },
        districtId: {
            type: Number,
            default: null,
            alias: "district_id",
        },
        pinCode: {
            required: true,
            type: String,
            default: null,
            alias: "pin_code",
        },
        gender: {
            type: Number,
            required: true,
            default: 1,
        },
        isAdmin: {
            type: Number,
            required: true,
            default: 0,
            alias: "is_admin",
        },
        isActive: {
            type: Number,
            required: true,
            default: 1,
            alias: "is_active",
        }
    },
    {
        timestamps: false,
        collection: "user_master", // 👈 force MongoDB to use this collection name
    }
);


const UserMaster = mongoose.model<IUserMaster>("UserMaster", UserMasterSchema);


export default UserMaster;
