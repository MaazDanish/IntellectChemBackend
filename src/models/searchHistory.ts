import mongoose, { Schema, Document } from "mongoose";

// DTO
import BaseResponse from "./common/baseResponse";
import CommonRequestModel from "./common/commonRequestModel";

export class SearchHistoryModelDTO extends BaseResponse {
    public filterModel: CommonRequestModel | undefined;
}

// Interface for SearchHistory document
export interface ISearchHistory extends Document {
    userId?: string;              // logged-in user (optional if anonymous)
    searchKeywords: { field: string; value: string }[]; // array of objects
    searchType: number;           // e.g., 1 = simple, 2 = advanced, etc.
    ipAddress?: string;           // public IP of client
    emailId?: string;           // public IP of client
    fullName?: string;           // public IP of client
    totalRecords: number;         // number of records returned by this search
    totalFilteredRecords: number;         // number of records returned by this search
    searchedDatabase?: number;    // e.g., "ProductMaster"
    searchedOn: Date;             // timestamp
}

// Schema
const SearchHistorySchema = new Schema<ISearchHistory>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId, // or Number if you store numeric IDs
            ref: "UserMaster",  // 👈 tells Mongoose which model to join with
            required: true,
        }, searchKeywords: {
            type: [
                {
                    field: { type: String, required: true },
                    value: { type: String, required: true }
                }
            ],
            required: true,
            default: [],
            alias: "search_keywords"
        },
        emailId: { type: String, required: true, alias: "email_id" },
        fullName: { type: String, required: true, alias: "full_name" },
        searchType: { type: Number, required: true, default: 1, alias: "search_type" },
        ipAddress: { type: String, required: false, alias: "ip_address" },
        totalRecords: { type: Number, required: true, alias: "total_records" },
        totalFilteredRecords: { type: Number, required: true, alias: "total_filtered_records" },
        searchedDatabase: { type: Number, required: false, alias: "searched_database" },
        searchedOn: { type: Date, required: true, default: Date.now, alias: "searched_on" },
    },
    {
        timestamps: false,
        collection: "search_history",
    }
);

const SearchHistory = mongoose.model<ISearchHistory>(
    "SearchHistory",
    SearchHistorySchema
);

export default SearchHistory;
