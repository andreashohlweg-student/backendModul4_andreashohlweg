import { randomUUID } from "node:crypto";

const sessions = new Map<string, string>();

export const createSession = (username: string): string => {
  const sessionId = randomUUID();

  sessions.set(sessionId, username);

  return sessionId;
};

export const getUsernameBySession = (
  sessionId: string,
): string | undefined => {
  return sessions.get(sessionId);
};

export const deleteSession = (sessionId: string): void => {
  sessions.delete(sessionId);
};