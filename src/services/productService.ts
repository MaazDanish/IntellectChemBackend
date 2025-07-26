import XLSX from 'xlsx';
import logger from "../logger.js";
import CommonUtils from "../utils/common.js";
import { eReturnCodes } from "../enums/commonEnums.js";
import RequestModel from "../models/common/requestModel.js";
import ProductMaster, { CommonModelDTO } from "../models/productMaster.js";
import CommonRequestModel from '../models/common/commonRequestModel.js';


class ProductManagement {

	public async getList(req: RequestModel): Promise<CommonModelDTO> {
		const productDTO: CommonModelDTO = new CommonModelDTO(
			CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
		)

		const filterModel: CommonRequestModel = { ...req.data };
		const offset = (filterModel.currentPage - 1) * filterModel.pageSize;
		const limit = filterModel.pageSize;
		const searchValue = req?.data?.searchText;
		let filter: any = {};

		try {


			if (searchValue) {
				filter["itemDescription"] = { $regex: searchValue, $options: "i" }; // Equivalent to LIKE '%searchText%'
			}

			const totalRecords = await ProductMaster.countDocuments(filter);
			const productList = await ProductMaster.find(filter)
				.limit(limit)
				.skip(offset);


			filterModel.totalRows = totalRecords;
			filterModel.filterRowsCount = productList.length;
			productDTO.filterModel = filterModel;
			productDTO.data = productList;
			return productDTO;
		} catch (error: any) {
			logger.info(error.message)
			productDTO.data = [];
			productDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
			return productDTO;
		}
	}

	public async editProductById(req: RequestModel): Promise<CommonModelDTO> {
		const productDTO: CommonModelDTO = new CommonModelDTO(
			CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
		)

		const { id, ...updateData } = req.data;

		try {

			const updatedProduct = await ProductMaster.findByIdAndUpdate(
				id,
				updateData,
				{ new: true }
			);

			if (!updatedProduct) {
				productDTO.data = [];
				productDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_NOT_FOUND);
				return productDTO;
			}

			productDTO.data = updatedProduct;
			return productDTO;
		} catch (error: any) {
			logger.info(error.message)
			productDTO.data = [];
			productDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
			return productDTO;
		}
	}

	public async deleteProductRawsByIds(req: RequestModel): Promise<CommonModelDTO> {
		const productDTO: CommonModelDTO = new CommonModelDTO(
			CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
		)

		const ids: any[] = req.data.ids;

		try {

			let deletedProducts: any[] = [];
			if (ids && ids.length) {
				for (const id of ids) {
					const deletedProduct = await ProductMaster.findByIdAndDelete(id);
					if (deletedProduct) {
						deletedProducts.push(deletedProduct);
					}
				}
			}

			if (deletedProducts.length === 0) {
				productDTO.data = [];
				productDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_NOT_FOUND);
				return productDTO;
			}

			productDTO.data = deletedProducts;
			return productDTO;
		} catch (error: any) {
			logger.info(error.message)
			productDTO.data = [];
			productDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
			return productDTO;
		}
	}


	public async getSpecificRawById(req: RequestModel): Promise<CommonModelDTO> {
		const productDTO: CommonModelDTO = new CommonModelDTO(
			CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
		)

		const id = req.data.id;

		try {

			const product = await ProductMaster.findById(id);

			if (!product) {
				productDTO.data = [];
				productDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_NOT_FOUND);
				return productDTO;
			}

			productDTO.data = product;
			return productDTO;
		} catch (error: any) {
			logger.info(error.message)
			productDTO.data = [];
			productDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
			return productDTO;
		}
	}


	public async uploadExcel(reqFile: any, req: any): Promise<CommonModelDTO> {

		const productDTO: CommonModelDTO = new CommonModelDTO(
			CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
		)

		const buffer = reqFile.buffer;
		const userId = req.body.auth_token.userId;

		try {

			const workbook = XLSX.read(buffer, { type: 'buffer' });


			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];
			const data = XLSX.utils.sheet_to_json(worksheet);


			const addedData = await ProductManagement.addToDatabase(data, userId);

			productDTO.data = addedData;
			return productDTO;
		} catch (error: any) {
			logger.info(error.message);
			productDTO.data = [];
			productDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
			return productDTO;
		}
	}


	static async addToDatabase(data: any, userId: any): Promise<any> {
		let newData: any = [];
		try {

			for (let i = 0; i < data.length; i++) {

				if (i == 100) {
					break; // Limit to 100 records
				}

				newData.push({
					type: data[i].Type,
					month: data[i].Month,
					portOfLoading: data[i]['Port of Loading'],
					modeOfShipment: data[i]['Mode of Shipment'],
					portCode: data[i]['Port Code'],
					sBillNo: data[i]['SBill No'],
					sBillDate: data[i]['SBill Date'],
					ritcCode: data[i]['RITC Code'],
					itemDescription: data[i]['Item Description'],
					quantity: data[i].Quantity,
					uqc: data[i].UQC,
					unitRateInFC: data[i]['Unit Rate in FC'],
					currency: data[i].Currency,
					unitValueInINR: data[i]['Unit Value in INR'],
					totalValueFC: data[i]['Total Value FC'],
					totalFobValueInINR: data[i]['Total FOB Value in INR'],
					invoiceNo: data[i]['Invoice No'],
					portOfDischarge: data[i]['Port of Discharge'],
					country: data[i].Country,
					consigneeName: data[i]['Consignee Name'],
					consigneeAddress: data[i]['Consignee Address'],
					consigneeCountry: data[i]['Consignee Country'],
					exporterName: data[i]['Exporter Name'],
					exporterAddress: data[i]['Exporter Address'],
					exporterCityState: data[i]['Exporter City State'],
					exporterPIN: data[i]['Exporter PIN'],
					exporterContactPerson1: data[i]['Exporter Contact Person 1'],
					exporterContactPerson2: data[i]['Exporter Contact Person 2'],
					iecDateOfEstablishment: data[i]['IEC Date of Establishment'],
					iecPAN: data[i]['IEC PAN'],
					chapter: data[i].Chapter,
					createdon: new Date(),
					createdby: userId
				});
			}

			const result = await ProductMaster.insertMany(newData);
			return result;
		} catch (error: any) {
			logger.info(error.message);
			return error;
		}
	}



}


export default new ProductManagement();