"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const health_1 = require("./routes/health");
const auth_routes_1 = require("./routes/auth.routes");
const users_routes_1 = require("./routes/users.routes");
const groups_routes_1 = require("./routes/groups.routes");
const activities_routes_1 = require("./routes/activities.routes");
const error_1 = require("./middlewares/error");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: process.env.FRONT_ORIGINS?.split(",") || ["http://localhost:5174"],
        credentials: true,
    }));
    app.use(express_1.default.json());
    app.use((0, morgan_1.default)("dev"));
    // Routes
    app.use("/api/health", health_1.router);
    app.use("/api/auth", auth_routes_1.router);
    app.use("/api/users", users_routes_1.router);
    app.use("/api/groups", groups_routes_1.router);
    app.use("/api/activities", activities_routes_1.router);
    // 404 and error handlers
    app.use(error_1.notFound);
    app.use(error_1.errorHandler);
    return app;
}
