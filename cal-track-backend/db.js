import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const db = await open({
    filename: "./cal.db",
    driver: sqlite3.Database
});

// Create tables if they do not exist
// User Table
await db.exec(`
    create table if not exists users (
        id integer primary key autoincrement,
        username text unique not null,
        email text unique not null,
        password_hash text not null,
        created_at datetime default current_timestamp
    );
`);

// Settings Table
await db.exec(`
    create table if not exists settings (
        id integer primary key autoincrement,
        user_id integer not null,
        calorie_goal INTEGER NOT NULL,
        protein_goal INTEGER,
        starting_weight REAL,
        goal_type TEXT DEFAULT 'maintain'
    );
`);

// Macros Table
await db.exec(`
    create table if not exists macros (
        id integer primary key autoincrement,
        user_id integer not null,
        name text unique not null,
        unit text not null default 'grams' check(unit in ('grams', 'quantity')),
        grams integer,
        calories integer not null,
        protein integer,
        carbs integer
    );
`);

// Food Log Table
await db.exec(`
    create table if not exists food_log (
        id integer primary key autoincrement,
        user_id integer not null,
        name text not null,
        calories integer not null,
        protein integer,
        carbs integer,
        meal_type text not null check(meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
        logged_at datetime default current_timestamp
    );
`);