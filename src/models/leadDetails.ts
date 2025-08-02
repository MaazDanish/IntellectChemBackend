import BaseResponse from "./common/baseResponse";
import mongoose, { Schema, Document } from "mongoose";
import CommonRequestModel from "./common/commonRequestModel";

export class LeadDetailsModelDTO extends BaseResponse {
  public filterModel: CommonRequestModel | undefined;
}

export interface LeadDetails extends Document {
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  company?: string;
  subject?: string;
  message?: string;
  leadType: number;
}

const LeadDetailsSchema: Schema = new Schema(
  {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    date: { type: String },
    time: { type: String },
    company: { type: String },
    subject: { type: String },
    message: { type: String },
    leadType: { type: Number, required: true },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    collection: 'lead_details'
  }
);

const LeadDetailsModel = mongoose.model<LeadDetails>("LeadDetails", LeadDetailsSchema);
export default LeadDetailsModel;
