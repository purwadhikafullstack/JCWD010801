const userControllers = require("./userControllers");
const adminControllers = require("./adminControllers");
const productControllers = require("./productControllers");
const categoryControllers = require("./categoryControllers");
const addressControllers = require("./addressControllers");
const cartControllers = require("./cartControllers");
const orderControllers = require("./orderControllers");
const reportControllers = require("./reportControllers");
const productReportControllers = require("./productReportControllers");
const branchControllers = require("./branchControllers");

module.exports = {
	userControllers,
	adminControllers,
	productControllers,
	categoryControllers,
	addressControllers,
	cartControllers,
	orderControllers,
	reportControllers,
	productReportControllers,
	branchControllers
};
