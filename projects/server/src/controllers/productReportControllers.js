const db = require("../models");
const categories = db.Categories;
const products = db.Products;
const stocks = db.Stocks;
const stockMovements = db.StockMovements;
const changelogs = db.Changelogs;
const branches = db.Branches;
const { Sequelize, Op } = require("sequelize");

module.exports = {
	getProductReport: async (req, res) => {
		try {
			const {
				productName,
				BranchId = null,
				startDate = null,
				endDate = null,
				UserId = null,
				page = 1,
				itemLimit = 15,
				sortBy = "createdAt",
				sortOrder = "ASC",
			} = req.query;

			if (!productName) {
				return res.status(404).send({
					status: 404,
					message: "Please specify a product name.",
				});
			}

			const product = await products.findOne({
				where: {
					productName: productName,
				},
			});

			if (!product) {
				return res.status(404).send({
					status: 404,
					message: "Product is not found.",
				});
			}

			const filterMovement = {
				ProductId: product.id,
			};

			if (startDate && endDate) {
				filterMovement.createdAt = {
					[Op.between]: [new Date(startDate), new Date(endDate)],
				};
			} else if (startDate || endDate) {
				if (startDate) {
					filterMovement.createdAt = {
						[Op.gte]: new Date(startDate),
					};
				}
				if (endDate) {
					filterMovement.createdAt = {
						[Op.lte]: new Date(endDate),
					};
				}
			}

			if (BranchId) {
				filterMovement.BranchId = BranchId;
			}

			if (UserId) {
				filterMovement.UserId = UserId;
			}

			const offset = (parseInt(page) - 1) * parseInt(itemLimit);

			let sortOption;
			switch (sortBy) {
				case "UserId":
					sortOption = [["UserId", sortOrder]];
					break;
				case "BranchId":
					sortOption = [["BranchId", sortOrder]];
					break;
				case "change":
					sortOption = [["change", sortOrder]];
					break;
				default:
					sortOption = [["createdAt", sortOrder]];
			}

			const movementHistory = await stockMovements.findAll({
				where: filterMovement,
				limit: parseInt(itemLimit),
				offset: offset,
				order: sortOption,
			});

			const totalCount = await stockMovements.count({
				where: filterMovement,
			});

			const totalPages = Math.ceil(totalCount / parseInt(itemLimit));

			res.status(200).send({
				status: 200,
				currentPage: parseInt(page),
				totalPages: totalPages,
				product_details: product,
				movement_history: movementHistory,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
	mostAndLeast: async (req, res) => {
		try {
			const categoriesData = await categories.findAll({
				include: [products],
			});

			const result = categoriesData.map((category) => {
				const productsData = category.Products;

				const sortedProducts = {
					byAggregateStock: productsData.slice().sort((a, b) => b.aggregateStock - a.aggregateStock),
					byLowAggregateStock: productsData.slice().sort((a, b) => a.aggregateStock - b.aggregateStock),
					byViews: productsData.slice().sort((a, b) => b.viewCount - a.viewCount),
					byLowViews: productsData.slice().sort((a, b) => a.viewCount - b.viewCount),
				};

				const categoryProducts = {
					topAggregateStock: sortedProducts.byAggregateStock.slice(0, 3),
					lowAggregateStock: sortedProducts.byLowAggregateStock.slice(0, 3),
					topViews: sortedProducts.byViews.slice(0, 3),
					lowViews: sortedProducts.byLowViews.slice(0, 3),
				};

				return {
					id: category.id,
					category: category.category,
					imgURL: category.imgURL,
					isDeleted: category.isDeleted,
					productCount: productsData.length,
					products: categoryProducts,
				};
			});

			res.status(200).send({
				status: 200,
				result: result,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
	getAllProductsDataInCategories: async (req, res) => {
		try {
			const { sortBy = "aggregateStock", order = "DESC" } = req.query;
			const validSortOptions = ["aggregateStock", "viewCount"];
			const validSortOrders = ["ASC", "DESC"];

			if (!validSortOptions.includes(sortBy) || !validSortOrders.includes(order)) {
				return res.status(400).send({
					status: 400,
					message:
						"Invalid sorting options. Please use 'aggregateStock' or 'viewCount' for 'sortBy' and 'ASC' or 'DESC' for 'order'.",
				});
			}

			const categoriesData = await categories.findAll({
				include: [products],
			});

			const result = categoriesData.map((category) => {
				const productsData = category.Products;

				const sortedProducts = productsData.slice().sort((a, b) => {
					if (order === "ASC") {
						return a[sortBy] - b[sortBy];
					} else {
						return b[sortBy] - a[sortBy];
					}
				});

				return {
					id: category.id,
					category: category.category,
					imgURL: category.imgURL,
					isDeleted: category.isDeleted,
					productCount: productsData.length,
					products: sortedProducts,
				};
			});

			res.status(200).send({
				status: 200,
				result: result,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
	getAverageProductsPerCategory: async (req, res) => {
		try {
			const categoriesData = await categories.findAll({
				include: [products],
			});

			const totalProductCount = categoriesData.reduce((total, category) => total + category.Products.length, 0);

			const averageProductCount = Math.round(totalProductCount / categoriesData.length);

			res.status(200).send({
				status: 200,
				result: averageProductCount,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
	//! DEPLOY V.3.8 DISABLED
	// getAverageProductsPerBranch: async (req, res) => {
	// 	try {
	// 		const branchData = await branches.findAll({
	// 			include: [products],
	// 		});

	// 		const totalProductCount = branchData.reduce((total, branch) => total + branch.Products.length, 0);

	// 		const averageProductCount = Math.round(totalProductCount / branchData.length);

	// 		res.status(200).send({
	// 			status: 200,
	// 			result: averageProductCount,
	// 		});
	// 	} catch (error) {
	// 		return res.status(500).send({
	// 			status: 500,
	// 			message: "Internal server error.",
	// 			error,
	// 		});
	// 	}
	// },
	getAverageProductsPerBranch: async (req, res) => {
		try {
			const productsData = await products.findAll({
				include: [branches],
			});

			const branchProducts = {};

			productsData.forEach((product) => {
				product.Branches.forEach((branch) => {
					const branchName = branch.name;
					if (!branchProducts[branchName]) {
						branchProducts[branchName] = 0;
					}

					branchProducts[branchName]++;
				});
			});

			const branchesToCheck = ["Jakarta", "Bandung", "Jogjakarta", "Surabaya", "Batam"];

			const result = {};

			branchesToCheck.forEach((branchName) => {
				if (branchProducts[branchName] === undefined) {
					result[branchName] = 0;
				} else {
					result[branchName] = branchProducts[branchName];
				}
			});

			const totalProductCount = Object.values(result).reduce((total, count) => total + count, 0);
			const averageProductCount = Math.round(totalProductCount / branchesToCheck.length);

			res.status(200).send({
				status: 200,
				message: "Branch averages fetched successfully",
				average: averageProductCount,
				result: result,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
	getProductStatusCountsByCategory: async (req, res) => {
		try {
			const categoriesData = await categories.findAll({
				include: [products],
			});

			const productCountsByCategory = categoriesData.map((category) => {
				const activeProductsCount = category.Products.filter((product) => product.isActive).length;
				const deactivatedProductsCount = category.Products.filter((product) => !product.isActive).length;
				const deletedProductsCount = category.Products.filter((product) => product.isDeleted).length;
				const totalViewCount = category.Products.reduce((total, product) => {
					return total + product.viewCount;
				}, 0);
				const totalLikeCount = category.Products.reduce((total, product) => {
					return total + product.likeCount;
				}, 0);

				return {
					categoryId: category.id,
					categoryName: category.category,
					activeProductsCount,
					deactivatedProductsCount,
					deletedProductsCount,
					totalViewCount,
					totalLikeCount,
				};
			});

			res.status(200).send({
				status: 200,
				productCountsByCategory,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
	getProductStatusAverages: async (req, res) => {
		try {
			const categoriesData = await categories.findAll({
				include: [products],
			});

			const totalActiveProductCount = categoriesData.reduce((total, category) => {
				return total + category.Products.filter((product) => product.isActive).length;
			}, 0);

			const totalDeactivatedProductCount = categoriesData.reduce((total, category) => {
				return total + category.Products.filter((product) => !product.isActive).length;
			}, 0);

			const totalDeletedProductCount = categoriesData.reduce((total, category) => {
				return total + category.Products.filter((product) => product.isDeleted).length;
			}, 0);
			const totalViewCount = categoriesData.reduce((total, category) => {
				return (
					total +
					category.Products.reduce((categoryTotal, product) => {
						return categoryTotal + product.viewCount;
					}, 0)
				);
			}, 0);
			const totalLikeCount = categoriesData.reduce((total, category) => {
				return (
					total +
					category.Products.reduce((categoryTotal, product) => {
						return categoryTotal + product.likeCount;
					}, 0)
				);
			}, 0);

			const averageActiveProductCount = Math.round(totalActiveProductCount / categoriesData.length);
			const averageDeactivatedProductCount = Math.round(totalDeactivatedProductCount / categoriesData.length);
			const averageDeletedProductCount = Math.round(totalDeletedProductCount / categoriesData.length);
			const averageViewCount = Math.round(totalViewCount / categoriesData.length);
			const averageLikeCount = Math.ceil(totalLikeCount / categoriesData.length);

			res.status(200).send({
				status: 200,
				averageActiveProductCount,
				averageDeactivatedProductCount,
				averageDeletedProductCount,
				averageViewCount,
				averageLikeCount,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
	getProductAggregateStock: async (req, res) => {
		try {
			const { productName } = req.query;

			const product = await products.findOne({
				where: {
					productName: productName,
				},
			});

			if (!productName) {
				return res.status(400).send({
					status: 400,
					message: "Please enter a valid product name.",
				});
			}
			if (!product) {
				return res.status(404).send({
					status: 404,
					message: "Product not found.",
				});
			}

			res.status(200).send({
				status: 200,
				message: "Aggregate stock successfully fetched.",
				aggregateStock: product.aggregateStock,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
	trackAggregateStockChangesByDate: async (req, res) => {
		try {
			const { productName, startDate = null, endDate = null, page = 1, itemLimit = 15, sortOrder = "ASC" } = req.query;

			if (!productName) {
				return res.status(400).send({
					status: 400,
					message: "Please enter a valid product name.",
				});
			}

			const product = await products.findOne({
				where: {
					productName: productName,
				},
			});

			if (!product) {
				return res.status(400).send({
					status: 400,
					message: "No product found with the given ID.",
				});
			}

			const filterMovement = {
				ProductId: product.id,
			};

			const dateFilter = {};

			if (startDate && endDate) {
				dateFilter.createdAt = {
					[Op.between]: [new Date(startDate), new Date(endDate)],
				};
			} else if (startDate || endDate) {
				if (startDate) {
					dateFilter.createdAt = {
						[Op.gte]: new Date(startDate),
					};
				}
				if (endDate) {
					dateFilter.createdAt = {
						[Op.lte]: new Date(endDate),
					};
				}
			}

			const productMovements = await stockMovements.findAll({
				where: {
					...filterMovement,
					...dateFilter,
				},
			});

			if (!productMovements || productMovements.length === 0) {
				return res.status(200).send({
					status: 200,
					message: "No stock movements found within the specified date range.",
					aggregateStockHistory: [],
				});
			}

			let aggregateStock = 0;
			let aggregateStockHistory = {};

			for (const movement of productMovements) {
				const date = movement.createdAt;
				// .toISOString().split("T")[0];
				aggregateStock += movement.change;
				aggregateStockHistory[date] = aggregateStock;
			}

			const startIndex = (parseInt(page) - 1) * parseInt(itemLimit);
			const endIndex = startIndex + parseInt(itemLimit);
			let paginatedAggregateStockHistory = {};

			const keys = Object.keys(aggregateStockHistory);
			if (sortOrder === "ASC") {
				const paginatedKeys = keys.slice(startIndex, endIndex);
				for (const key of paginatedKeys) {
					paginatedAggregateStockHistory[key] = aggregateStockHistory[key];
				}
			} else if (sortOrder === "DESC") {
				const reversedKeys = keys.slice().reverse();
				const paginatedReversedKeys = reversedKeys.slice(startIndex, endIndex);
				for (const key of paginatedReversedKeys) {
					paginatedAggregateStockHistory[key] = aggregateStockHistory[key];
				}
			}

			res.status(200).send({
				status: 200,
				currentPage: parseInt(page),
				itemLimit,
				message: "Aggregate stock history successfully fetched.",
				PID: product.id,
				aggregateStockHistory: paginatedAggregateStockHistory,
			});
		} catch (error) {
			res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
	getChangelogs: async (req, res) => {
		try {
			const {
				productName,
				startDate = null,
				endDate = null,
				UserId = null,
				page = 1,
				itemLimit = 15,
				sortBy = "createdAt",
				sortOrder = "ASC",
			} = req.query;

			if (!productName) {
				return res.status(404).send({
					status: 404,
					message: "Please specify a product name.",
				});
			}

			const product = await products.findOne({
				where: {
					productName: productName,
				},
			});

			if (!product) {
				return res.status(404).send({
					status: 404,
					message: "Product is not found.",
				});
			}

			const filterChange = {
				ProductId: product.id,
			};

			if (startDate && endDate) {
				filterChange.createdAt = {
					[Op.between]: [new Date(startDate), new Date(endDate)],
				};
			} else if (startDate || endDate) {
				if (startDate) {
					filterChange.createdAt = {
						[Op.gte]: new Date(startDate),
					};
				}
				if (endDate) {
					filterChange.createdAt = {
						[Op.lte]: new Date(endDate),
					};
				}
			}

			if (UserId) {
				filterChange.UserId = UserId;
			}

			const offset = (parseInt(page) - 1) * parseInt(itemLimit);

			let sortOption;
			switch (sortBy) {
				case "UserId":
					sortOption = [["UserId", sortOrder]];
					break;
				default:
					sortOption = [["createdAt", sortOrder]];
			}

			const changeHistory = await changelogs.findAll({
				where: filterChange,
				limit: parseInt(itemLimit),
				offset: offset,
				order: sortOption,
			});

			const totalCount = await changelogs.count({
				where: filterChange,
			});

			const totalPages = Math.ceil(totalCount / parseInt(itemLimit));

			res.status(200).send({
				status: 200,
				currentPage: parseInt(page),
				totalPages: totalPages,
				product_details: product,
				changelogs: changeHistory,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
	getAllStocks: async (req, res) => {
		try {
			const { search = "", CategoryId, page = 1, sortBy = "productName", sortOrder = "ASC", BranchId } = req.query;
			const itemLimit = parseInt(req.query.itemLimit, 10) || 30;

			const whereCondition = {
				productName: { [Op.like]: `%${search}%` },
			};

			if (CategoryId) {
				whereCondition.CategoryId = CategoryId;
			}

			const queriedCount = await products.count({
				where: whereCondition,
			});

			if (queriedCount === 0) {
				return res.status(404).send({
					status: 404,
					message: `No matches found for "${search}".`,
				});
			}

			let orderCriteria = [];

			if (sortBy === "productName") {
				orderCriteria.push(["productName", sortOrder]);
			} else if (sortBy === "aggregateStock") {
				orderCriteria.push(["aggregateStock", sortOrder]);
			} else if (sortBy === "viewCount") {
				orderCriteria.push(["viewCount", sortOrder]);
			} else if (sortBy === "likeCount") {
				orderCriteria.push(["likeCount", sortOrder]);
			} else if (sortBy === "CategoryId") {
				orderCriteria.push(["CategoryId", sortOrder]);
			} else if (sortBy === "branchStock") {
				orderCriteria.push([
					Sequelize.literal(
						`(SELECT IFNULL(SUM(currentStock), 0) FROM stocks WHERE stocks.ProductId = products.id AND stocks.BranchId = ${BranchId})`
					),
					sortOrder,
				]);
			} else if (sortBy === "txCount") {
				orderCriteria.push([
					Sequelize.literal(
						`(SELECT COUNT(*) FROM stockMovements WHERE stockMovements.ProductId = products.id AND
                stockMovements.isAddition = false AND
                stockMovements.isAdjustment = false AND
                stockMovements.isInitialization = false AND
                stockMovements.isBranchInitialization = false)`
					),
					sortOrder,
				]);
			} else if (sortBy === "failedTxCount") {
				orderCriteria.push([
					Sequelize.literal(
						`(SELECT COUNT(*) FROM stockMovements WHERE stockMovements.ProductId = products.id AND
                stockMovements.isAddition = true AND
                stockMovements.isAdjustment = false AND
                stockMovements.isInitialization = false AND
                stockMovements.isBranchInitialization = false)`
					),
					sortOrder,
				]);
			} else {
				orderCriteria.push(["productName", "ASC"]);
			}

			const tempResult = await products.findAll({
				where: whereCondition,
				order: orderCriteria,
				limit: itemLimit,
				offset: itemLimit * (page - 1),
				include: [
					{
						model: stocks,
						required: false,
					},
					{
						model: stockMovements,
						required: false,
						attributes: [
							[
								Sequelize.literal(
									`(SELECT COUNT(*) FROM stockMovements WHERE stockMovements.ProductId = products.id AND
								stockMovements.isAddition = false AND
								stockMovements.isAdjustment = false AND
								stockMovements.isInitialization = false AND
								stockMovements.isBranchInitialization = false)`
								),
								"txCount",
							],
						],
					},
					{
						model: stockMovements,
						required: false,
						attributes: [
							[
								Sequelize.literal(
									`(SELECT COUNT(*) FROM stockMovements WHERE stockMovements.ProductId = products.id AND
								stockMovements.isAddition = true AND
								stockMovements.isAdjustment = false AND
								stockMovements.isInitialization = false AND
								stockMovements.isBranchInitialization = false)`
								),
								"failedTxCount",
							],
						],
					},
				],
			});

			const totalPages = Math.ceil(queriedCount / itemLimit);

			const result = tempResult.map((product) => {
				return {
					...product.toJSON(),
					StockMovements: product.StockMovements[0],
				};
			});

			return res.status(200).send({
				totalProducts: queriedCount,
				productsPerPage: itemLimit,
				totalPages,
				currentPage: page,
				result,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
			});
		}
	},
	//! DEPLOY V.3.8 DISABLED
	// getBranchesProductCount: async (req, res) => {
	// 	try {
	// 		const branchesData = await branches.findAll({
	// 			include: [products],
	// 		});

	// 		const result = branchesData.map((branch) => {
	// 			const productsData = branch.Products;

	// 			const sortedProducts = {
	// 				byBranchStock: productsData.slice().sort((a, b) => b.Stocks.currentStock - a.Stocks.currentStock),
	// 				byLowBranchStock: productsData.slice().sort((a, b) => a.Stocks.currentStock - b.Stocks.currentStock),
	// 			};

	// 			const branchesProducts = {
	// 				topBranchStock: sortedProducts.byBranchStock.slice(0, 3),
	// 				lowBranchStock: sortedProducts.byLowBranchStock.slice(0, 3),
	// 			};

	// 			return {
	// 				id: branch.id,
	// 				name: branch.name,
	// 				address: branch.address,
	// 				lng: branch.lng,
	// 				lat: branch.lat,
	// 				imgURL: branch.imgURL,
	// 				productCount: productsData.length,
	// 				products: branchesProducts,
	// 			};
	// 		});

	// 		res.status(200).send({
	// 			status: 200,
	// 			result: result,
	// 		});
	// 	} catch (error) {
	// 		return res.status(500).send({
	// 			status: 500,
	// 			message: "Internal server error.",
	// 			error,
	// 		});
	// 	}
	// },
	getBranchesProductCount: async (req, res) => {
		try {
			const productsData = await products.findAll({
				include: [branches],
			});

			const branchNamesToCheck = ["Jakarta", "Bandung", "Jogjakarta", "Surabaya", "Batam"];

			const branchProducts = {};

			branchNamesToCheck.forEach((branchName) => {
				branchProducts[branchName] = {
					name: branchName,
					productCount: 0,
					topBranchStock: [],
					lowBranchStock: [],
				};
			});

			productsData.forEach((product) => {
				product.Branches.forEach((branch) => {
					const branchName = branch.name;
					if (!branchProducts[branchName]) {
						branchProducts[branchName] = {
							name: branchName,
							productCount: 0,
							topBranchStock: [],
							lowBranchStock: [],
						};
					}

					branchProducts[branchName].topBranchStock.push({
						productName: product.productName,
						currentStock: branch.Stocks.currentStock,
					});
					branchProducts[branchName].lowBranchStock.push({
						productName: product.productName,
						currentStock: branch.Stocks.currentStock,
					});

					branchProducts[branchName].productCount++;
				});
			});

			for (const branchName in branchProducts) {
				branchProducts[branchName].topBranchStock.sort((a, b) => b.currentStock - a.currentStock);
				branchProducts[branchName].lowBranchStock.sort((a, b) => a.currentStock - b.currentStock);
				branchProducts[branchName].topBranchStock = branchProducts[branchName].topBranchStock.slice(0, 3);
				branchProducts[branchName].lowBranchStock = branchProducts[branchName].lowBranchStock.slice(0, 3);
			}

			res.status(200).send({
				status: 200,
				branchProducts,
			});
		} catch (error) {
			console.log(error);
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
	getBranchesTransactionCount: async (req, res) => {
		try {
			const branchTransactionCountData = await branches.findAll({
				attributes: ["id", "name", "address", "lng", "lat", "imgURL"],
				include: [
					{
						model: stockMovements,
						required: false,
						attributes: [
							[
								Sequelize.literal(
									`(SELECT COUNT(*) FROM stockMovements WHERE stockMovements.BranchId = branches.id AND
								stockMovements.isAddition = false AND
								stockMovements.isAdjustment = false AND
								stockMovements.isInitialization = false AND
								stockMovements.isBranchInitialization = false)`
								),
								"txCount",
							],
						],
					},
					{
						model: stockMovements,
						required: false,
						attributes: [
							[
								Sequelize.literal(
									`(SELECT COUNT(*) FROM stockMovements WHERE stockMovements.BranchId = branches.id AND
								stockMovements.isAddition = true AND
								stockMovements.isAdjustment = false AND
								stockMovements.isInitialization = false AND
								stockMovements.isBranchInitialization = false)`
								),
								"failedTxCount",
							],
						],
					},
				],
			});

			const result = branchTransactionCountData.map((branch) => {
				return {
					...branch.toJSON(),
					StockMovements: branch.StockMovements[0],
				};
			});

			res.status(200).send({
				status: 200,
				message: "Branch transactions fetched successfully",
				result: result,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
	bestAndWorstProductsForBranch: async (req, res) => {
		try {
			const { BranchId } = req.params;

			const branch = await branches.findOne({
				where: {
					id: BranchId,
				},
			});

			if (!branch) {
				return res.status(404).send({
					status: 404,
					message: "Branch not found.",
				});
			}

			const deliveredTransactions = await products.findAll({
				include: [
					{
						model: stockMovements,
						where: {
							isAddition: false,
							isAdjustment: false,
							isInitialization: false,
							isBranchInitialization: false,
							BranchId: BranchId,
						},
						attributes: ["id"],
					},
				],
			});

			const cancelledTransactions = await products.findAll({
				include: [
					{
						model: stockMovements,
						where: {
							isAddition: true,
							isAdjustment: false,
							isInitialization: false,
							isBranchInitialization: false,
							BranchId: BranchId,
						},
						attributes: ["id"],
					},
				],
			});

			deliveredTransactions.sort((a, b) => b.StockMovements.length - a.StockMovements.length);
			cancelledTransactions.sort((a, b) => b.StockMovements.length - a.StockMovements.length);

			const bestProducts = deliveredTransactions.slice(0, 3).map((product) => ({
				...product.toJSON(),
				txCount: product.dataValues.StockMovements.length,
			}));

			const worstProducts = cancelledTransactions.slice(0, 3).map((product) => ({
				...product.toJSON(),
				failedTxCount: product.dataValues.StockMovements.length,
			}));

			res.status(200).send({
				status: 200,
				message: "Best and least performing products fetched successfully",
				branchInfo: branch,
				totalTxCount: deliveredTransactions.length,
				totalFailedTxCount: cancelledTransactions.length,
				bestProducts,
				worstProducts,
			});
		} catch (error) {
			return res.status(500).send({
				status: 500,
				message: "Internal server error.",
				error,
			});
		}
	},
};
