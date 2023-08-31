require("dotenv/config");
const express = require("express");
const cors = require("cors");
const { join } = require("path");
const PORT = process.env.PORT || 8000;
const server = express();
const db = require('./models');
const { userRouters, adminRouters, productRouters } = require("./routers");

// server.use(
//   cors({
//     origin: [
//       process.env.WHITELISTED_DOMAIN &&
//       process.env.WHITELISTED_DOMAIN.split(","),
//     ],
//   })
// );

server.use(cors());
server.use(express.json());
server.use(express.static('./public'));

//#region API ROUTES
// ===========================
// NOTE : Add your routes here
server.use('/api/user', userRouters);
server.use('/api/admin', adminRouters);
server.use('/api/product', productRouters);

server.get("/api", (req, res) => {
  res.send(`Hello, welcome to Alpha Mart API.`);
});

server.get("/api/greetings", (req, res, next) => {
  res.status(200).json({
    message: "Hello, Student !",
  });
});

// ===========================

// not found
server.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// error
server.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(500).send("Error !");
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
server.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
server.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion
server.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    // db.sequelize.sync({ alter: true });
    console.log(`SERVER IS RUNNING AT PORT:${PORT} ✅`);
  }
});