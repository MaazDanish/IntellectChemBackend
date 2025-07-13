import logger from "../logger.js";
import CommonUtils from "../utils/common.js";
import sendEmail from "../utils/sendEmail.js";
import { TEmailOptions } from "../types/common.js";
import LeadDetailsModel from "../models/leadDetails.js";
import RequestModel from "../models/common/requestModel.js";
import { CommonModelDTO } from "../models/productMaster.js";
import { eLeadType, eReturnCodes } from "../enums/commonEnums.js";

class EmailServiceManagement {
    public async scheduleDemo(req: RequestModel): Promise<CommonModelDTO> {
        const dto: CommonModelDTO = new CommonModelDTO(
            CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
        );

        const { name, email, phone, date, time, company } = req.data;

        try {


            const newRecord = await LeadDetailsModel.create({
                name: name,
                email: email,
                phone: phone,
                date: date,
                time: time,
                company: company,
                leadType: eLeadType.BOOK_DEMO,
            });


            const emailPurpose: TEmailOptions = {
                name: name,
                email: email,
                phone: phone,
                date: date,
                time: time,
                company: company,
                emailPurpose: "ScheduleDemo",
            };

            CommonUtils.initializeEmail(emailPurpose);

            dto.data = newRecord;
            return dto;
        } catch (error: any) {
            logger.info(`Error scheduling demo email: ${error.message} - ${error.stack} `);
            dto.data = [];
            dto.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
            return dto;
        }
    }

    public async contactUsEmail(req: RequestModel): Promise<CommonModelDTO> {
        const dto: CommonModelDTO = new CommonModelDTO(
            CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
        );

        const { name, email, phone, subject, message } = req.data;

        try {

            const newRecord = await LeadDetailsModel.create({
                name: name,
                email: email,
                phone: phone,
                subject: subject,
                message: message,
                leadType: eLeadType.CONTACT_US,
            });

            const emailPurpose: TEmailOptions = {
                name: name,
                email: email,
                phone: phone,
                subject: subject,
                message: message,
                emailPurpose: "ContactUs",
            };

            CommonUtils.initializeEmail(emailPurpose);

            dto.data = newRecord;
            return dto;
        } catch (error: any) {
            logger.info(`Error scheduling demo email: ${error.message} - ${error.stack} `);
            dto.data = [];
            dto.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
            return dto;
        }
    }

    public async subscribeEmail(req: RequestModel): Promise<CommonModelDTO> {
        const dto: CommonModelDTO = new CommonModelDTO(
            CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
        );

        const { email } = req.data;

        try {

            const newRecord = await LeadDetailsModel.create({
                email: email,
                leadType: eLeadType.SUBSCRIBE,
            });

            const emailPurpose: TEmailOptions = {
                email: email,
                emailPurpose: "Subscribe",
            };

            CommonUtils.initializeEmail(emailPurpose);

            dto.data = newRecord;
            return dto;
        } catch (error: any) {
            logger.info(`Error scheduling demo email: ${error.message} - ${error.stack} `);
            dto.data = [];
            dto.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
            return dto;
        }
    }

    public async getSubscriberEmailList(req: RequestModel): Promise<CommonModelDTO> {
        const dto: CommonModelDTO = new CommonModelDTO(
            CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
        );

        try {

            const newRecord = await LeadDetailsModel.find({
                leadType: eLeadType.SUBSCRIBE,
            }).sort({ createdAt: -1 });


            dto.data = newRecord;
            return dto;
        } catch (error: any) {
            logger.info(`Error scheduling demo email: ${error.message} - ${error.stack} `);
            dto.data = [];
            dto.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
            return dto;
        }
    }
    public async getScheduleDemoList(req: RequestModel): Promise<CommonModelDTO> {
        const dto: CommonModelDTO = new CommonModelDTO(
            CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
        );

        try {

            const newRecord = await LeadDetailsModel.find({
                leadType: eLeadType.BOOK_DEMO,
            }).sort({ createdAt: -1 });


            dto.data = newRecord;
            return dto;
        } catch (error: any) {
            logger.info(`Error scheduling demo email: ${error.message} - ${error.stack} `);
            dto.data = [];
            dto.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
            return dto;
        }
    }
    public async getContactUsList(req: RequestModel): Promise<CommonModelDTO> {
        const dto: CommonModelDTO = new CommonModelDTO(
            CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
        );

        try {

            const newRecord = await LeadDetailsModel.find({
                leadType: eLeadType.CONTACT_US,
            }).sort({ createdAt: -1 });


            dto.data = newRecord;
            return dto;
        } catch (error: any) {
            logger.info(`Error scheduling demo email: ${error.message} - ${error.stack} `);
            dto.data = [];
            dto.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
            return dto;
        }
    }
}


export default new EmailServiceManagement();