import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from './routes/auth.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import macrosRoutes from './routes/macros.routes.js';
import foodLogRoutes from './routes/food-log.routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
const port = 3000;

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/macros", macrosRoutes);
app.use("/api/food-log", foodLogRoutes);

// Global error handler
app.use((error, _, res, __) => {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});