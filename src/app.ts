const cors = require("cors");
import express from "express";
import routes from "./routes/routes";
const session = require("express-session");
const swaggerUi = require("swagger-ui-express");
import { connectToMongoDB } from './database/db';
const swaggerFile = require("./swagger-output.json");

const app = express();
connectToMongoDB();

// Use the cors middleware
const corsOptions = {
    origin: ['http://localhost:5174', '*'], // Allow localhost:5174 and all other origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // This allows cookies to be sent with CORS requests
};

// Use the cors middleware with the configured options
app.use(cors(corsOptions));
app.use(express.json());

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/api", routes);
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));


export default app;
