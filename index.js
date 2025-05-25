const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Import routes
const userRouter = require("./routes/userAdmin");
const playerDataRouter = require("./routes/playerData");

// Use routes
app.use("/auth", userRouter);
app.use("/api/players", playerDataRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
