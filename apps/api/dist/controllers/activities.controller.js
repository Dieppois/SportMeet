"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActivityController = createActivityController;
exports.updateActivityController = updateActivityController;
exports.deleteActivityController = deleteActivityController;
exports.cancelActivityController = cancelActivityController;
exports.getActivityController = getActivityController;
exports.enrollController = enrollController;
exports.unenrollController = unenrollController;
exports.participantsController = participantsController;
exports.remainingSpotsController = remainingSpotsController;
exports.rateOrganizerController = rateOrganizerController;
exports.listGroupActivitiesController = listGroupActivitiesController;
const activities_service_1 = require("../services/activities.service");
async function createActivityController(req, res, next) {
    try {
        const userId = req.user.id;
        const activity = await (0, activities_service_1.createActivity)(userId, req.validatedBody || req.body);
        res.status(201).json({ activity });
    }
    catch (e) {
        next(e);
    }
}
async function updateActivityController(req, res, next) {
    try {
        const userId = req.user.id;
        const id = Number(req.params.id);
        const activity = await (0, activities_service_1.updateActivity)(userId, id, req.validatedBody || req.body);
        res.json({ activity });
    }
    catch (e) {
        next(e);
    }
}
async function deleteActivityController(req, res, next) {
    try {
        const userId = req.user.id;
        const id = Number(req.params.id);
        await (0, activities_service_1.deleteActivity)(userId, id);
        res.json({ ok: true });
    }
    catch (e) {
        next(e);
    }
}
async function cancelActivityController(req, res, next) {
    try {
        const userId = req.user.id;
        const id = Number(req.params.id);
        const activity = await (0, activities_service_1.cancelActivity)(userId, id);
        res.json({ activity });
    }
    catch (e) {
        next(e);
    }
}
async function getActivityController(req, res, next) {
    try {
        const id = Number(req.params.id);
        const activity = await (0, activities_service_1.getActivityById)(id);
        if (!activity)
            return res.status(404).json({ error: { code: "ACTIVITY_NOT_FOUND", message: "Activity not found" } });
        res.json({ activity });
    }
    catch (e) {
        next(e);
    }
}
async function enrollController(req, res, next) {
    try {
        await (0, activities_service_1.enroll)(req.user.id, Number(req.params.id));
        res.json({ ok: true });
    }
    catch (e) {
        next(e);
    }
}
async function unenrollController(req, res, next) {
    try {
        await (0, activities_service_1.unenroll)(req.user.id, Number(req.params.id));
        res.json({ ok: true });
    }
    catch (e) {
        next(e);
    }
}
async function participantsController(req, res, next) {
    try {
        const members = await (0, activities_service_1.getActivityParticipants)(Number(req.params.id));
        res.json({ participants: members });
    }
    catch (e) {
        next(e);
    }
}
async function remainingSpotsController(req, res, next) {
    try {
        const remaining = await (0, activities_service_1.remainingSpots)(Number(req.params.id));
        res.json({ remaining });
    }
    catch (e) {
        next(e);
    }
}
async function rateOrganizerController(req, res, next) {
    try {
        const activityId = Number(req.params.id);
        const { score, comment } = req.validatedBody || req.body;
        await (0, activities_service_1.rateOrganizer)(activityId, req.user.id, score, comment || null);
        res.json({ ok: true });
    }
    catch (e) {
        next(e);
    }
}
async function listGroupActivitiesController(req, res, next) {
    try {
        const groupId = Number(req.params.groupId);
        const activities = await (0, activities_service_1.listGroupActivities)(groupId);
        res.json({ activities });
    }
    catch (e) {
        next(e);
    }
}
