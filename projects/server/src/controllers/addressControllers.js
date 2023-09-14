const db = require("../models");
const addresses = db.Addresses;
const { Op } = require("sequelize");
const Axios = require("axios");
module.exports = {
	city: async (req, res) => {
		try {
			const result = await Axios.get("https://api.rajaongkir.com/starter/city", {
				headers: { key: process.env.KEY_RAJAONGKIR },
			});
			const data = result.data;
			res.status(200).send({
				status: true,
				data,
			});
		} catch (error) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	province: async (req, res) => {
		try {
			const result = await Axios.get("https://api.rajaongkir.com/starter/province", {
				headers: { key: process.env.KEY_RAJAONGKIR },
			});
			const data = result.data;
			res.status(200).send({
				status: true,
				data,
			});
		} catch (error) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	addAddress: async (req, res) => {
		try {
			const { address, city, province, city_id, province_id, label, postal_code, subdistrict, type } = req.body;
			const queryAddress = `${address}, ${type} ${city}, ${province}, Indonesia`;
			const response = await Axios.get(
				`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(queryAddress)}&key=${process.env.KEY_OPENCAGE}`
			);
			if (response.status === 200 && response.data.results.length > 0) {
				const isMainExist = await addresses.findOne({ where: { UserId: req.user.id, isMain: true } });
				const { lat, lng } = response.data.results[0].geometry;
				if (!isMainExist) {
					const result = await addresses.create({
						label,
						address,
						city,
						province,
						postal_code,
						subdistrict,
						lat,
						lng,
						city_id,
						province_id,
						isDeleted: false,
						isMain: true,
						UserId: req.user.id,
					});
					res.status(200).send({
						status: true,
						message: "Add new address success",
						result,
					});
				} else {
					const result = await addresses.create({
						label,
						address,
						city,
						province,
						postal_code,
						subdistrict,
						lat,
						lng,
						city_id,
						province_id,
						isDeleted: false,
						isMain: false,
						UserId: req.user.id,
					});
					res.status(200).send({
						status: true,
						message: "Add new address success",
						result,
					});
				}
			} else {
				res.status(500).send({
					status: 500,
					message: "Internal server error",
				});
			}
		} catch (error) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	deleteAddress: async (req, res) => {
		try {
			const id = req.params.id;
			const result = await addresses.update({ isDeleted: true }, { where: { id, UserId: req.user.id } });
			res.status(200).send({
				status: true,
				result,
				message: "Delete address success",
			});
		} catch (error) {
			res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	updateAddress: async (req, res) => {
		try {
			const id = req.params.id;
			const { address, city, province, city_id, province_id, postal_code, subdistrict, type } = req.body;
			const queryAddress = `${address}, ${type} ${city}, ${province}, Indonesia`;
			const response = await Axios.get(
				`https://api.opencagedata.com/geocode/v1/json?q=${queryAddress}&key=${process.env.KEY_OPENCAGE}`
			);
			if (response.status === 200 && response.data.results.length > 0) {
				const { lat, lng } = response.data.results[0].geometry;
				const result = await addresses.update(
					{
						address,
						city,
						province,
						postal_code,
						subdistrict,
						lat,
						lng,
						city_id,
						province_id,
					},
					{ where: { id, UserId: req.user.id } }
				);
				res.status(200).send({
					status: true,
					message: "Your address has been updated",
					result,
				});
			} else {
				res.status(500).send({
					status: 500,
					message: "Internal server error",
				});
			}
		} catch (error) {
			console.log(error);
			res.status(500).send({
				error,
				status: 500,
				message: "Internal server error",
			});
		}
	},
	mainAddress: async (req, res) => {
		try {
			const id = req.params.id;
			const isMainExist = await addresses.findOne({ where: { isMain: true, UserId: req.user.id } });
			if (isMainExist) {
				await addresses.update(
					{
						isMain: false,
					},
					{
						where: {
							UserId: req.user.id,
						},
					}
				);
				const result = await addresses.update(
					{
						isMain: true,
					},
					{
						where: {
							id,
							UserId: req.user.id,
						},
					}
				);
				res.status(200).send({
					message: "Set to main address success",
					result,
				});
			}
		} catch (error) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	address: async (req, res) => {
		try {
			const page = +req.query.page || 1;
			const limit = +req.query.limit || 4;
			const search = req.query.search;
			const sort = req.query.sort || "DESC";
			const condition = { isDeleted: false, UserId: req.user.id };
			const offset = (page - 1) * limit;
			if (search) {
				condition[Op.or] = [
					{
						address: {
							[Op.like]: `%${search}%`,
						},
					},
					{
						city: {
							[Op.like]: `%${search}%`,
						},
					},
					{
						province: {
							[Op.like]: `%${search}%`,
						},
					},
				];
			}
			const total = await addresses.count({ where: condition });
			result = await addresses.findAll({
				where: condition,
				order: [["createdAt", sort]],
				limit,
				offset: offset,
			});
			res.status(200).send({
				totalPage: Math.ceil(total / limit),
				currentpage: page,
				total_addresses: total,
				result,
			});
		} catch (error) {
			return res.status(500).send({
				error,
				status: 500,
				message: "Internal server error.",
			});
		}
	},
};
