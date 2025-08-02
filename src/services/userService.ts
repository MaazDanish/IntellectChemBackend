import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import logger from "../logger";
import CommonUtils from "../utils/common";
import EncryptUtils from "../utils/encrypt";
import UsersUsage from "../models/userUsageModel";
import { eReturnCodes } from "../enums/commonEnums";
import { TAuthorizationModel } from "../types/common";
import RequestModel from "../models/common/requestModel";
import { CommonModelDTO } from "../models/productMaster";
import { PrivilegesMaster } from "../models/privilegesMaster";
import UserPrivilegesMapping from "../models/userPrivilegesMapping";
import CommonRequestModel from "../models/common/commonRequestModel";
import UserMaster, { UserMasterModelDTO } from "../models/userMaster";

dotenv.config();

class UserManagement {

	/**
	 * @description This method returns a list of all users in the system.
	 * @param req - The request object containing the data to be processed.
	 * @returns A UserMasterModelDTO object containing a list of users and a response status code.
	 */
	public async addEditUser(req: RequestModel): Promise<UserMasterModelDTO> {
		const userDTO: UserMasterModelDTO = new UserMasterModelDTO(
			CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
		);

		const { id, privilegesIds, ...userData } = req.data;
		let userId: number;
		let user: any;

		try {
			if (!id) {
				// Create new user
				user = await UserMaster.create(userData);
				userId = user.id;
			} else {
				// Update existing user
				user = await UserMaster.findByIdAndUpdate(
					id,
					userData,
					{
						new: true,
						runValidators: true
					}
				);

				if (!user) {
					userDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_NOT_FOUND);
					userDTO.data = null;
					return userDTO;
				}

				userId = id;
			}

			if (req.data.isAdmin === 1) {
				if (privilegesIds?.length) {
					await UserPrivilegesMapping.deleteMany({ userId });

					const bulkData = privilegesIds.map((privilegeId: any) => ({
						userId,
						privilegeId,
						createdBy: req.auth_token.userId,
					}));

					await UserPrivilegesMapping.insertMany(bulkData);
				}
			} else {
				// isAdmin === 0
				const usagePayload = {
					userId,
					createdBy: req.auth_token.userId,
					isActive: 1,
					totalSearch: req.data.totalSearch || 15,
					remainingSearch: req.data.totalSearch || 15,
					usedSearch: req.data.usedSearch || 0,
					totalPages: req.data.totalPages || 5,
					totalRowsToDownload: req.data.totalRowsToDownload || 100,
					createdOn: new Date(),
				};

				if (!id) {
					await UsersUsage.create(usagePayload);
				} else {
					await UsersUsage.findOneAndUpdate(
						{ userId, isActive: 1 },
						{ $set: usagePayload },
						{ new: true, upsert: true }
					);
				}
			}

			userDTO.data = user;
			return userDTO;
		} catch (error: any) {
			logger.info(error.message);
			userDTO.data = [];
			userDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
			return userDTO;
		}
	}


	/**
	 * @description This method returns a list of all users in the system.
	 * @param req - The request object containing the data to be processed.
	 * @returns A UserMasterModelDTO object containing a list of users and a response status code.
	 */
	public async getUsers(req: RequestModel): Promise<UserMasterModelDTO> {
		const userDTO: UserMasterModelDTO = new UserMasterModelDTO(
			CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
		)

		const filterModel: CommonRequestModel = { ...req.data };
		const offset = (filterModel.currentPage - 1) * filterModel.pageSize;
		const limit = filterModel.pageSize;
		const filter: any = {};

		try {

			if (filterModel.searchText) {
				const regex = { $regex: filterModel.searchText, $options: 'i' };
				filter.$or = [
					{ fullName: regex },
					{ mobileNumber: regex },
					{ companyName: regex },
				];
			}

			if (filterModel.isAdmin == 1) {
				filter.isAdmin = 1;
			}

			if (filterModel.isAdmin == 0) {
				filter.isAdmin = 0;
			}

			if (filterModel.companyName) {
				const regex = { $regex: filterModel.companyName, $options: 'i' };
				filter.companyName = regex;
			}


			const userList = await UserMaster.find(filter)
				.skip(offset)
				.limit(limit);

			const totalCount = await UserMaster.countDocuments(filter);

			if (!userList || userList.length === 0) {
				userDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_NOT_FOUND);
				userDTO.data = null;
				return userDTO;
			}



			userDTO.data = userList;
			filterModel.totalRows = totalCount;
			filterModel.filterRowsCount = userList.length;
			userDTO.filterModel = filterModel;
			return userDTO;
		} catch (error: any) {
			logger.info(`Error Occured in getUsers API in userservice ${error.message}`);
			userDTO.data = [];
			userDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
			return userDTO;
		}
	}


	public async editUserDetails(req: RequestModel): Promise<UserMasterModelDTO> {
		const userDTO: UserMasterModelDTO = new UserMasterModelDTO(
			CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
		);

		const { id, ...updateData } = req.data;

		try {
			if (!id) {
				userDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_INVALID_REQUEST);
				userDTO.data = null;
				return userDTO;
			}

			// Optional: sanitize fields here before updating, e.g. delete updateData.password if not allowed
			// const allowedFields = ['name', 'email', 'phone']; // etc.
			// const updateData = _.pick(req.data, allowedFields);

			const updatedUser = await UserMaster.findByIdAndUpdate(id, updateData, {
				new: true,
				runValidators: true // Ensures validation rules in schema are applied
			}).lean(); // `lean()` returns a plain object

			if (!updatedUser) {
				userDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_NOT_FOUND);
				userDTO.data = null;
				return userDTO;
			}

			userDTO.data = updatedUser;
			return userDTO;
		} catch (error: any) {
			logger.error(`Error occurred in editUserDetails API in UserService: ${error.message}`);
			userDTO.data = null;
			userDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
			return userDTO;
		}
	}




	/**
	 * @description This method returns a specific user based on the id in the request body.
	 * @param req - The request object containing the id of the user to be retrieved.
	 * @returns A UserMasterModelDTO object containing the user data and a response status code.
	 * @throws {Error} If the user is not found, an error is thrown with a 404 status code.
	 * @throws {Error} If a database error occurs, an error is thrown with a 500 status code.
	 */
	public async getSpecificUser(req: RequestModel): Promise<UserMasterModelDTO> {
		const userDTO: UserMasterModelDTO = new UserMasterModelDTO(
			CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
		)

		const id = req?.data?.id ? req?.data?.id : req?.auth_token?.userId;

		try {

			// Find the user with the given id
			const specifcUser = await UserMaster.findById(id);


			// Check if the user is found
			if (!specifcUser) {
				userDTO.data = [];
				userDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_NOT_FOUND);
				return userDTO;
			}


			if (specifcUser.isAdmin == 1) {
				const privileges = await UserPrivilegesMapping.find(
					{ userId: id },
					'privilegeId -_id' // exclude _id field
				);

				const privilegeIds = privileges.map(p => p.privilegeId);

				const privilegsData = await PrivilegesMaster.find(
					{ _id: { $in: privilegeIds } },
					'name privilegeUniqueId -_id' // projection string (include name & privilegeUniqueId, exclude _id)
				);

				userDTO.data = { specifcUser, privilegsData };

			} else {

				const userUsageData = await UsersUsage.findOne({ userId: id, isActive: 1 });
				userDTO.data = { specifcUser, userUsageData };
			}

			// Return the user data
			return userDTO;
		} catch (error: any) {
			logger.info(error.message);
			userDTO.data = [];
			userDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
			return userDTO;
		}
	}


	/**
	 * @description This method signs up a new user.
	 * @param req - The request object containing the user data.
	 * @returns A UserMasterModelDTO object containing the newly created user data and a response status code.
	 * @throws {Error} If a database error occurs, an error is thrown with a 500 status code.
	 */
	public async signUP(req: RequestModel): Promise<UserMasterModelDTO> {
		const userDTO: UserMasterModelDTO = new UserMasterModelDTO(
			CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
		)

		const { ...data } = req?.data

		try {

			// Create a new user document
			const newUser = await UserMaster.create(data);

			const usagePayload = {
				userId: newUser._id,
				createdBy: newUser._id,
				isActive: 1,
				totalSearch: req.data.totalSearch || 15,
				remainingSearch: req.data.totalSearch || 15,
				usedSearch: req.data.usedSearch || 0,
				totalPages: req.data.totalPages || 5,
				totalRowsToDownload: req.data.totalRowsToDownload || 100,
				createdOn: new Date(),
			};

			await UsersUsage.create(usagePayload);

			// Send a sign up email to the user
			const emailPurpose: any = {
				receiverEmail: req.data.emailId,
				password: req.data.password,
				emailPurpose: "SignIn",
			};

			// Initialize the email
			CommonUtils.initializeEmail(emailPurpose);

			// Return the newly created user data

			userDTO.data = newUser;
			return userDTO;
		} catch (error: any) {
			logger.info(error.message);
			userDTO.data = [];
			userDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
			return userDTO;
		}
	}



	/**
	 * @description Authenticates a user and returns a JWT token if successful.
	 * @param req - The request object containing the user's email and password.
	 * @returns A UserMasterModelDTO object containing the user ID and JWT token, or an error response.
	 * @throws {Error} If a database error occurs, an error is thrown with a 500 status code.
	 */
	public async signIN(req: RequestModel): Promise<UserMasterModelDTO> {
		const userDTO: UserMasterModelDTO = new UserMasterModelDTO(
			CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
		);


		try {

			const isUser = await UserMaster.findOne({
				emailId: req?.data?.emailId,
				password: req?.data?.password
			});

			// If user is not found, return an authentication failed response
			if (!isUser) {
				userDTO.data = [];
				userDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_AUTHENTICATION_FAILED);
				return userDTO;
			}

			const data: TAuthorizationModel = {
				// Prepare the data for JWT token
				userId: isUser._id as number,
				emailId: isUser.emailId,
				mobileNumber: isUser.mobileNumber,
				isAdmin: isUser.isAdmin
			};

			const token = jwt.sign(data, process.env.JWT_SECRET_KEY!, { expiresIn: "5h", });

			// Return the user ID and JWT token
			userDTO.data = { id: isUser._id, isAdmin: isUser.isAdmin, token };
			return userDTO;
		} catch (error: any) {
			logger.info(error.message);
			// Log the error and return a database error response
			userDTO.data = [];
			userDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
			return userDTO;
		}
	}

}

export default new UserManagement();