const Admin = require('../models/Admin');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { name, email, password, phone, district, location } = req.body;

        const admin_by_email = await Admin.findOne({ email });
        if (admin_by_email) {
            return res.status(400).send({ message: "admin already exist" });
        }

        const hashed_password = await bcrypt.hash(password, 12);

        const register_admin = new Admin({
            name,
            email,
            password: hashed_password,
            phone,
            district,
            location
        });

        const registered_admin = await register_admin.save();

        const token = jwt.sign({
            id: registered_admin._id
        }
            , process.env.JWT_SECRET
            , { expiresIn: "7d" }
        );

        res.cookie("admin_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({ message: "admin register succesfully", token });

    }
    catch (err) {
        res.status(500).json({ message: "error occured in register", error: err.message });
    }

};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin_by_email = await Admin.findOne({ email });

        if (!admin_by_email) {
            return res.status(404).json({ "message": "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, admin_by_email.password);

        if (isMatch) {
            const token = jwt.sign({
                id: admin_by_email._id
            }
                , process.env.JWT_SECRET
                , { expiresIn: "7d" }
            );

            res.cookie("admin_token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.status(200).json({ message: "Login Succesfully", token });
        }
        else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    }
    catch (err) {
        res.status(500).json({ message: "error occured in login", error: err.message });
    }

};


//login required

const logout = async (req, res) => {
    try {
        res.clearCookie("admin_token", {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        });

        res.status(200).json({
            message: "Logout successful"
        });
    }
    catch (error) {
        res.status(500).json({ message: "error occured while logout", error: error.message });
    }
}


//login required

const admin_profile = async (req, res) => {
    try {
        const id = req.admin.id;

        const admin_by_id = await Admin.findById(id).select("-password");

        if (admin_by_id) {
            res.status(200).json(admin_by_id);
        }
        else {
            res.status(404).json({ message: "Admin not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "error occured while fetching admin profile", error: error.message });
    }

};


//login required

const admin_update = async (req, res) => {
    try {
        const id = req.admin.id;
        const { name, phone, district, location } = req.body;

        const admin_by_id = await Admin.findByIdAndUpdate(id, {
            name,
            phone,
            district,
            location
        }, {
            new: true,
            runValidators: true
        }).select("-password");


        if (admin_by_id) {
            res.status(200).json({ message: "Admin updated successfully", admin: admin_by_id });
        }
        else {
            res.status(404).json({ message: "Admin not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "error occured while updating admin", error: error.message });
    }

};


module.exports = { register, login, admin_profile, admin_update, logout };