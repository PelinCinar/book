const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const { logger } = require("./middleware/logEvents.js");

const bookRoutes = require("./routes/books");

app.use(cors());
app.use(logger);
app.use(express.json());
app.use("/books", bookRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
