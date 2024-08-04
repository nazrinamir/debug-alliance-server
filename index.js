const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./models"); // Destructure sequelize directly

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors());

// Import user routes
const userRouter = require("./routes/userAdmin");

// Use routes
app.use("/auth", userRouter);

// Sync database and start server
sequelize
  .sync()
  .then(() => {
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to sync database:", error);
  });
