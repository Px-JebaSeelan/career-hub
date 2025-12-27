const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const { jobValidation, validate } = require("../middlewares/validation");
const { auth, checkRole } = require("../middlewares/auth");

// Test API
router.get("/s", (req, res) => res.send("API is working properly!"));

// Routes

// Public/Applicant Routes
router.get("/jobs", jobController.getJobs); // Maybe public?
router.get("/job/view_for_applicant", auth, jobController.viewJobsForApplicant); // Protected for Applicants
router.post("/get_a_job_by_id", auth, jobController.getJobById);

// Recruiter Protected Routes
router.post("/job/add", auth, checkRole(['recruiter']), jobValidation, validate, jobController.addJob);
router.post("/job/view", auth, checkRole(['recruiter']), jobController.getJobsForRecruiter);
router.post("/job/delete", auth, checkRole(['recruiter']), jobController.deleteJob);
router.post("/job/edit", auth, checkRole(['recruiter']), jobController.editJob);

module.exports = router;