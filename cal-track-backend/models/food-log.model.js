import { db } from "../db.js";

export const FoodLog = {
    getTodayByUserId: async (userId) => await db.all(
        `select id, name, calories, protein, carbs, meal_type, logged_at
            from food_log
            where user_id = ?
            and date(logged_at) = date('now', 'localtime')
            order by logged_at asc
        `, [userId]
    ),
    createEntry: async (userId, entry) => await db.run(
        `insert into food_log (user_id, name, calories, protein, carbs, meal_type, logged_at)
            values (?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))
        `, [userId, entry.name, entry.calories, entry.protein ?? null, entry.carbs ?? null, entry.mealType]
    ),
    deleteEntry: async (entryId, userId) => await db.run(
        `delete from food_log where id = ? and user_id = ?
        `, [entryId, userId]
    ),
    getHistorySummary: async (userId) => await db.all(
        `select
            date(logged_at) as date,
            sum(calories) as calories,
            sum(coalesce(protein, 0)) as protein,
            sum(coalesce(carbs, 0)) as carbs
        from food_log
        where user_id = ?
            and date(logged_at) < date('now', 'localtime')
        group by date(logged_at)
        order by date(logged_at) desc
        `, [userId]
    ),
};
