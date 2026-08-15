const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { name, email, password, phone, location } = req.body;

        const user_by_email = await User.findOne({ email });
        if (user_by_email) {
            return res.status(400).send({ message: "user already exist" });
        }

        const hashed_password = await bcrypt.hash(password, 12);

        const register_user = new User({
            name,
            email,
            password: hashed_password,
            phone,
            location
        });

        const registered_user = await register_user.save();

        const token = jwt.sign({
            id: registered_user._id
        }
            , process.env.JWT_SECRET
            , { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({ message: "user register succesfully", token });

    }
    catch (err) {
        res.status(500).json({ message: "error occuredin register", error: err.message });
    }

};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user_by_email = await User.findOne({ email });

        if (!user_by_email) {
            return res.status(404).json({ "message": "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user_by_email.password);

        if (isMatch) {
            const token = jwt.sign({
                id: user_by_email._id
            }
                , process.env.JWT_SECRET
                , { expiresIn: "7d" }
            );

            res.cookie("token", token, {
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
        res.clearCookie("token", {
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

const user_profile = async (req, res) => {
    try {
        const id = req.user.id;

        const user_by_id = await User.findById(id).select("-password");

        if (user_by_id) {
            res.status(200).json(user_by_id);
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "error occured while fetching user profile", error: error.message });
    }

};


//login required

const user_update = async (req, res) => {
    try {
        const id = req.user.id;
        const { name, phone, location } = req.body;

        const user_by_id = await User.findByIdAndUpdate(id, {
            name,
            phone,
            location
        }, {
            new: true,
            runValidators: true
        }).select("-password");


        if (user_by_id) {
            res.status(200).json({ message: "User updated successfully", user: user_by_id });
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "error occured while updating user", error: error.message });
    }

};


module.exports = { register, login, user_profile, user_update, logout };