import BaseResponse from "./common/baseResponse";
import mongoose, { Schema, Document } from "mongoose";
import CommonRequestModel from "./common/commonRequestModel";

export class CommonModelDTO extends BaseResponse {
  public filterModel: CommonRequestModel | undefined;
}

interface IProductMaster extends Document {
  type?: string;
  month?: string;
  portOfLoading?: string;
  modeOfShipment?: string;
  portCode?: string;
  sbillNo?: number;
  sbillDate?: Date;
  ritcCode?: string;
  itemDescription?: string;
  quantity?: number;
  uqc?: string;
  unitRateInFC?: number;
  currency?: string;
  unitValueInINR?: number;
  totalValueFC?: number;
  totalFOBValueInINR?: number;
  invoiceNo?: string;
  portOfDischarge?: string;
  country?: string;
  consigneeName?: string;
  consigneeAddress?: string;
  consigneeCountry?: string;
  iec?: string;
  exporterName?: string;
  exporterAddress?: string;
  exporterCityState?: string;
  exporterPin?: string;
  exporterContactPerson1?: string;
  exporterContactPerson2?: string;
  iecDateOfEstablishment?: Date;
  iecPan?: string;
  chapter?: string;
  createdon?: Date;
  createdby?: string;
}

const ProductMasterSchema: Schema = new Schema(
  {
    type: { type: String, required: false },
    month: { type: String, required: false },
    portOfLoading: { type: String, required: false },
    modeOfShipment: { type: String, required: false },
    portCode: { type: String, required: false },
    sbillNo: { type: Number, required: false },
    sbillDate: { type: Date, required: false },
    ritcCode: { type: String, required: false },
    itemDescription: { type: String, required: false },
    quantity: { type: Number, required: false },
    uqc: { type: String, required: false },
    unitRateInFC: { type: Number, required: false },
    currency: { type: String, required: false },
    unitValueInINR: { type: Number, required: false },
    totalValueFC: { type: Number, required: false },
    totalFOBValueInINR: { type: Number, required: false },
    invoiceNo: { type: String, required: false },
    portOfDischarge: { type: String, required: false },
    country: { type: String, required: false },
    consigneeName: { type: String, required: false },
    consigneeAddress: { type: String, required: false },
    consigneeCountry: { type: String, required: false },
    iec: { type: String, required: false },
    exporterName: { type: String, required: false },
    exporterAddress: { type: String, required: false },
    exporterCityState: { type: String, required: false },
    exporterPin: { type: String, required: false },
    exporterContactPerson1: { type: String, required: false },
    exporterContactPerson2: { type: String, required: false },
    iecDateOfEstablishment: { type: Date, required: false },
    iecPan: { type: String, required: false },
    chapter: { type: String, required: false },
    createdon: { type: Date, required: false },
    createdby: { type: String, required: false },
  },
  {
    timestamps: false,
    collection: "product_master"
  }
);


const ProductMaster = mongoose.model<IProductMaster>("ProductMaster", ProductMasterSchema);
export default ProductMaster;
