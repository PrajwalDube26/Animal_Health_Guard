const training_module = require('../models/Training_module');

// Create Training Module (Admin)
const createTraningModule = async (req, res) => {
    try {
        const { title, description, content, category, language } = req.body;
        const adminid = req.admin.id;

        const training_module_to_save = new training_module({
            adminid,
            title,
            description,
            content,
            category: category ? category.toLowerCase() : 'general',
            language: language || "English"
        });

        const saved_training_module = await training_module_to_save.save();

        if (!saved_training_module) {
            return res.status(400).json({ message: "Failed to save training module" });
        }

        res.status(201).json({ message: "Created successfully", TraningModule: saved_training_module });

    } catch (error) {
        res.status(500).json({ message: "Problem in creating TraningModule", error: error.message });
    }
};

// Get Training Module by ID
const getTraningModuleByID = async (req, res) => {
    try {
        const { id } = req.params;

        const TraningModule = await training_module.findById(id).populate('adminid', 'name email district location');

        if (!TraningModule) {
            return res.status(404).json({ message: "Training module not found" });
        }

        res.status(200).json({ message: "Getting successfully", TraningModule });

    } catch (error) {
        res.status(500).json({ message: "Problem in fetching TraningModule", error: error.message });
    }
};

// Get All Training Modules (Public / Farmers)
const getAllTraningModule = async (req, res) => {
    try {
        const TraningModule = await training_module.find().populate('adminid', 'name district');

        res.status(200).json({
            message: "Training modules fetched successfully",
            count: TraningModule.length,
            TraningModule
        });

    } catch (error) {
        res.status(500).json({ message: "Problem in fetching TraningModule", error: error.message });
    }
};

// Get Training Modules created by logged-in Admin
const getTraningModuleByAdminID = async (req, res) => {
    try {
        const adminid = req.admin.id;

        const TraningModule = await training_module.find({ adminid });

        if (TraningModule.length === 0) {
            return res.status(200).json({
                message: "No training modules found for this admin",
                count: 0,
                TraningModule: []
            });
        }

        res.status(200).json({
            message: "Training modules fetched successfully for admin",
            count: TraningModule.length,
            TraningModule
        });

    } catch (error) {
        res.status(500).json({ message: "Problem in fetching TraningModule by admin ID", error: error.message });
    }
};

// Delete Training Module (Admin)
const deleteTraningModule = async (req, res) => {
    try {
        const { id } = req.params;
        const adminid = req.admin.id;

        const TraningModule = await training_module.findOneAndDelete({ _id: id, adminid });

        if (!TraningModule) {
            return res.status(404).json({ message: "Not found or unauthorized to delete" });
        }

        res.status(200).json({ message: "Deleted successfully", TraningModule });

    } catch (error) {
        res.status(500).json({ message: "Problem in deleting TraningModule", error: error.message });
    }
};

// Update Training Module (Admin)
const updateTraningModule = async (req, res) => {
    try {
        const { id } = req.params;
        const adminid = req.admin.id;
        const { title, description, content, category, language } = req.body;

        const updateData = {
            title,
            description,
            content,
        };

        if (category) updateData.category = category.toLowerCase();
        if (language) updateData.language = language;

        const TraningModule = await training_module.findOneAndUpdate(
            { _id: id, adminid },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!TraningModule) {
            return res.status(404).json({ message: "Not found or unauthorized to update" });
        }

        res.status(200).json({ message: "Updated successfully", TraningModule });

    } catch (error) {
        res.status(500).json({ message: "Problem in updating TraningModule", error: error.message });
    }
};

module.exports = {
    createTraningModule,
    getTraningModuleByID,
    getAllTraningModule,
    getTraningModuleByAdminID,
    deleteTraningModule,
    updateTraningModule
};