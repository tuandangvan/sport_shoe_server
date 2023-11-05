const express = require("express");
const contactRouter = express.Router();
const sendContact = require("../controllers/ContactController");

contactRouter.post("/", sendContact);
module.exports = contactRouter;
