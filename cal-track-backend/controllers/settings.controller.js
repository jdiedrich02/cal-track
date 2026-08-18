import { Settings } from "../models/settings.model.js";

/**
 * Gets the settings for the user
 * API: GET - /api/settings 
 */
export async function getSettingByUserId(req, res) {
    try {
        const userId = req.user.id;
        const setting = await Settings.getSettingByUserId(userId);
        res.json(setting);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get setting' });
    }
}

/**
 * Creates a new setting for the user
 * API: POST - /api/settings
 */ 
export async function createSetting(req, res) {
    try {
        const userId = req.user.id;
        const { calorieGoal } = req.body;

        if (!calorieGoal) {
            return res.status(400).json({ message: 'Missing Calorie Goal' });
        }

        await Settings.createSettingByUserID(userId, req.body);
        res.status(201).json({ message: 'Settings saved successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to save settings' });
    }
}

/**
 * Updates the settings for the user
 * API: PUT - /api/settings
 */
export async function updateSetting(req, res) {
    try {
        const userId = req.user.id;
        const { calorieGoal } = req.body;

        if (!calorieGoal) {
            return res.status(400).json({ message: 'Missing Calorie Goal' });
        }

        const result = await Settings.updateSettingByIdByUserID(userId, req.body);
        if (result.changes === 0) {
            return res.status(404).json({ message: 'Settings not found' });
        }
        res.json({ message: 'Settings updated successfully' }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update settings' });
    }
}