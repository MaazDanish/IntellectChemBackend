import axios from "axios";
import logger from "../logger";
import * as cheerio from "cheerio";
import CommonUtils from "../utils/common";
import { eReturnCodes } from "../enums/commonEnums";
import RequestModel from "../models/common/requestModel";
import { CommonModelDTO } from "../models/productMaster";
import ChemicalCompound from "../models/chemicalCompound";


class ReadDataFromWebService {
    public async extractDataFromChemSrc(req: RequestModel): Promise<CommonModelDTO> {
        const dto: CommonModelDTO = new CommonModelDTO(CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS));

        const extractedData: any = [];


        try {

            // for (var i = 1; i < 5; i++) {

            //     const url = `https://www.chemsrc.com/en/casindex/${i}.html`;
            //     console.log(url, "0-0-0-0-");


            //     const response: any = await axios.get('https://www.chemsrc.com/en/casindex/3.html', {
            //         headers: {
            //             "Content-Type": "application/json",
            //         },
            //     });

            //     if ((!response) || (!response.data) || (response.status !== 200)) {
            //         dto.data = [];
            //         dto.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_NOT_FOUND);
            //         return dto;
            //     }

            //     const html = response.data;
            //     const $ = cheerio.load(html);

            //     $('tr.rowDat').each((index, element) => {

            //         const name = $(element).find('td:nth-child(1) a').text().replace(/\s+/g, ' ').trim();
            //         const molecularFormula = $(element).find('td:nth-child(2)').text().replace(/\s+/g, ' ').trim();
            //         const properties = $(element).find('td:nth-child(3)').text().replace(/\s+/g, ' ').trim();
            //         const casNumber = $(element).find('td:nth-child(4) a').text().replace(/\s+/g, ' ').trim();

            //         extractedData.push({ name, molecularFormula, properties, casNumber });
            //     });
            // }

            for (let i = 1; i < 5; i++) {
                try {
                    const response = await axios.get(`https://www.chemsrc.com/casindex/${i}.html`, {
                        headers: { "Content-Type": "application/json" },
                    });

                    if (!response?.data || response.status !== 200) {
                        logger.warn(`Page ${i} not found or invalid response.`);
                        continue; // Skip this page instead of returning early
                    }

                    const html = response.data;
                    const $ = cheerio.load(html as string);

                    $('tr.rowDat').each((index: any, element: any) => {
                        const name = $(element).find('td:nth-child(1) a').text().trim();
                        const molecularFormula = $(element).find('td:nth-child(2)').text().trim();
                        const properties = $(element).find('td:nth-child(3)').text().trim();
                        const casNumber = $(element).find('td:nth-child(4) a').text().trim();

                        extractedData.push({ name, molecularFormula, properties, casNumber });
                    });

                    // Optional delay to prevent rate limiting
                    await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
                } catch (pageError) {
                    logger.error(`Error fetching page ${i}:`, pageError);
                }
            }

            // if (extractedData.length > 0) {
            //     await ChemicalCompound.insertMany(extractedData, { ordered: false }); 
            // } else {
            //     logger.warn("No data extracted from ChemSrc.");
            // }

            dto.data = { count: extractedData.length, extractedData };
            return dto;
        } catch (error: any) {
            logger.info(error);
            dto.data = [];
            dto.dataResponse = CommonUtils.getDataResponse(eReturnCodes.R_DB_ERROR);
            return dto;
        }

    }
}


export default new ReadDataFromWebService();