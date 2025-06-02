const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./models"); // Destructure sequelize directly
const mongoose = require('mongoose');

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Import user routes
const userRouter = require("./routes/userAdmin");
const playerRouter = require("./routes/playerRoutes");

// Use routes
app.use("/api/users", userRouter);
app.use("/api/players", playerRouter);

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
