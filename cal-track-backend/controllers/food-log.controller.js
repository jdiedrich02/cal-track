import { FoodLog } from "../models/food-log.model.js";
import { Macros } from "../models/macros.model.js";

/**
 * Gets today's food log entries for the authenticated user
 * API: GET /api/food-log/today
 */
export async function getTodayLog(req, res) {
    try {
        const userId = req.user.id;
        const entries = await FoodLog.getTodayByUserId(userId);
        res.json(entries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch food log' });
    }
}

/**
 * Creates a new food log entry
 * Looks up the macro by macroId, scales nutrition by the provided grams, then inserts.
 * API: POST /api/food-log/create
 */
export async function createLogEntry(req, res) {
    try {
        const userId = req.user.id;
        const { macroId, grams, mealType } = req.body;

        if (!macroId || !mealType) {
            return res.status(400).json({ message: 'Macro and Meal Type are required' });
        }

        const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
        if (!validMealTypes.includes(mealType)) {
            return res.status(400).json({ message: 'Meal Type must be breakfast, lunch, dinner, or snack' });
        }

        const macro = await Macros.getMacroByIdAndUserID(macroId, userId);
        if (!macro) {
            return res.status(404).json({ message: 'Macro not found' });
        }

        const ratio = macro.unit === 'quantity' ? 1 : grams / macro.grams;
        const entry = {
            name: macro.name,
            calories: Math.round(macro.calories * ratio),
            protein: macro.protein != null ? Math.round(macro.protein * ratio) : null,
            carbs: macro.carbs != null ? Math.round(macro.carbs * ratio) : null,
            mealType: mealType
        };

        await FoodLog.createEntry(userId, entry);
        res.status(201).json({ message: 'Entry added Successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create food log entry' });
    }
}

/**
 * Returns per-day calorie/protein/carbs totals for all days before today
 * API: GET /api/food-log/history
 */
export async function getHistorySummary(req, res) {
    try {
        const userId = req.user.id;
        const summary = await FoodLog.getHistorySummary(userId);
        res.json(summary);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch history' });
    }
}

/**
 * Deletes a food log entry
 * API: DELETE /api/food-log/:id
 */
export async function deleteLogEntry(req, res) {
    try {
        const userId = req.user.id;
        const entryId = req.params.id;

        if (!entryId) {
            return res.status(400).json({ message: 'Entry ID is required' });
        }

        const result = await FoodLog.deleteEntry(entryId, userId);
        if (result.changes === 0) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        res.json({ message: 'Entry deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete food log entry' });
    }
}
