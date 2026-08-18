import { db } from "../db.js";

export const Macros = {
    getAllMacros: async (userId) => await db.all(`
        select id, name, unit, grams, calories, protein, carbs
            from macros
            where user_id = ?
        `, [userId]
    ),
    getMacroByIdAndUserID: async (macroId, userId) => await db.get(
        `select id, name, unit, grams, calories, protein, carbs
            from macros
            where user_id = ?
            and id = ?
        `, [userId, macroId]
    ),
    createMacroByUserId: async (userId, macro) => await db.run(
        `insert into macros (user_id, name, unit, grams, calories, protein, carbs)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [userId, macro.name, macro.unit ?? 'grams', macro.unit === 'quantity' ? null : macro.grams, macro.calories, macro.protein, macro.carbs]
    ),
    updateMacroByIdByUserID: async (macroId, userId, macro) => await db.run(
        `update macros set name = ?, unit = ?, grams = ?, calories = ?, protein = ?, carbs = ?
            where id = ?
            and user_id = ?
        `, [macro.name, macro.unit ?? 'grams', macro.unit === 'quantity' ? null : macro.grams, macro.calories, macro.protein, macro.carbs, macroId, userId]
    ),
    deleteMacroById: async (macroId, userId) => await db.run(
        `delete from macros
            where id = ? AND user_id = ?
        `, [macroId, userId]
    ),
};