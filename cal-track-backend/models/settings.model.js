import { db } from "../db.js";

export const Settings = {
    getSettingByUserId: async (userId) => db.get(`
        select * from settings where user_id = ?
    `, [userId]
    ),
    createSettingByUserID: async (userId, setting) => await db.run(
        `insert into settings (user_id, calorie_goal, protein_goal, starting_weight, goal_type)
            values (?, ?, ?, ?, ?)
        `, [userId, setting.calorieGoal, setting.proteinGoal, setting.currentWeight, setting.goalType]
    ),
    updateSettingByIdByUserID: async (userId, setting) => await db.run(
        `update settings set calorie_goal = ?, protein_goal = ?, starting_weight = ?, goal_type = ?
            where user_id = ?
        `, [setting.calorieGoal, setting.proteinGoal, setting.currentWeight, setting.goalType, userId]
    ),
};