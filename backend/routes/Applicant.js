const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const applicantController = require("../controllers/applicantController");
const { registerValidation, validate } = require("../middlewares/validation");
const Applicant = require("../models/applicants"); // Needed for multer helper

// Test API
router.get("/s", (req, res) => res.send("API is working properly!"));

// Routes
router.get("/applicant", applicantController.getApplicants);
router.post("/get_an_applicant_by_email", applicantController.getApplicantByEmail);
router.post("/applicant/add", registerValidation, validate, applicantController.addApplicant);
router.post("/edit_applicant_profile", applicantController.editApplicantProfile);
router.post("/rate_an_applicant", applicantController.rateApplicant);
router.post("/increment_application_count", applicantController.incrementAppCount);
router.post("/decrement_application_count", applicantController.decrementAppCount);


// File Upload (Keeping this here as it's middleware-heavy and tied to storage config)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/" + req.query.type);
    },
    filename: async function (req, file, cb) {
        const fileName = req.query.email + path.extname(file.originalname);
        if (req.query.type === 'image') {
            try {
                await Applicant.updateOne({ email: req.query.email }, { $set: { image: fileName } });
            } catch (err) {
                console.error("Error updating image path in db:", err);
            }
        }
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage });

router.post("/addfile", upload.single('file'), async (req, res) => {
    const userid = req.query.email;
    const type = req.query.type;
    const filePath = req.file.path; // Absolute or relative path stored by multher

    console.log(`File uploaded for user ${userid} type ${type}`);

    if (type === 'cv') {
        // Just return success for CV upload
        res.status(200).json({ msg: "CV uploaded successfully" });
    } else {
        res.status(200).send("File uploaded");
    }
});

module.exports = router;