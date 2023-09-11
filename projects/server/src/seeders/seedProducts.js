require("dotenv/config");
const { faker } = require("@faker-js/faker");
const db = require("../models");
const sequelize = db.sequelize;
const products = db.Products;
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
			const weight = faker.number.int({ min: 100, max: 100000 });

			await products.create({
				productName,
				price,
				imgURL: "P-IMG-1693692200758826652948.jpeg",
				description,
				aggregateStock: 0,
				weight,
				isActive: true,
				isDeleted: false,
				CategoryId: randomCategoryId,
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
