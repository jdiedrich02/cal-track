import { Macros } from "../models/macros.model.js";

/**
 * Gets all macros from the DB
 * API: /api/macros/all
 */
export async function getAllMacros(req, res) {
    try {
        const userId = req.user.id;
        const macros = await Macros.getAllMacros(userId);
        res.json(macros);
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch macros' });
    }
}

/**
 * Creates a new macro entry
 * API: /api/macros/create
 */
export async function createMacro(req, res) {
    try {
        const userId = req.user.id;
        const { name, grams, calories, unit } = req.body;

        if (!name || !calories) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if ((!unit || unit === 'grams') && !grams) {
            return res.status(400).json({ message: 'Grams is required for gram-based macros' });
        }

        await Macros.createMacroByUserId(userId, req.body);
        res.status(201).json({ message: 'Macro created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create macro' });
    }
}

/**
 * Deletes an existing macro
 * API: DELETE - /api/macros/<ID>
 */
export async function deleteMacro(req, res) {
    try {
        const userId = req.user.id;
        const macroId = req.params.id;

        if (!macroId) {
            return res.status(400).json({ message: 'Macro ID is required to delete macro' });
        }

        const result = await Macros.deleteMacroById(macroId, userId);
        if (result.changes === 0) {
            return res.status(404).json({ message: 'Macro not found' });
        }

        res.json({ message: 'Macro Delete Successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete macro' });
    }
}

/**
 * Gets a Macro by its ID
 * API: GET - /api/macros/<ID>
 */
export async function getMacroById(req, res) {
    try {
        const userId = req.user.id;
        const macroId = req.params.id;
        const macro = await Macros.getMacroByIdAndUserID(macroId, userId);

        if (!macro) {
            res.status(404).json({ message: 'Macro not Found' });
        }

        res.json(macro);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch macro' });
    }
}

/**
 * Updates an existing macro
 * API: PUT - /api/macros/<ID>
 */
export async function updateMacro(req, res) {
    try {
        const userId = req.user.id;
        const macroId = req.params.id;
        const { name, grams, calories, unit } = req.body;

        if (!name || !calories) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if ((!unit || unit === 'grams') && !grams) {
            return res.status(400).json({ message: 'Grams is required for gram-based macros' });
        }

        const result = await Macros.updateMacroByIdByUserID(macroId, userId, req.body);
        if (result.changes === 0) {
            return res.status(404).json({ message: 'Macro not found' });
        }
        res.json({ message: 'Macro Updated Successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update macro' });
    }
}