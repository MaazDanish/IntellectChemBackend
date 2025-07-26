import fs from "fs";
import cors from "cors";
import express from "express";
import routes from "./routes/routes.js";
import session from "express-session";
import swaggerUi from "swagger-ui-express";
const swaggerFile = JSON.parse(fs.readFileSync('./dist/swagger-output.json', 'utf-8')); 
import { connectToMongoDB } from './database/db.js';

const app = express();
connectToMongoDB();

// Use the cors middleware
// const corsOptions = {
//     origin: ['http://localhost:5174', '*'], // Allow localhost:5174 and all other origins
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true // This allows cookies to be sent with CORS requests
// };

// Use the cors middleware with the configured options
// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/api", routes);
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));


export default app;
