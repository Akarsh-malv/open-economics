import "server-only";

const mockUser = {
  id: "mock-user",
  name: "Open Economics Learner",
  email: "learner@example.com",
  emailVerified: true,
  createdAt: new Date("2026-06-01T12:00:00.000Z"),
  updatedAt: new Date("2026-06-01T12:00:00.000Z"),
  image: null,
};

export const mockSession = {
  user: mockUser,
  session: {
    id: "mock-session",
    token: "mock-session-token",
    userId: mockUser.id,
    expiresAt: new Date("2099-01-01T00:00:00.000Z"),
    createdAt: new Date("2026-06-01T12:00:00.000Z"),
    updatedAt: new Date("2026-06-01T12:00:00.000Z"),
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36",
    ipAddress: "127.0.0.1",
  },
};

export const auth = {
  api: {
    getSession: async (_params?: unknown) => mockSession,
    listUserAccounts: async (_params?: unknown) => [
      {
        id: "mock-account",
        providerId: "credential",
        accountId: mockUser.email,
        createdAt: new Date("2026-06-01T12:00:00.000Z"),
        updatedAt: new Date("2026-06-01T12:00:00.000Z"),
      },
    ],
    listSessions: async (_params?: unknown) => [mockSession.session],
  },
} as const;
