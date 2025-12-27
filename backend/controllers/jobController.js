const Job = require("../models/Jobs");

// Get all jobs
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (err) {
        console.error("Error fetching jobs:", err);
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
};

// View jobs for applicant with filtering
const viewJobsForApplicant = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let query = {
            status: "present",
            deadline_of_application: { $gte: today }
        };

        // Server-side Filtering
        if (req.query.jobType && req.query.jobType !== 'all') {
            query.type_of_job = req.query.jobType;
        }
        if (req.query.duration && req.query.duration !== '0') {
            query.duration = { $lt: parseInt(req.query.duration) };
        }
        if (req.query.salaryMin || req.query.salaryMax) {
            query.salary_per_month = {};
            if (req.query.salaryMin) query.salary_per_month.$gte = parseInt(req.query.salaryMin);
            if (req.query.salaryMax) query.salary_per_month.$lte = parseInt(req.query.salaryMax);
        }
        if (req.query.search) {
            query.title = { $regex: req.query.search, $options: 'i' };
        }

        // Sorting
        let sortOptions = {};
        if (req.query.sort) {
            const sortParams = req.query.sort.split('_');
            const sortField = sortParams[0] === 'salary' ? 'salary_per_month' : 'rating'; // rating might be needed
            const sortOrder = sortParams[1] === 'desc' ? -1 : 1;
            sortOptions = { [sortField]: sortOrder };
        } else {
            // Default sort? date?
            sortOptions = { date_of_posting: -1 };
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const jobs = await Job.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const totalJobs = await Job.countDocuments(query);

        res.json({
            jobs,
            currentPage: page,
            totalPages: Math.ceil(totalJobs / limit),
            totalJobs
        });

    } catch (err) {
        console.error("Error viewing jobs for applicant:", err);
        res.status(400).json(err);
    }
};

// Add Job
const addJob = async (req, res) => {
    try {
        const newJob = new Job({
            title: req.body.title,
            max_applications: req.body.max_applications,
            max_positions: req.body.max_positions,
            deadline_of_application: req.body.deadline_of_application,
            required_skills: req.body.required_skills,
            type_of_job: req.body.type_of_job,
            duration: req.body.duration,
            salary_per_month: req.body.salary_per_month,
            name_recruiter: req.body.name_recruiter,
            email_recruiter: req.body.email_recruiter,
            date_of_posting: Date.now(),
            status: "present"
        });

        const savedJob = await newJob.save();
        res.status(200).json(savedJob);
    } catch (err) {
        console.error("Error adding job:", err);
        res.status(400).json(err);
    }
};

// Get Job by ID
const getJobById = async (req, res) => {
    try {
        const id = req.body.id;
        const job = await Job.findOne({ _id: id });
        if (!job) return res.status(404).json({ error: "Job not found" });
        res.json(job);
    } catch (err) {
        console.error("Error getting job by ID:", err);
        res.status(500).json(err);
    }
};

// Get Jobs for Recruiter
const getJobsForRecruiter = async (req, res) => {
    try {
        const email = req.body.email_rec;
        const jobs = await Job.find({
            email_recruiter: email,
            status: "present"
        });
        res.json(jobs);
    } catch (err) {
        console.error("Error viewing recruiter jobs:", err);
        res.status(400).json(err);
    }
};

// Delete Job
const deleteJob = async (req, res) => {
    try {
        const id = req.body.id;
        await Job.updateOne({ _id: id }, { $set: { status: "deleted" } });
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (err) {
        console.error("Error deleting job:", err);
        res.status(500).json(err);
    }
};

// Edit Job
const editJob = async (req, res) => {
    try {
        const { email_recruiter, title } = req.body;
        // Logic remains same as original due to identification constraints
        const updateFields = {
            max_applications: req.body.max_applications,
            max_positions: req.body.max_positions,
            deadline_of_application: req.body.deadline_of_application,
            required_skills: req.body.required_skills,
            type_of_job: req.body.type_of_job,
            duration: req.body.duration,
            salary_per_month: req.body.salary_per_month,
            name_recruiter: req.body.name_recruiter,
            status: "present"
        };

        const result = await Job.updateOne(
            { email_recruiter: email_recruiter, title: title },
            { $set: updateFields }
        );

        res.json({ message: "Job updated successfully", result });
    } catch (err) {
        console.error("Error editing job:", err);
        res.status(400).json(err);
    }
};


module.exports = {
    getJobs,
    viewJobsForApplicant,
    addJob,
    getJobById,
    getJobsForRecruiter,
    deleteJob,
    editJob
};
