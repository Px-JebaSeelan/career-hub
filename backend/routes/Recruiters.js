const express = require("express");
const router = express.Router();
const recruiterController = require("../controllers/recruiterController");
const { registerValidation, validate } = require("../middlewares/validation");

// Test API
router.get("/s", (req, res) => res.send("API is working properly!"));

// Routes
router.get("/recruiter", recruiterController.getRecruiters);
router.post("/get_a_recruiter_by_email", recruiterController.getRecruiterByEmail);
router.post("/recruiter/add", registerValidation, validate, recruiterController.addRecruiter);
router.post("/edit_recruiter_profile", recruiterController.editRecruiterProfile);

module.exports = router;