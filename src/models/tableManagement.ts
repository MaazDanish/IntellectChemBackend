import mongoose, { Schema, Document } from 'mongoose';

export interface IColumnSetting {
    key: string;              // actual DB field name
    displayName: string;      // column label shown in UI
    showInTable: boolean;     // show in UI table
    showInFilter: boolean;    // filterable in UI
    order: number;            // display order
    width: number;            // column width in px or %
}

export interface ITableConfig extends Document {
    tableName: string;        // actual collection/table name
    columns: IColumnSetting[];
    createdBy?: string;
    updatedBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const ColumnSettingSchema = new Schema<IColumnSetting>({
    key: { type: String, required: true },
    displayName: { type: String, required: true },
    showInTable: { type: Boolean, default: true },
    showInFilter: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    width: { type: Number, default: 150 },
});

const TableConfigSchema = new Schema<ITableConfig>(
    {
        tableName: { type: String, required: true, unique: true },
        columns: [ColumnSettingSchema],
        createdBy: { type: String },
        updatedBy: { type: String },
    },
    {
        timestamps: false,
        collection: "table_management", // 👈 force MongoDB to use this collection name
    }
);

export const TableManagementModel = mongoose.model<ITableConfig>('TableManagement', TableConfigSchema);
