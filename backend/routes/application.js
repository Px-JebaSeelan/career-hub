const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const { auth, checkRole } = require("../middlewares/auth");

// Test API
router.get("/s", (req, res) => res.send("API is working properly!"));

// Routes

// Applicant Routes
router.post("/addapplication", auth, checkRole(['applicant']), applicationController.addApplication);
router.post("/app_p_or_n", auth, applicationController.checkAppExistence); // Used by both maybe? or just applicant
router.post("/all_applied_jobs", auth, checkRole(['applicant']), applicationController.getAllAppliedJobs);

// Recruiter Routes
router.post("/all_my_employees", auth, checkRole(['recruiter']), applicationController.getAllEmployees);
router.post("/all_my_applications", auth, checkRole(['recruiter']), applicationController.getMyApplications); // This might be misnamed, usually Recruiter views "My Received Applications"
router.post("/all_my_non-rejected_applications_of_perticular_job", auth, checkRole(['recruiter']), applicationController.getJobApplications);

// Application Status Actions (Recruiter)
router.post("/accept_an_application", auth, checkRole(['recruiter']), applicationController.acceptApplication);
router.post("/reject_an_application", auth, checkRole(['recruiter']), applicationController.rejectApplication);
router.post("/shortlist_an_application", auth, checkRole(['recruiter']), applicationController.shortlistApplication);

module.exports = router;