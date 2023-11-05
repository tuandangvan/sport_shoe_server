import express from "express";
import { contactController } from "~/controllers/contactController";

const route = express.Router();

route.post("/", contactController.sendContact);
export const contactRouter = route;
