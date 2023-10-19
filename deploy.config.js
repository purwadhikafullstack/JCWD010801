module.exports = {
	apps: [
		{
			name: "JCWD-0108-01",
			script: "./projects/server/src/index.js",
			env: {
				NODE_ENV: "production",
				PORT: 8801,
			},
			time: true,
		},
	],
};
