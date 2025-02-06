const express = require("express");
const app = express();
const cors = require("cors"); 
const bookRoutes = require("./routes/books"); 

app.use(cors()); 
app.use(express.json());
app.use("/books", bookRoutes); 

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
