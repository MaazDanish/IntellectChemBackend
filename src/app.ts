import fs from "fs";
import cors from "cors";
import express from "express";
import routes from "./routes/routes";
import session from "express-session";
import swaggerUi from "swagger-ui-express";
import { connectToMongoDB } from './database/db';
const swaggerFile = require("./swagger-output.json");

const app = express();

connectToMongoDB();

app.use(cors());
app.use(express.json());

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/api", routes);

app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));


export default app;
