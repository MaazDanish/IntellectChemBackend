import BaseResponse from "./common/baseResponse";
import mongoose, { Schema, Document, Model } from "mongoose";
import CommonRequestModel from "./common/commonRequestModel";

export class ProductMasterModelDTO extends BaseResponse {
  public filterModel: CommonRequestModel | undefined;
}

// 1. Interface
export interface IProductMaster extends Document {
  type: number;
  month: number;
  year: number;
  portOfLoading?: string;
  modeOfShipment?: string;
  portCode?: string;
  beNo?: string;
  sbillNo?: number;
  sbillDate?: Date;
  cush?: string;
  ritcCode?: number;
  hsCode?: number;
  itemDescription?: string;
  quantity?: number;
  unit?: string;
  unitRateInFC?: number;
  currency?: string;
  unitValueInINR?: number;
  totalValueFC?: number;
  totalFOBValueInINR?: number;
  totalDutyPaid?: number;
  chaName?: string;
  invoiceNo?: string;
  portOfDischarge?: string;


  importer?: string;
  importerAddress?: string;
  importerCityState?: string;
  importerPinCode?: string;
  importerPhone?: string;
  importerMail?: string;
  importerContactPerson1?: string;
  importerContactPerson2?: string;
  importerCountry?: string;


  iec?: string;


  exporter?: string;
  exporterAddress?: string;
  exporterCityState?: string;
  exporterCountry?: string;
  exporterPinCode?: string;
  exporterPhone?: string;
  exporterMail?: string;
  exporterContactPerson1?: string;
  exporterContactPerson2?: string;


  iecDateOfEstablishment?: Date;
  iecPan?: string;
  chapter?: string;
  createdOn?: Date;
  createdBy?: string;
}

// 2. Schema with snake_case fields
const ProductMasterSchema: Schema<IProductMaster> = new Schema(
  {
    type: { type: Number, field: "type" },
    month: { type: Number, field: "month" },
    year: { type: Number, field: "year" },
    portOfLoading: { type: String, field: "port_of_loading" },
    modeOfShipment: { type: String, field: "mode_of_shipment" },
    portCode: { type: String, field: "port_code" },
    beNo: { type: String, field: "be_no" },
    sbillNo: { type: Number, field: "sbill_no" },
    sbillDate: { type: Date, field: "sbill_date" },
    cush: { type: String, field: "cush" },
    ritcCode: { type: Number, field: "ritc_code" },
    hsCode: { type: Number, field: "hs_code" },
    itemDescription: { type: String, field: "item_description" },
    quantity: { type: Number, field: "quantity" },
    unit: { type: String, field: "unit" },
    unitRateInFC: { type: Number, field: "unit_rate_in_fc" },
    currency: { type: String, field: "currency" },
    unitValueInINR: { type: Number, field: "unit_value_in_inr" },
    totalValueFC: { type: Number, field: "total_value_fc" },
    totalFOBValueInINR: { type: Number, field: "total_fob_value_in_inr" },
    totalDutyPaid: { type: Number, field: "total_duty_paid" },
    chaName: { type: String, field: "cha_name" },
    invoiceNo: { type: String, field: "invoice_no" },
    portOfDischarge: { type: String, field: "port_of_discharge" },
    importer: { type: String, field: "importer" },
    importerAddress: { type: String, field: "importer_address" },
    importerCityState: { type: String, field: "importer_city_state" },
    importerPinCode: { type: String, field: "importer_pin_code" },
    importerPhone: { type: String, field: "importer_phone" },
    importerMail: { type: String, field: "importer_mail" },
    importerContactPerson1: { type: String, field: "importer_contact_person1" },
    importerContactPerson2: { type: String, field: "importer_contact_person2" },
    importerCountry: { type: String, field: "importer_country" },
    iec: { type: String, field: "iec" },
    exporter: { type: String, field: "exporter" },
    exporterAddress: { type: String, field: "exporter_address" },
    exporterCountry: { type: String, field: "exporter_country" },
    exporterCityState: { type: String, field: "exporter_city_state" },
    exporterPinCode: { type: String, field: "exporter_pin_code" },
    exporterPhone: { type: String, field: "exporter_phone" },
    exporterMail: { type: String, field: "exporter_mail" },
    exporterContactPerson1: { type: String, field: "exporter_contact_person1" },
    exporterContactPerson2: { type: String, field: "exporter_contact_person2" },
    iecDateOfEstablishment: { type: Date, field: "iec_date_of_establishment" },
    iecPan: { type: String, field: "iec_pan" },
    chapter: { type: String, field: "chapter" },
    createdOn: { type: Date, field: "created_on" },
    createdBy: { type: String, field: "created_by" },
  },
  {
    timestamps: false,
    collection: "product_master",
  }
);


// 3. Model
const ProductMaster = mongoose.model<IProductMaster>(
  "ProductMaster",
  ProductMasterSchema
);

export default ProductMaster;