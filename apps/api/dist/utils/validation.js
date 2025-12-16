"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
function normalizeInput(value) {
    if (Array.isArray(value)) {
        return value.map(normalizeInput);
    }
    if (value && typeof value === "object") {
        return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, normalizeInput(val)]));
    }
    if (typeof value === "string") {
        return value.trim();
    }
    return value;
}
function validateBody(schema) {
    return (req, res, next) => {
        const cleanedBody = normalizeInput(req.body);
        const result = schema.safeParse(cleanedBody);
        if (!result.success) {
            return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Invalid request body", details: result.error.flatten() } });
        }
        // @ts-ignore
        req.validatedBody = result.data;
        next();
    };
}
