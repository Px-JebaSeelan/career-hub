const Application = require("../models/applications");
const Job = require("../models/jobs");
const nodemailer = require('nodemailer');

// Send Email Helper
const sendEmail = async (to, subject, text) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

// Add Application
const addApplication = async (req, res) => {
    try {
        if (!req.body.job_id || !req.body.applicant_email) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newApplication = new Application({
            job_id: req.body.job_id,
            recruiter_email: req.body.email_recruiter,
            applicant_email: req.body.applicant_email,
            status: req.body.status || "applied",
            sop: req.body.sop,
            date_of_application: Date.now(),
            name_recruiter: req.body.name_recruiter,
            job_salary_per_month: req.body.job_salary_per_month,
            status_of_job: req.body.status_of_job,
            job_title: req.body.job_title,
            name_applicant: req.body.name_applicant,
            skills_applicant: req.body.skills,
            education_applicant: req.body.education,
            job_type: req.body.job_type,
            applicant_rating: req.body.rating
        });

        const savedApp = await newApplication.save();

        // Increment positions filled (likely legacy logic for app count)
        await Job.updateOne({ _id: req.body.job_id }, { $inc: { number_of_positions_filled: 1 } });

        res.status(200).json(savedApp);
    } catch (err) {
        console.error("Error adding application:", err);
        res.status(400).send(err);
    }
};

// Check App Existence
const checkAppExistence = async (req, res) => {
    try {
        const app = await Application.find({
            "applicant_email": req.body.applicant_email,
            "job_id": req.body.id
        });
        res.json(app);
    } catch (err) {
        console.error("Error checking application existence:", err);
        res.status(400).send(err);
    }
};

// Get Applied Jobs
const getAllAppliedJobs = async (req, res) => {
    try {
        const apps = await Application.find({ "applicant_email": req.body.applicant_email });
        res.json(apps);
    } catch (err) {
        console.error("Error fetching applied jobs:", err);
        res.status(400).send(err);
    }
};

// Get Employees
const getAllEmployees = async (req, res) => {
    try {
        const apps = await Application.find({
            recruiter_email: req.body.email_rec,
            status: "accepted"
        });
        res.json(apps);
    } catch (err) {
        console.error("Error fetching employees:", err);
        res.status(400).send(err);
    }
};

// Get My Applications (for Applicant usually)
const getMyApplications = async (req, res) => {
    try {
        const email = req.body.email_rec; // Preserving param name
        const apps = await Application.find({ "applicant_email": email });
        res.json(apps);
    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
};

// Get Job Applications for Recruiter
const getJobApplications = async (req, res) => {
    try {
        const apps = await Application.find({
            recruiter_email: req.body.email_recruiter,
            job_id: req.body.id,
            status: { $in: ["applied", "shortlisted", "accepted"] }
        });
        res.json(apps);
    } catch (err) {
        console.error("Error fetching job applications:", err);
        res.status(400).send(err);
    }
};

// Accept Application
const acceptApplication = async (req, res) => {
    try {
        const id = req.body.id;
        await Application.updateOne({ _id: id }, { $set: { status: "accepted" } });

        const updatedApp = await Application.findOne({ _id: id });

        if (updatedApp) {
            await sendEmail(
                updatedApp.applicant_email,
                'Application Accepted',
                `Congratulations! Your application for ${updatedApp.job_title} has been accepted.`
            );
        }

        res.json(updatedApp);
    } catch (err) {
        console.error("Error accepting application:", err);
        res.status(500).send(err);
    }
};

// Reject Application
const rejectApplication = async (req, res) => {
    try {
        const id = req.body.id;
        await Application.updateOne({ _id: id }, { $set: { status: "rejected" } });
        res.status(200).json({ message: "Application rejected" });
    } catch (err) {
        console.error("Error rejecting application:", err);
        res.status(500).send(err);
    }
};

// Shortlist Application
const shortlistApplication = async (req, res) => {
    try {
        const id = req.body.id;
        await Application.updateOne({ _id: id }, { $set: { status: "shortlisted" } });
        res.status(200).json({ message: "Application shortlisted" });
    } catch (err) {
        console.error("Error shortlisting application:", err);
        res.status(500).send(err);
    }
};

module.exports = {
    addApplication,
    checkAppExistence,
    getAllAppliedJobs,
    getAllEmployees,
    getMyApplications,
    getJobApplications,
    acceptApplication,
    rejectApplication,
    shortlistApplication
};
