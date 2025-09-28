import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import dayjs from "dayjs";
import logger from "../logger";
import CommonUtils from "../utils/common";
import { ISearchHistory } from '../enums/interface';
import RequestModel from "../models/common/requestModel";
import customParseFormat from "dayjs/plugin/customParseFormat";
import CommonRequestModel from '../models/common/commonRequestModel';
import ProductMaster, { ProductMasterModelDTO } from "../models/productMaster";
import SearchHistory, { SearchHistoryModelDTO } from '../models/searchHistory';
import SynonymBunch, { SynonymBunchSchemaModelDTO } from '../models/synonymBunches';
import { eDatabase, eImportExportType, eReturnCodes, eSearchType } from "../enums/commonEnums";
import UsersUsage, { UserUsageModelDTO } from '../models/userUsageModel';
import UserMaster from '../models/userMaster';

dayjs.extend(customParseFormat);


class ProductManagement {

	// public async getList(req: RequestModel): Promise<ProductMasterModelDTO> {
	// 	const productDTO: ProductMasterModelDTO = new ProductMasterModelDTO(
	// 		CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
	// 	)

	// 	const filterModel: CommonRequestModel = { ...req.data };
	// 	const offset = (filterModel.currentPage - 1) * filterModel.pageSize;
	// 	const limit = filterModel.pageSize;
	// 	const searchValue = req?.data?.searchText;
	// 	let filter: any = {};

	// 	try {

	// 		filterModel.totalRows = await ProductMaster.countDocuments();
	// 		// let synonymSeaches: any = [];
	// 		let synonymSearches: string[] = [];

	// 		if (filterModel.searchType === eSearchType.SYNONYM_SEARCH) {
	// 			const fil = await SynonymBunch.findOne({
	// 				synonyms: { $regex: searchValue, $options: "i" },
	// 			}).select("synonyms -_id"); // only return synonyms field, exclude _id

	// 			if (fil) {
	// 				synonymSearches = fil.synonyms;
	// 			}
	// 		}


	// 		// // Global Search
	// 		function escapeRegex(str: string): string {
	// 			return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	// 		}

	// 		if (filterModel.searchType == eSearchType.SYNONYM_SEARCH) {
	// 			if (synonymSearches.length > 0) {
	// 				filter["$or"] = synonymSearches.map((syn) => ({
	// 					itemDescription: { $regex: escapeRegex(syn), $options: "i" }
	// 				}));
	// 			}
	// 		} else if (searchValue) {
	// 			filter["itemDescription"] = { $regex: searchValue, $options: "i" }; // Equivalent to LIKE '%searchText%'
	// 			filter["importer"] = { $regex: searchValue, $options: "i" }; // Equivalent to LIKE '%searchText%'
	// 			filter["importerCountry"] = { $regex: searchValue, $options: "i" }; // Equivalent to LIKE '%searchText%'
	// 			filter["exporter"] = { $regex: searchValue, $options: "i" }; // Equivalent to LIKE '%searchText%'
	// 			filter["exporterCountry"] = { $regex: searchValue, $options: "i" }; // Equivalent to LIKE '%searchText%'
	// 		}

	// 		if (req.data.advanceFilters && req.data.advanceFilters.length > 0 && filterModel.searchType == eSearchType.ADVANCED_SEARCH) {
	// 			const advancedFilter = await buildAdvancedFilter(req.data.advanceFilters);
	// 			if (advancedFilter) {
	// 				filter = { ...filter, ...advancedFilter };
	// 			}
	// 		}


	// 		if (filterModel.importer) {
	// 			filter["importer"] = { $regex: filterModel.importer, $options: "i" };
	// 		}

	// 		if (filterModel.importerCountry) {
	// 			filter["importerCountry"] = { $regex: filterModel.importerCountry, $options: "i" };
	// 		}

	// 		if (filterModel.exporter) {
	// 			filter["exporter"] = { $regex: filterModel.exporter, $options: "i" };
	// 		}

	// 		if (filterModel.exporterCountry) {
	// 			filter["exporterCountry"] = { $regex: filterModel.exporterCountry, $options: "i" };
	// 		}

	// 		if (filterModel.type) {
	// 			filter["type"] = filterModel.type;
	// 		}


	// 		if (filterModel.monthYear) {
	// 			if (filterModel.monthYear.includes("-")) {
	// 				let [mon, yr] = filterModel.monthYear.split("-").map((x: string) => x.trim());

	// 				let monthNumber = parseInt(mon, 10);  // e.g. 1 → January
	// 				let yearNumber = parseInt(yr, 10);    // e.g. 2025

	// 				if (!isNaN(monthNumber) && !isNaN(yearNumber)) {
	// 					filter["month"] = monthNumber;
	// 					filter["year"] = yearNumber;
	// 				}
	// 			} else {
	// 				filter["year"] = filterModel.monthYear;
	// 			}
	// 		}


	// 		if (req?.data?.chapter) {
	// 			filter["chapter"] = req?.data?.chapter;
	// 		}

	// 		// Advance Search

	// 		console.log("filter 2.0  ", JSON.stringify(filter, null, 2));


	// 		filterModel.filterRowsCount = await ProductMaster.countDocuments(filter);
	// 		const productList = await ProductMaster.find(filter)
	// 			.limit(limit)
	// 			.skip(offset);

	// 		productDTO.filterModel = filterModel;
	// 		productDTO.data = productList;
	// 		return productDTO;
	// 	} catch (error: any) {
	// 		logger.info(error.message)
	// 		productDTO.data = [];
	// 		productDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
	// 		return productDTO;
	// 	}
	// }
	public async getList(req: RequestModel, request: any): Promise<ProductMasterModelDTO> {
		const productDTO: ProductMasterModelDTO = new ProductMasterModelDTO(
			CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
		)

		const clientIp =
			request.headers['x-forwarded-for']?.toString().split(',')[0] || // preferred if behind proxy
			request.socket?._peername?.address ||                             // direct connection
			request.connection?.remoteAddress ||                              // fallback
			request.ip;                                                       // express shortcut


		const filterModel: CommonRequestModel = { ...req.data };
		const offset = (filterModel.currentPage - 1) * filterModel.pageSize;
		const limit = filterModel.pageSize;
		let filter: any = {};
		let searchHistory: ISearchHistory = {
			userId: req.auth_token.userId,
			fullName: req.auth_token.fullName,
			emailId: req.auth_token.emailId,
			searchKeywords: [],
			ipAddress: clientIp,
			searchType: eSearchType.SIMPLE_SEARCH,
			totalRecords: 0,
			totalFilteredRecords: 0,
			searchedDatabase: eDatabase.TRADE_ANALYTICS,
			searchedOn: new Date()
		};
		let synonymSearches: string[] = [];


		try {

			filterModel.totalRows = await ProductMaster.countDocuments();
			searchHistory.totalRecords = filterModel.totalRows;

			if (req?.data?.simpleSearch) {
				filter[req?.data?.simpleSearch?.key] = { $regex: req?.data?.simpleSearch?.value, $options: "i" }; // Equivalent to LIKE '%searchText%'
				searchHistory.searchKeywords = [{
					field: req?.data?.simpleSearch?.key,
					value: req?.data?.simpleSearch?.value
				}];
				searchHistory.searchType = eSearchType.SIMPLE_SEARCH;
			} else if (req?.data?.casNumberFilter) {
				filter["itemDescription"] = { $regex: req?.data?.casNumberFilter, $options: "i" }; // Equivalent to LIKE '%searchText%'
				searchHistory.searchKeywords = [{
					field: "itemDescription",
					value: req?.data?.casNumberFilter
				}];
				searchHistory.searchType = eSearchType.CAS_NUMBER_SEARCH;
			} else if (req?.data?.advanceFilters && req?.data?.advanceFilters.length > 0) {
				const advancedFilter = await buildAdvancedFilter(req.data.advanceFilters, searchHistory);
				if (advancedFilter) {
					filter = { ...filter, ...advancedFilter };
				}
				searchHistory.searchType = eSearchType.ADVANCED_SEARCH;
			} else if (req?.data?.synonymSearch) {

				const fil = await SynonymBunch.findOne({
					synonyms: { $regex: req.data.synonymSearch, $options: "i" },
				}).select("synonyms -_id"); // only return synonyms field, exclude _id

				if (fil) {
					synonymSearches = fil.synonyms;
				}

				searchHistory.searchKeywords = [{
					field: "synonyms",
					value: req.data.synonymSearch
				}];
				searchHistory.searchType = eSearchType.SYNONYM_SEARCH;
			}


			if (filterModel.monthYear) {
				if (filterModel.monthYear.includes("-")) {
					let [mon, yr] = filterModel.monthYear.split("-").map((x: string) => x.trim());

					let monthNumber = parseInt(mon, 10);  // e.g. 1 → January
					let yearNumber = parseInt(yr, 10);    // e.g. 2025

					if (!isNaN(monthNumber) && !isNaN(yearNumber)) {
						filter["month"] = monthNumber;
						filter["year"] = yearNumber;
					}
				} else {
					filter["year"] = filterModel.monthYear;
				}
			}



			function escapeRegex(str: string): string {
				return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
			}

			if (synonymSearches.length > 0) {
				filter["$or"] = synonymSearches.map(syn => ({
					itemDescription: { $regex: escapeRegex(syn), $options: "i" }
				}));
			}



			// ✅ Exact matching for tableFilter
			if (req?.data?.tableFilter && req.data.tableFilter.length > 0) {
				for (const tf of req.data.tableFilter) {
					if (tf.field && tf.value !== undefined && tf.value !== null) {
						filter[tf.field] = tf.value;
					}
				}
			}

			if (filterModel.searchText) {
				filter["$or"] = [
					{ itemDescription: { $regex: filterModel.searchText, $options: "i" } },
					{ importer: { $regex: filterModel.searchText, $options: "i" } },
					{ importerCountry: { $regex: filterModel.searchText, $options: "i" } },
					{ exporter: { $regex: filterModel.searchText, $options: "i" } },
					{ exporterCountry: { $regex: filterModel.searchText, $options: "i" } },
				];
			}

			// Advance Search

			// console.log("filter 2.0  ", JSON.stringify(filter, null, 2));


			filterModel.filterRowsCount = await ProductMaster.countDocuments(filter);
			searchHistory.totalFilteredRecords = filterModel.filterRowsCount;

			const productList = await ProductMaster.find(filter)
				.limit(limit)
				.skip(offset);

			// if user did searchh then do it 
			if (searchHistory.searchKeywords.length > 0) {
				await SearchHistory.create(searchHistory);
			}

			productDTO.filterModel = filterModel;
			productDTO.data = productList;
			return productDTO;
		} catch (error: any) {
			console.log(error);

			logger.info(error.message)
			productDTO.data = [];
			productDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
			return productDTO;
		}
	}

	public async editProductById(req: RequestModel): Promise<ProductMasterModelDTO> {
		const productDTO: ProductMasterModelDTO = new ProductMasterModelDTO(
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

	public async deleteProductRawsByIds(req: RequestModel): Promise<ProductMasterModelDTO> {
		const productDTO: ProductMasterModelDTO = new ProductMasterModelDTO(
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


	public async getSpecificRawById(req: RequestModel): Promise<ProductMasterModelDTO> {
		const productDTO: ProductMasterModelDTO = new ProductMasterModelDTO(
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


	public async uploadExcel(reqFile: any, req: any): Promise<ProductMasterModelDTO> {

		const productDTO: ProductMasterModelDTO = new ProductMasterModelDTO(
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

				let type = data[i].TYPE.toLowerCase() == 'export' ? eImportExportType.EXPORT : eImportExportType.IMPORT;
				// 🔹 Parse month & year (always "Mon--YYYY")
				let [mon, yr] = (data[i]["MONTH YEAR"] || "").split("--").map((x: string) => x.trim());
				let monthNumber = dayjs(mon, "MMM").month() + 1; // Jan=0 so +1
				let yearNumber = parseInt(yr, 10);

				if (!monthNumber || !yearNumber) {
					continue;
				}

				newData.push({
					type: type,
					month: monthNumber,
					year: yearNumber,
					portOfLoading: data[i]["PORT OF LOADING"],
					modeOfShipment: data[i]["MODE OF SHIPMENT"],
					portCode: data[i]["PORT CODE"],
					beNo: data[i]["BE NO"],
					sbillNo: data[i]["SBILL NO"],
					sbillDate: data[i]["SBILL DATE"],
					cush: data[i]["CUSH"],
					ritcCode: data[i]["RITC CODE"],
					hsCode: data[i]["HSCODE"],
					itemDescription: data[i]["PRODUCT"],
					quantity: data[i]["QUANTITY"],
					unit: data[i]["UNIT"],
					unitRateInFC: data[i]["UNIT RATE IN FC"],
					currency: data[i]["CURRENCY"],
					unitValueInINR: data[i]["UNIT VALUE IN INR"],
					totalValueFC: data[i]["TOTAL VALUE FC"],
					totalFOBValueInINR: data[i]["TOTAL FOB VALUE IN INR"],
					totalDutyPaid: data[i]["TOTAL DUTY PAID"],
					chaName: data[i]["CHA NAME"],
					invoiceNo: data[i]["INVOICE NO"],
					portOfDischarge: data[i]["PORT OF DISCHARGE"],

					// ✅ Importer columns
					importer: data[i]["IMPORTER"],
					importerAddress: data[i]["IMPORTER ADDRESS"],
					importerCityState: data[i]["IMPORTER CITY STATE"],
					importerPinCode: data[i]["IMPORTER PIN"],
					importerPhone: data[i]["IMPORTER PHONE"],
					importerMail: data[i]["IMPORTER MAIL"],
					importerContactPerson1: data[i]["IMPORTER CONTACT PERSON 1"],
					importerContactPerson2: data[i]["IMPORTER CONTACT PERSON 2"],
					importerCountry: data[i]["IMPORTER COUNTRY"],

					// ✅ IEC
					iec: data[i]["IEC"],

					// ✅ Exporter columns
					exporter: data[i]["EXPORTER"],
					exporterCountry: data[i]["EXPORTER COUNTRY"],
					exporterAddress: data[i]["EXPORTER ADDRESS"],
					exporterCityState: data[i]["EXPORTER CITY STATE"],
					exporterPinCode: data[i]["EXPORTER PIN"],
					exporterPhone: data[i]["EXPORTER PHONE"],
					exporterMail: data[i]["EXPORTER MAIL"],
					exporterContactPerson1: data[i]["EXPORTER CONTACT PERSON 1"],
					exporterContactPerson2: data[i]["EXPORTER CONTACT PERSON 2"],

					// ✅ Other fields
					iecDateOfEstablishment: data[i]["IEC DATE OF ESTABLISHMENT"],
					iecPan: data[i]["IEC PAN"],
					chapter: data[i]["CHAPTER"],

					// audit
					createdon: new Date(),
					createdby: userId,
				});
			}

			const result = await ProductMaster.insertMany(newData);
			return result;
		} catch (error: any) {
			logger.info(error.message);
			return error;
		}
	}

	// Store synonym data from pub chem json to mongoose collectio of table 
	public async storeSynonymData(req: RequestModel): Promise<SynonymBunchSchemaModelDTO> {
		const dto: SynonymBunchSchemaModelDTO = new SynonymBunchSchemaModelDTO(
			CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)

		)



		const filePath = path.join(__dirname, "../../PubChem_compound.json");
		const BATCH_SIZE = 500;

		try {

			const rawData = await fs.promises.readFile(filePath, "utf-8");
			const jsonData = JSON.parse(rawData);
			// Take only first 500 records
			// Extract only required fields
			const dataToAdd = jsonData.map((item: any) => ({
				compoundId: item.cid,
				mainName: item.cmpdname,
				synonyms: item.cmpdsynonym,
			}));

			// Insert in batches
			for (let i = 0; i < dataToAdd.length; i += BATCH_SIZE) {
				const batch = dataToAdd.slice(i, i + BATCH_SIZE);
				await SynonymBunch.insertMany(batch, { ordered: false });
				console.log(`Inserted batch ${i / BATCH_SIZE + 1}`);
				dto.data = { total: dataToAdd.length };
			}

			// await SynonymBunch.insertMany(dataToAdd, { ordered: false });
			dto.data = dataToAdd;
			return dto;
		} catch (error: any) {
			logger.info(error.message);
			dto.data = [];
			dto.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
			return dto;
		}
	}

	public async getGraphData(req: RequestModel): Promise<ProductMasterModelDTO> {
		const graphData: ProductMasterModelDTO = new ProductMasterModelDTO(CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS));

		let filter: any = {};
		let synonymSearches: string[] = [];

		try {


			if (req?.data?.simpleSearch) {
				filter[req?.data?.simpleSearch?.key] = { $regex: req?.data?.simpleSearch?.value, $options: "i" }; // Equivalent to LIKE '%searchText%'
			} else if (req?.data?.casNumberFilter) {
				filter["itemDescription"] = { $regex: req?.data?.casNumberFilter, $options: "i" }; // Equivalent to LIKE '%searchText%'
			} else if (req?.data?.advanceFilters && req?.data?.advanceFilters.length > 0) {
				const advancedFilter = await buildAdvancedFilter(req.data.advanceFilters);
				if (advancedFilter) {
					filter = { ...filter, ...advancedFilter };
				}
			} else if (req?.data?.synonymSearch) {
				const fil = await SynonymBunch.findOne({
					synonyms: { $regex: req.data.synonymSearch, $options: "i" },
				}).select("synonyms -_id"); // only return synonyms field, exclude _id

				if (fil) {
					synonymSearches = fil.synonyms;
				}
			}


			if (req.data.monthYear) {
				if (req.data.monthYear.includes("-")) {
					let [mon, yr] = req.data.monthYear.split("-").map((x: string) => x.trim());

					let monthNumber = parseInt(mon, 10);  // e.g. 1 → January
					let yearNumber = parseInt(yr, 10);    // e.g. 2025

					if (!isNaN(monthNumber) && !isNaN(yearNumber)) {
						filter["month"] = monthNumber;
						filter["year"] = yearNumber;
					}
				} else {
					filter["year"] = req.data.monthYear;
				}
			}



			function escapeRegex(str: string): string {
				return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
			}

			if (synonymSearches.length > 0) {
				filter["$or"] = synonymSearches.map(syn => ({
					itemDescription: { $regex: escapeRegex(syn), $options: "i" }
				}));
			}



			// ✅ Exact matching for tableFilter
			if (req?.data?.tableFilter && req.data.tableFilter.length > 0) {
				for (const tf of req.data.tableFilter) {
					if (tf.field && tf.value !== undefined && tf.value !== null) {
						filter[tf.field] = tf.value;
					}
				}
			}

			if (req.data.searchText) {
				filter["$or"] = [
					{ itemDescription: { $regex: req.data.searchText, $options: "i" } },
					{ importer: { $regex: req.data.searchText, $options: "i" } },
					{ importerCountry: { $regex: req.data.searchText, $options: "i" } },
					{ exporter: { $regex: req.data.searchText, $options: "i" } },
					{ exporterCountry: { $regex: req.data.searchText, $options: "i" } },
				];
			}

			// Advance Search

			// console.log("filter 2.0  ", JSON.stringify(filter, null, 2));

			// const productList = await ProductMaster.find(filter);


			// 🔹 Aggregation for Top Importer Countries
			const topImporterCountries = await ProductMaster.aggregate([
				{ $match: filter },
				{ $group: { _id: "$importerCountry", count: { $sum: 1 } } },
				{ $sort: { count: -1 } },
				{ $limit: 5 },
				{ $project: { _id: 0, importerCountry: "$_id", count: 1 } }  // ✅ Rename _id → importerCountry
			]);

			// 🔹 Aggregation for Top Exporter Countries
			const topExporterCountries = await ProductMaster.aggregate([
				{ $match: filter },
				{ $group: { _id: "$exporterCountry", count: { $sum: 1 } } },
				{ $sort: { count: -1 } },
				{ $limit: 5 },
				{ $project: { _id: 0, exporterCountry: "$_id", count: 1 } }  // ✅ Rename _id → exporterCountry
			]);

			// 🔹 Top Buyers (Importers)
			const topBuyers = await ProductMaster.aggregate([
				{ $match: filter },
				{ $group: { _id: "$importer", count: { $sum: 1 } } },
				{ $sort: { count: -1 } },
				{ $limit: 5 },
				{ $project: { _id: 0, buyer: "$_id", count: 1 } } // ✅ Rename _id → buyer
			]);

			// 🔹 Top Suppliers (Exporters)
			const topSuppliers = await ProductMaster.aggregate([
				{ $match: filter },
				{ $group: { _id: "$exporter", count: { $sum: 1 } } },
				{ $sort: { count: -1 } },
				{ $limit: 5 },
				{ $project: { _id: 0, supplier: "$_id", count: 1 } } // ✅ Rename _id → supplier
			]);

			// 🔹 Average Unit Price Analysis Per Year
			const avgPricePerYear = await ProductMaster.aggregate([
				{ $match: filter }, // apply all filters you already built
				{
					$group: {
						_id: "$year",
						avgUnitRateInFC: { $avg: "$unitRateInFC" }, // ✅ average calculation
						count: { $sum: 1 } // optional: number of records for context
					}
				},
				{ $sort: { _id: 1 } }, // sort by year ascending
				{
					$project: {
						_id: 0,
						year: "$_id",
						avgUnitRateInFC: { $round: ["$avgUnitRateInFC", 2] }, // round to 2 decimals
						count: 1
					}
				}
			]);

			// 🔹 Average Volume (unitValueInINR) Per Year
			const avgVolumePerYear = await ProductMaster.aggregate([
				{ $match: filter }, // apply filters
				{
					$group: {
						_id: "$year",
						avgUnitValueInINR: { $avg: "$unitValueInINR" }, // ✅ calculate average
						count: { $sum: 1 } // number of records contributing
					}
				},
				{ $sort: { _id: 1 } }, // sort by year ascending
				{
					$project: {
						_id: 0,
						year: "$_id",
						avgUnitValueInINR: { $round: ["$avgUnitValueInINR", 2] }, // round to 2 decimals
						count: 1
					}
				}
			]);

			graphData.data = { topExporterCountries, topImporterCountries, topBuyers, topSuppliers, avgPricePerYear, avgVolumePerYear };
			return graphData;
		} catch (error: any) {
			logger.info(`Error scheduling demo email: ${error.message} - ${error.stack} `);
			graphData.data = [];
			graphData.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
			return graphData;
		}
	}

	public async getSearchHistory(req: RequestModel): Promise<SearchHistoryModelDTO> {
		const searchDTO: SearchHistoryModelDTO = new SearchHistoryModelDTO(
			CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
		);

		const filterModel: CommonRequestModel = { ...req.data };
		const offset = (filterModel.currentPage - 1) * filterModel.pageSize;
		const limit = filterModel.pageSize;

		let filter: any = {};

		try {

			console.log("req.data ", req.data, filterModel);
			filterModel.totalRows = await SearchHistory.countDocuments();

			if (filterModel.fromDate && filterModel.toDate) {
				filter.searchedOn = {
					$gte: new Date(filterModel.fromDate),
					$lte: new Date(filterModel.toDate)
				};
			}

			if (filterModel.searchText) {
				filter["$or"] = [
					{ fullName: { $regex: filterModel.searchText, $options: "i" } },
					{ emailId: { $regex: filterModel.searchText, $options: "i" } }
				];
			}
			if (filterModel.searchType) {
				filter.searchType = filterModel.searchType
			}

			// 4️⃣ Run aggregation
			filterModel.filterRowsCount = await SearchHistory.countDocuments();


			const searchHistory = await SearchHistory.find(filter).limit(limit).skip(offset).sort({ searchedOn: -1 });


			searchDTO.filterModel = filterModel;
			searchDTO.data = searchHistory;
			return searchDTO;
		} catch (error: any) {
			logger.info(`Error fetching search history: ${error.message} - ${error.stack} `);
			searchDTO.data = [];
			searchDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
			return searchDTO;
		}


	}

}



export default new ProductManagement();


async function buildAdvancedFilter(filters: any[], searchHistory?: any): Promise<any> {
	if (!filters || filters.length === 0) return {};

	const orGroups: any[] = [];
	let currentAndGroup: any[] = [];
	let searchArray: any = [];
	for (let i = 0; i < filters.length; i++) {
		const f = filters[i];

		let condition: any = {};

		searchArray.push({
			field: f.field,
			value: f.value
		})

		// Use regex for strings, exact match for numbers
		if (typeof f.value == "string") {
			condition[f.field] = { $regex: f.value, $options: "i" };
		} else if (typeof f.value == "number") {
			condition[f.field] = f.value; // exact match
		}

		currentAndGroup.push(condition);

		// Close current AND group if logic is OR or last item
		if (f.logic === "OR" || i === filters.length - 1) {
			if (currentAndGroup.length === 1) {
				orGroups.push(currentAndGroup[0]);
			} else {
				orGroups.push({ $and: currentAndGroup });
			}
			currentAndGroup = [];
		}
	}

	searchHistory.searchKeywords = searchArray;
	if (orGroups.length === 1) return orGroups[0];
	if (orGroups.length > 1) return { $or: orGroups };
	return {};
}

