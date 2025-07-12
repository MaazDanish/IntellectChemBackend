// import { Op } from "sequelize";
// import logger from "../logger";
// import CommonUtils from "../utils/common";
// import { eReturnCodes } from "../enums/commonEnums";
// import RequestModel from "../models/common/requestModel";


// class RoleManagement {
//   /**
//    * Retrieves the list of roles based on the provided request data.
//    * Supports pagination and search functionality.
//    * @param {RequestModel} req - Request data containing pagination and search parameters.
//    * @returns {Promise<RoleMasterModelDTO>} - A promise resolving to a RoleMasterModelDTO containing the list of roles.
//    */
//   public async getRoleList(req: RequestModel): Promise<RoleMasterModelDTO> {
//     // Initialize RoleMasterModelDTO with a success response
//     const roleDTO: RoleMasterModelDTO = new RoleMasterModelDTO(
//       CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
//     );

//     // Initialize filter model from request data
//     const filterModel: CommonRequestModel = { ...req.data };
//     const offset = (filterModel.currentPage - 1) * filterModel.pageSize;
//     const limit = filterModel.pageSize;

//     try {
//       // Get total count of roles
//       filterModel.totalRows = await RoleMaster.count();

//       let roles;
//       if (filterModel.pageSize < 0) {
//         roles = await RoleMaster.findAndCountAll({
//           where: { isDeleted: 0 },
//         });
//       } else {
//         roles = filterModel.searchText
//           ? // Fetch roles based on search text if provided
//           await RoleMaster.findAndCountAll({
//             where: {
//               [Op.or]: {
//                 name: {
//                   [Op.like]: filterModel.searchText + "%",
//                 },
//                 description: {
//                   [Op.like]: filterModel.searchText + "%",
//                 },
//                 isDeleted: 0,
//               },
//             },
//             offset,
//             limit,
//             order: [["id", "DESC"]],
//           })
//           : await RoleMaster.findAndCountAll({
//             where: { isDeleted: 0 },
//             offset,
//             limit,
//             order: [["id", "DESC"]], // Order roles by ID in descending order
//           });
//       }

//       filterModel.filterRowsCount = roles?.rows?.length;
//       // Set filter rows count and roles data in response
//       roleDTO.data = roles.rows;
//       roleDTO.filterModel = filterModel;
//       return roleDTO;
//     } catch (error: any) {
//       logger.info(
//         `Error Occured in roleService : getRoleList API- ${(error as Error).message
//         }`
//       );
//       roleDTO.data = [];
//       roleDTO.dataResponse = CommonUtils.getDataResponse(
//         eReturnCodes.R_DB_ERROR
//       );
//       return roleDTO;
//     }
//   }

//   /**
//    * Add or edit role
//    * @param req RequestModel object containing the role details and its associated privileges
//    * @returns RoleMasterModelDTO containing the role and its associated privileges
//    */
//   public async addEditRole(req: RequestModel): Promise<RoleMasterModelDTO> {
//     const roleDTO: RoleMasterModelDTO = new RoleMasterModelDTO(
//       CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
//     );

//     // Local Variables Declaration
//     const roleId = req.data.id;
//     const rolePrivilegesArray = req.data.rolePrivileges;
//     const t = await sequelize.transaction(); // Transaction started and variable initialized

//     try {
//       // If not roleId CreateNew else UpdateExisting
//       if (!roleId) {
//         // Create a new role
//         const newRole = await RoleMaster.create(
//           {
//             name: req.data.name,
//             roleUniqueId: req.data.roleUniqueId,
//             description: req.data.description,
//             createdBy: req.auth_token.userId,
//           },
//           { transaction: t }
//         );

//         /**
//          * Create new role privileges mapping using the provided rolePrivilegesArray
//          * @param rolePrivilegesArray array of privilege objects with id property
//          * @returns array of newly created role privileges mapping
//          */

//         const newRolePrivilegesMapping = await RolePrivilegesMapping.bulkCreate(
//           rolePrivilegesArray.map((privilege: any) => ({
//             roleId: newRole.id,
//             privilegeId: privilege.id,
//             createdBy: req.auth_token.userId,
//           })),
//           { transaction: t }
//         );
//          //Add audit logs entry
//         configService.addAuditLogs(
//           "New Role " + req?.data?.name + " was added",
//           req.auth_token,
//           "Role"
//         );
//         roleDTO.data = { newRole, newRolePrivilegesMapping };
//       } else if (roleId > 0) {
//         // Retrieve existing role
//         const existingRole = await RoleMaster.findOne({
//           where: {
//             isDeleted: 0,
//             id: roleId,
//           },
//         });

//         if (!existingRole) {
//           roleDTO.data = [];
//           roleDTO.dataResponse = CommonUtils.getDataResponse(
//             eReturnCodes.R_NOT_FOUND
//           );
//           return roleDTO;
//         }

//         // Destroy existing role privileges mapping
//         // Destoye existing role privileges mapping
//         await RolePrivilegesMapping.destroy({
//           where: {
//             isDeleted: 0,
//             roleId: roleId,
//           },
//           transaction: t,
//         });

//         // UpdateRoleMaster
//         const updatedRole = await existingRole.update(
//           {
//             name: req.data.name,
//             roleUniqueId: req.data.roleUniqueId,
//             description: req.data.description,
//             updatedBy: req.auth_token.userId,
//             updatedOn: new Date(),
//           },
//           { transaction: t }
//         );

//         /**
//         const newRolePrivilegesMapping = await RolePrivilegesMapping.bulkCreate(
//          * Create new role privileges mapping using the provided rolePrivilegesArray
//          * @param rolePrivilegesArray array of privilege objects with id property
//          * @returns array of newly created role privileges mapping
//          */
//         const newRolePrivilegesMapping = await RolePrivilegesMapping.bulkCreate(
//           rolePrivilegesArray.map((privilege: any) => ({
//             roleId: roleId,
//             privilegeId: privilege.id,
//             createdBy: req.auth_token.userId,
//           })),
//           { transaction: t }
//         );
//         //Add audit logs entry
//         configService.addAuditLogs(
//           "Details of Role " + existingRole.name + " were edited",
//           req.auth_token,
//           "Role"
//         );
//         // return updated data - RoleMaster & RolePrivilegesMapping
//         roleDTO.data = { updatedRole, newRolePrivilegesMapping };
//       }

//       //Commit the transaction
//       await t.commit();
//       roleDTO.dataResponse = CommonUtils.getDataResponse(
//         eReturnCodes.R_SUCCESS
//       );
//       return roleDTO;
//     } catch (error: any) {
//       // Rollback the transaction
//       roleDTO.data = [];
//       await t.rollback();
//       logger.info(
//         `Error Occured in roleService : addEditRole API- ${(error as Error).message
//         }`
//       );
//       roleDTO.dataResponse = CommonUtils.getDataResponse(
//         eReturnCodes.R_DB_ERROR
//       );
//       return roleDTO;
//     }
//   }

//   /**
//    * Retrieves a specific role by id and its associated privileges
//    * @param req RequestModel object containing the id of the role to be retrieved
//    * @returns RoleMasterModelDTO containing the role and its associated privileges
//    */
//   public async getSpecificRole(req: RequestModel): Promise<RoleMasterModelDTO> {
//     const roleDTO: RoleMasterModelDTO = new RoleMasterModelDTO(
//       CommonUtils.getDataResponse(eReturnCodes.R_SUCCESS)
//     );

//     try {
//       // Retrieve the role and its associated privileges
//       const specificRole: RoleMaster | null = await RoleMaster.findByPk(
//         req?.data?.id,
//         {
//           include: [
//             {
//               model: PrivilegesMaster,
//               as: "rolePrivileges",
//               where: { isDeleted: 0 }, // only include active privileges
//               required: false, // left join
//               through: {
//                 attributes: [], // exclude attributes from the join table
//               },
//             },
//           ],
//         }
//       );
//       if (!specificRole) {
//         roleDTO.data = [];
//         roleDTO.dataResponse = CommonUtils.getDataResponse(
//           eReturnCodes.R_NOT_FOUND
//         );
//         return roleDTO;
//       }

//       // Return the role and its associated privileges
//       roleDTO.data = specificRole;
//       return roleDTO;
//     } catch (error: any) {
//       logger.info(
//         `Error Occured in roleService : getSpecificRole API- ${(error as Error).message
//         }`
//       );
//       roleDTO.dataResponse = CommonUtils.getDataResponse(
//         eReturnCodes.R_DB_ERROR
//       );
//       return roleDTO;
//     }
//   }
// }
// export default new RoleManagement();
