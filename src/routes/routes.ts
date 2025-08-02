import multer from "multer";
import express from "express";
import authMiddleware from "../middleware/middleware";
import { deleteProductRawsByIds, editProductById, excelUpload, getList, getSpecificRawById } from '../controllers/productController';
import { extractDataFromChemSrc } from "../controllers/autoReadDataController";
import { addEditUser, editUserDetails, getSpecificUser, getUsers, signIN, signUP } from "../controllers/userController";
import UserValidations from "../validations/userValidation";
import { contactUsEmail, getContactUsList, getScheduleDemoList, getSubscriberEmailList, scheduleDemo, subscribeEmail } from "../controllers/emailController";



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const routes = express.Router();



// User routes
routes.post('/getUsersList', authMiddleware, getUsers);
routes.post('/addEditUser', authMiddleware, addEditUser);
routes.post('/signIN', UserValidations.signInValidation, signIN);
routes.post('/signUP', UserValidations.signUpValidation, signUP);
routes.post('/editUserDetails', authMiddleware, editUserDetails);
routes.post('/getSpecificUser', authMiddleware, getSpecificUser);



// product routes
routes.post('/getProductList', authMiddleware, getList);
routes.post('/editProductById', authMiddleware, editProductById);
routes.post('/getSpecificRawById', authMiddleware, getSpecificRawById);
routes.post('/deleteProductRawsByIds', authMiddleware, deleteProductRawsByIds);
routes.post('/uploadProductExcel', upload.single("file"), authMiddleware, excelUpload);


// auto read data 
routes.post('/extractDataFromChemSrc', extractDataFromChemSrc);


routes.post('/scheduleDemo', scheduleDemo);
routes.post('/contactUsEmail', contactUsEmail);
routes.post('/subscribeEmail', subscribeEmail);
routes.post('/getContactUsList', getContactUsList);
routes.post('/getScheduleDemoList', getScheduleDemoList);
routes.post('/getSubscriberEmailList', getSubscriberEmailList);


export default routes;