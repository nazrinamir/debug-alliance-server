const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());
require("dotenv").config();

//Add Router here

// db.sequelize.sync().then(() => {
//   app.listen(process.env.PORT || 3001, () => {
//     console.log("Server running on port 3001");
//   });
// });

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
