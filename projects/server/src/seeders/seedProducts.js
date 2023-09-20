require("dotenv/config");
const { faker } = require("@faker-js/faker");
const db = require("../models");
const sequelize = db.sequelize;
const products = db.Products;
const stocks = db.Stocks;
const stockMovements = db.StockMovements;
const categories = db.Categories;

const seedProducts = async () => {
	try {
		const existingProductNames = await products.findAll({ attributes: ["productName"] });
		const uniqueProductNames = new Set(existingProductNames.map((product) => product.productName));

		const fetchedCategories = await categories.findAll();
		const categoryIds = fetchedCategories.map((category) => category.id);

		const numProductsToSeed = 100;

		for (let i = 0; i < numProductsToSeed; i++) {
			const randomCategoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];

			let productName;
			do {
				productName = faker.commerce.productName();
			} while (uniqueProductNames.has(productName));

			uniqueProductNames.add(productName);

			const price = faker.number.int({ min: 50000, max: 10000000 });
			const description = faker.lorem.sentence();
			const weight = faker.number.int({ min: 1000, max: 10000 });

			const result = await products.create({
				productName,
				price,
				imgURL: "P-IMG-1693692200758826652948.jpeg",
				description,
				aggregateStock: 100,
				weight,
				isActive: true,
				isDeleted: false,
				CategoryId: randomCategoryId,
			});

			await stocks.create({
				currentStock: 100,
				ProductId: result.id,
				BranchId: 1,
			});

			await stockMovements.create({
				ProductId: result.id,
				BranchId: 1,
				change: 100,
				isAddition: true,
				isAdjustment: false,
				isInitialization: true,
				UserId: 1,
			});
		}
		console.log("Products seeded successfully.");
	} catch (error) {
		console.error("Error seeding products:", error);
	} finally {
		await sequelize.close();
	}
};

seedProducts();
