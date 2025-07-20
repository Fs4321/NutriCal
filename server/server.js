require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const indexRouter = require("./src/routes/index");

const validateAuthentication = require("./src/middleware/validateAuthentication");

const app = express();

// MongoDB connection
const mongoDB = process.env.MONGODB_URI || "mongodb://localhost:27017/nutriCal";
mongoose.connect(mongoDB)
const db = mongoose.connection
db.on('error',(error)=> console.error(error))
db.once('open',()=> console.log(`Connected to database`))

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());

// Rate limiting middleware
const rateLimit = require("./src/middleware/rateLimit");
//app.use(rateLimit);


app.get('/', (req,res)=>{
  res.send("Welcome to NutriCal");
});


app.use((req, res, next) => {
  console.log(`Received request for route: ${req.originalUrl}`);
  next(); // Continue to the next middleware/route handler
});

app.post("/test", (req, res) => {
  res.status(200).json({ message: "Test successful", body: req.body });
});
app.use("/api/users", require("./src/routes/user"));
app.use(validateAuthentication);

app.use("/api", indexRouter);



// Start server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




module.exports = app;
