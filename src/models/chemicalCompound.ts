import mongoose, { Schema, Document } from "mongoose";

interface IChemicalCompound extends Document {
  name: string;
  molecularFormula: string;
  properties: string;
  casNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ChemicalCompoundSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    molecularFormula: { type: String, required: true },
    properties: { type: String, required: true },
    casNumber: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const ChemicalCompound = mongoose.model<IChemicalCompound>("ChemicalCompound", ChemicalCompoundSchema);
export default ChemicalCompound;
