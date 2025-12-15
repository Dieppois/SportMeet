import type { User } from "./localUserService";

export type ActivityMessage = {
  id: string;
  activityId: string;
  userId: string;
  content: string;
  createdAt: string;
};

export type Activity = {
  id: string;
  title: string;
  description?: string;
  dateTime?: string;
  location?: string;
  maxParticipants?: number;
  creatorUserId: string;
  participantIds: string[];
  createdAt: string;
  updatedAt: string;
  messages: ActivityMessage[];
};

const ACTIVITIES_KEY = "sport-matcher:activities";

function readActivities(): Activity[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(ACTIVITIES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Activity[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeActivities(list: Activity[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(list));
}

function generateId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 11)}`;
}

export function getAllActivities(): Activity[] {
  return readActivities();
}

export function getActivityById(id: string): Activity | null {
  const all = readActivities();
  return all.find((a) => a.id === id) ?? null;
}

export type CreateActivityInput = {
  title: string;
  description?: string;
  dateTime?: string;
  location?: string;
  maxParticipants?: number;
};

export type ActivityResult =
  | { ok: true; activity: Activity }
  | { ok: false; error: string };

export function createActivity(
  input: CreateActivityInput,
  creator: User | null,
): ActivityResult {
  if (!creator) {
    return { ok: false, error: "Tu dois être connecté pour créer une activité." };
  }

  const all = readActivities();
  const now = new Date().toISOString();

  const activity: Activity = {
    id: generateId("a"),
    title: input.title,
    description: input.description,
    dateTime: input.dateTime,
    location: input.location,
    maxParticipants: input.maxParticipants,
    creatorUserId: creator.id,
    participantIds: [creator.id],
    createdAt: now,
    updatedAt: now,
    messages: [],
  };

  const next = [activity, ...all];
  writeActivities(next);

  return { ok: true, activity };
}

export function joinActivity(activityId: string, user: User | null): ActivityResult {
  if (!user) {
    return { ok: false, error: "Tu dois être connecté pour rejoindre une activité." };
  }

  const all = readActivities();
  const index = all.findIndex((a) => a.id === activityId);
  if (index === -1) {
    return { ok: false, error: "Activité introuvable." };
  }

  const activity = all[index];

  if (
    activity.maxParticipants &&
    activity.participantIds.length >= activity.maxParticipants &&
    !activity.participantIds.includes(user.id)
  ) {
    return { ok: false, error: "Cette activité est complète." };
  }

  const updated: Activity = {
    ...activity,
    participantIds: activity.participantIds.includes(user.id)
      ? activity.participantIds
      : [...activity.participantIds, user.id],
    updatedAt: new Date().toISOString(),
  };

  const next = [...all];
  next[index] = updated;
  writeActivities(next);

  return { ok: true, activity: updated };
}

export function addMessageToActivity(
  activityId: string,
  user: User | null,
  content: string,
): ActivityResult {
  if (!user) {
    return { ok: false, error: "Tu dois être connecté pour envoyer un message." };
  }

  if (!content.trim()) {
    return { ok: false, error: "Le message ne peut pas être vide." };
  }

  const all = readActivities();
  const index = all.findIndex((a) => a.id === activityId);
  if (index === -1) {
    return { ok: false, error: "Activité introuvable." };
  }

  const activity = all[index];
  const now = new Date().toISOString();

  const message: ActivityMessage = {
    id: generateId("m"),
    activityId,
    userId: user.id,
    content: content.trim(),
    createdAt: now,
  };

  const updated: Activity = {
    ...activity,
    participantIds: activity.participantIds.includes(user.id)
      ? activity.participantIds
      : [...activity.participantIds, user.id],
    messages: [...activity.messages, message],
    updatedAt: now,
  };

  const next = [...all];
  next[index] = updated;
  writeActivities(next);

  return { ok: true, activity: updated };
}


