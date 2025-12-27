const User = require("../models/Users");
const bcrypt = require("bcryptjs");

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password, type, date } = req.body;

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            type,
            date: date || Date.now()
        });

        const savedUser = await newUser.save();

        // Generate Token
        const jwt = require('jsonwebtoken'); // Could move to top
        const payload = {
            user: {
                id: savedUser.id,
                type: savedUser.type,
                email: savedUser.email
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: savedUser });
            }
        );
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(400).send(err);
    }
};

// Login User (Unified for Users, Applicants, Recruiters)
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check in User collection
        let user = await User.findOne({ email });
        let collection = 'User';

        // Check in Applicant collection
        if (!user) {
            const Applicant = require("../models/applicants");
            user = await Applicant.findOne({ email });
            collection = 'Applicant';
        }

        // Check in Recruiter collection
        if (!user) {
            const Recruiter = require("../models/Recruiters");
            user = await Recruiter.findOne({ email });
            collection = 'Recruiter';
        }

        if (!user) {
            return res.status(404).json({ error: "Email not found" });
        }

        // Password Comparison
        let isMatch = false;
        // Check if password is hashed (starts with $2a$ or $2b$)
        if (user.password && (user.password.startsWith("$2a$") || user.password.startsWith("$2b$"))) {
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            // Legacy plain text check
            if (user.password === password) {
                isMatch = true;
            }
        }

        if (isMatch) {
            // Create JWT Payload
            const payload = {
                user: {
                    id: user.id,
                    type: user.type, // Ensure models have 'type' field
                    email: user.email
                }
            };

            const jwt = require('jsonwebtoken');
            jwt.sign(
                payload,
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '5d' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token, user });
                }
            );
        } else {
            res.status(401).json({ error: "Incorrect password" });
        }
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update User
const updateUser = async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required for update" });
        }

        const result = await User.updateOne(
            { email: email },
            { $set: { name: name } }
        );

        res.json({ message: "User updated successfully", result });
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json(err);
    }
};

module.exports = {
    getUsers,
    registerUser,
    loginUser,
    updateUser
};
