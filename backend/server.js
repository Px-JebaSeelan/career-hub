const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const PORT = process.env.PORT || 4000;
// Trigger restart for env update


// routes
var testAPIRouter = require("./routes/testAPI");
var UserRouter = require("./routes/Users");
//var UserrrrRouter = require("./routes/Recruiters");
var RecruiterRouter = require("./routes/Recruiters");
var JobRouter = require("./routes/Jobs");
var ApplicationRouter = require("./routes/application");
var ApplicantRouter = require("./routes/Applicant");

app.use('/image', express.static(path.join(__dirname, 'public/image')));
app.use('/cv', express.static(path.join(__dirname, 'public/cv')));

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    /\.vercel\.app$/,  // Allow all Vercel URLs
    process.env.FRONTEND_URL
  ],
  credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//mongo db connection
const dbName = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/job';
mongoose.connect(dbName, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Database Connected');
}).catch((err) => {
    console.log('Database Not Connected');
    console.log(err);
    console.log('\n\nTo fix this:');
    console.log('1. Make sure MongoDB is installed and running.');
    console.log('2. If you have a cloud MongoDB URL, add it to backend/.env as MONGO_URI');
});

// Health check endpoint (keeps server warm)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is running' });
});

// setup API endpoints
app.use("/testAPI", testAPIRouter);
app.use("/user", UserRouter);
//app.use("/router", UserrrrRouter);
app.use("/recruiter", RecruiterRouter);
app.use("/job", JobRouter);
app.use("/application", ApplicationRouter)
app.use("/applicant", ApplicantRouter)

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});
