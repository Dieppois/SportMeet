"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFound = notFound;
// Standard JSON error format middleware
function errorHandler(err, _req, res, _next) {
    const status = err.status || 500;
    const code = err.code || "INTERNAL_ERROR";
    const message = err.message || "Internal Server Error";
    const details = err.details;
    if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error("Error: ", err);
    }
    res.status(status).json({ error: { code, message, details } });
}
function notFound(_req, res) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Resource not found" } });
}
