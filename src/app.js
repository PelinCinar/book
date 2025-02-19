const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const { logger } = require("./middleware/logEvents.js");
const errorHandler = require("./middleware/errorHandler.js");
const corsOptions = require("./middleware/errorHandler.js");
module.exports = corsOptions;
const bookRoutes = require("./routes/books.js");

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);
app.use("/books", bookRoutes);

app.use(errorHandler); //en sonda kullanmamız lazım


module.exports = app;
