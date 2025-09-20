import mongoose, { Schema, Document } from "mongoose";
import BaseResponse from "./common/baseResponse";
import CommonRequestModel from "./common/commonRequestModel";

export class SynonymBunchSchemaModelDTO extends BaseResponse {
  public filterModel: CommonRequestModel | undefined;
}
interface ISynonymBunch extends Document {
  compoundId: string;
  mainName: string;
  synonyms: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const SynonymBunchSchema: Schema = new Schema(
  {
    compoundId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      alias: "compound_id",
    },
    mainName: {
      type: String,
      required: true,
      index: true,
      alias: "main_name",
    },
    synonyms: [
      {
        type: String,
        index: true,
        alias: "synonyms",
      },
    ],
  },
  {
    timestamps: true,
    collection: "synonym_bunches",
  }
);

// Indexes
SynonymBunchSchema.index({ mainName: "text", synonyms: "text" });

const SynonymBunch = mongoose.model<ISynonymBunch>(
  "SynonymBunch",
  SynonymBunchSchema
);

export default SynonymBunch;
