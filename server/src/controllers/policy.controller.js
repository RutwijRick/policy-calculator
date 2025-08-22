import { Policy, IllustrationRow } from "../models/index.js";

// Step 1: calculate only (not saving in DB yet)
export const calculatePolicy = async (req, res) => {
    try {
        const { dob, gender, sumAssured, modalPremium, premiumFrequency, pt, ppt, riders } = req.body;

        // Dummy illustration calculation (replace with real formula later)
        const tableData = Array.from({ length: pt }, (_, i) => ({
            year: i + 1,
            premium: modalPremium,
            benefit: sumAssured + i * 1000,
        }));

        const summary = {
            totalPremium: modalPremium * ppt,
            maturityBenefit: sumAssured + pt * 1000,
        };

        res.json({ tableData, summary });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error calculating policy" });
    }
};

// Step 2: save policy to DB
export const savePolicy = async (req, res) => {
    try {
        const { userId, policyType, dob, gender, sumAssured, modalPremium, premiumFrequency, pt, ppt, riders } = req.body;

        const policy = await Policy.create({
            userId,
            policyType,
            dob,
            gender,
            sumAssured,
            modalPremium,
            premiumFrequency,
            pt,
            ppt,
            riders,
        });

        res.status(201).json({ message: "Policy saved successfully!", policy });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error saving policy" });
    }
};

// Step 3: fetch all policies by user
export const getPoliciesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const policies = await Policy.findAll({ where: { userId } });
        res.json(policies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching policies" });
    }
};

export const getPolicyById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; // assuming you attach logged-in user to req.user in middleware

        const policy = await Policy.findOne({
            where: { id, userId },
        });

        if (!policy) {
            return res.status(404).json({ error: "Policy not found" });
        }

        res.json(policy);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error while fetching policy" });
    }
};

export const deletePolicyById = async (req, res) => {
    try {
        const { id } = req.params;

        const policy = await Policy.findByPk(id);

        if (!policy) {
            return res.status(404).json({ error: "Policy not found" });
        }

        await policy.destroy();

        res.json({
            message: "Policy deleted successfully",
            deletedPolicyId: id,
        });
    } catch (err) {
        console.error("Error deleting policy:", err);
        res.status(500).json({ error: "Server error deleting policy" });
    }
};