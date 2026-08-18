import { db } from "../db.js";

/**
 * Definition for all SQL queries related to the users table
 */
export const User = {
    findByUsername: async (username) => db.get('select * from users where username = ?', username),
    findByUsernameWithPasswordHash: async (username) => db.get('select id, username, password_hash from users where username = ?', username),
    create: async (username, email, passwordHash) => db.run('insert into users (username, email, password_hash) values (?, ?, ?)', username, email, passwordHash),
};