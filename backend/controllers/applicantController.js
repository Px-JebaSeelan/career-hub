const Applicant = require("../models/applicants");
const bcrypt = require("bcryptjs");
const path = require("path");

// Get all applicants
const getApplicants = async (req, res) => {
    try {
        const applicants = await Applicant.find();
        res.json(applicants);
    } catch (err) {
        console.error("Error fetching applicants:", err);
        res.status(500).json({ error: "Failed to fetch applicants" });
    }
};

// Get Applicant by Email
const getApplicantByEmail = async (req, res) => {
    try {
        const email = req.body.applicant_ka_email || req.body.email;
        const applicant = await Applicant.findOne({ email: email });
        if (!applicant) {
            return res.status(404).json({ error: "Applicant not found" });
        }
        res.json(applicant);
    } catch (err) {
        console.error("Error getting applicant by email:", err);
        res.status(500).json(err);
    }
};

// Add Applicant
const addApplicant = async (req, res) => {
    try {
        const { name, email, password, type, date, list_of_languages, education, image, cv } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newApplicant = new Applicant({
            name,
            email,
            password: hashedPassword,
            type,
            date: date || Date.now(),
            list_of_languages,
            education,
            image,
            cv
        });

        const savedApplicant = await newApplicant.save();
        res.json(savedApplicant);
    } catch (err) {
        console.error("Error adding applicant:", err);
        res.status(400).send(err);
    }
};

// Edit Applicant Profile
const editApplicantProfile = async (req, res) => {
    try {
        const { email, name, list_of_languages, education, cv } = req.body;

        const updateFields = {
            name: name,
            list_of_languages: list_of_languages,
            education: education,
            cv: cv
        };

        const result = await Applicant.updateOne({ email: email }, { $set: updateFields });
        res.json({ message: "Profile updated successfully", result });
    } catch (err) {
        console.error("Error editing applicant profile:", err);
        res.status(500).json(err);
    }
};

// Rate Applicant
const rateApplicant = async (req, res) => {
    try {
        const { email, rate_count, rating } = req.body;
        await Applicant.updateOne({ email: email }, { $set: { rate_count, rating } });
        const updatedApplicant = await Applicant.findOne({ email: email });
        res.json(updatedApplicant);
    } catch (err) {
        console.error("Error rating applicant:", err);
        res.status(500).json(err);
    }
};

// Increment App Count
const incrementAppCount = async (req, res) => {
    try {
        const email = req.body.email;
        await Applicant.updateOne({ email: email }, { $inc: { application_count: 1 } });
        const updatedApplicant = await Applicant.findOne({ email: email });
        res.json(updatedApplicant);
    } catch (err) {
        console.error("Error incrementing application count:", err);
        res.status(500).json(err);
    }
};

// Decrement App Count
const decrementAppCount = async (req, res) => {
    try {
        const email = req.body.email;
        await Applicant.updateOne({ email: email }, { $inc: { application_count: -1 } });
        const updatedApplicant = await Applicant.findOne({ email: email });
        res.json(updatedApplicant);
    } catch (err) {
        console.error("Error decrementing application count:", err);
        res.status(500).json(err);
    }
};


module.exports = {
    getApplicants,
    getApplicantByEmail,
    addApplicant,
    editApplicantProfile,
    rateApplicant,
    incrementAppCount,
    decrementAppCount
};
