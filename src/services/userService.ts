import dotenv from "dotenv";
import logger from "../logger";
import jwt from "jsonwebtoken";
import CommonUtils from "../utils/common";
import EncryptUtils from "../utils/encrypt";
import { eReturnCodes } from "../enums/commonEnums";
import RequestModel from "../models/common/requestModel";
import UserPrivilegesMapping from "../models/userPrivilegesMapping";
import UserMaster, { UserMasterModelDTO } from "../models/userMaster";
import { CommonModelDTO } from "../models/productMaster";
import UsersUsage from "../models/userUsageModel";

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
		let userId = 0;

		try {

			console.log(id, userData, "====");
			let user;

			if (!id) {
				// Create new user
				user = await UserMaster.create(userData);
				userId = user.id
			} else {
				// Update existing user
				user = await UserMaster.findByIdAndUpdate(
					id,
					userData,
					{
						new: true,
						runValidators: true
					}
				).lean();

				if (!user) {
					userDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_NOT_FOUND);
					userDTO.data = null;
					return userDTO;
				}

				await UserPrivilegesMapping.deleteMany({
					userId: id
				})

				userId = id

			}

			if (privilegesIds.length) {
				privilegesIds.map((privilege: any) => ({
					userId: userId,
					privilegeId: privilege,
					createdBy: req.auth_token.userId,
				}));
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

	public async editUserUsage(req: RequestModel): Promise<CommonModelDTO> {
		const commonDTO: CommonModelDTO = new CommonModelDTO(
			CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
		);

		const { userId, ...updateData } = req.data;

		try {

			const updatedUserUsage = await UsersUsage.findOneAndUpdate(
				{ userId: userId },
				updateData,
				{ new: true }
			);


			commonDTO.data = updatedUserUsage;
			return Promise.resolve(commonDTO);
		} catch (error: any) {
			logger.error(`Error occurred in editUserUsage API in UserService: ${error.message}`);
			commonDTO.data = null;
			commonDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
			return Promise.resolve(commonDTO);
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

		const filter: any = {};

		try {

			if (req?.data?.searchText) {
				const regex = { $regex: req.data.searchText, $options: 'i' };
				filter.$or = [
					{ fullName: regex },
					{ mobileNumber: regex }
				];
			}

			// Find all the users in the system
			const userList = await UserMaster.find(filter);

			if (!userList) {
				userDTO.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_NOT_FOUND);
				userDTO.data = null;
				return userDTO;
			}



			userDTO.data = userList;
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

			// Return the user data
			userDTO.data = specifcUser;
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

			const data: any = {
				// Prepare the data for JWT token
				userId: isUser._id,
				emailId: isUser.emailId,
				mobileNumber: isUser.mobileNumber,
			};

			const token = jwt.sign(data, process.env.JWT_SECRET_KEY!, { expiresIn: "5h", });

			// Return the user ID and JWT token
			userDTO.data = { id: isUser._id, token };
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