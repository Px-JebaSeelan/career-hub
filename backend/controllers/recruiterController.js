const Recruiter = require("../models/recruiters");
const bcrypt = require("bcryptjs");

// Get all recruiters
const getRecruiters = async (req, res) => {
    try {
        const recruiters = await Recruiter.find();
        res.json(recruiters);
    } catch (err) {
        console.error("Error fetching recruiters:", err);
        res.status(500).json({ error: "Failed to fetch recruiters" });
    }
};

// Get Recruiter by Email
const getRecruiterByEmail = async (req, res) => {
    try {
        const email = req.body.email;
        const recruiter = await Recruiter.findOne({ email: email });

        if (!recruiter) {
            return res.status(404).json({ error: "Recruiter not found" });
        }
        res.json(recruiter);
    } catch (err) {
        console.error("Error getting recruiter by email:", err);
        res.status(500).json(err);
    }
};

// Add Recruiter
const addRecruiter = async (req, res) => {
    try {
        const { name, email, password, type, date, bio_recruiter, contact_number } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newRecruiter = new Recruiter({
            name,
            email,
            password: hashedPassword,
            type,
            date: date || Date.now(),
            bio: bio_recruiter,
            contact_number,
        });

        const savedRecruiter = await newRecruiter.save();

        // Generate Token
        const jwt = require('jsonwebtoken');
        const payload = {
            user: {
                id: savedRecruiter.id,
                type: savedRecruiter.type,
                email: savedRecruiter.email
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: savedRecruiter });
            }
        );

    } catch (err) {
        console.error("Error adding recruiter:", err);
        res.status(400).send(err);
    }
};

// Edit Recruiter Profile
const editRecruiterProfile = async (req, res) => {
    try {
        const { email, bio, contact_number, name } = req.body;

        const result = await Recruiter.updateOne(
            { email: email },
            {
                $set: {
                    bio: bio,
                    contact_number: contact_number,
                    name: name
                }
            }
        );

        res.json({ message: "Profile updated successfully", result });
    } catch (err) {
        console.error("Error editing recruiter profile:", err);
        res.status(500).json(err);
    }
};

module.exports = {
    getRecruiters,
    getRecruiterByEmail,
    addRecruiter,
    editRecruiterProfile
};
