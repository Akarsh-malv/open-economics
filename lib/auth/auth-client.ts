"use client";

type MockAuthResult = {
  data: any;
  error: { message: string; status?: number } | null;
};

type MockAuthOptions = {
  onError?: (ctx: any) => void;
  onSuccess?: (ctx: any) => void;
  fetchOptions?: {
    onError?: (ctx: any) => void;
    onSuccess?: (ctx: any) => void;
  };
};

const ok = async (
  _params?: unknown,
  _options?: MockAuthOptions,
): Promise<MockAuthResult> => ({
  data: null,
  error: null,
});

export const authClient = {
  useSession: () => ({
    data: null,
    isPending: false,
    error: null,
  }),
  getSession: ok,
  updateUser: ok,
  revokeSession: ok,
  revokeSessions: ok,
  revokeOtherSessions: ok,
  requestPasswordReset: ok,
  resetPassword: ok,
  changeEmail: ok,
  sendVerificationEmail: ok,
  signOut: ok,
  oneTap: ok,
  isLastUsedLoginMethod: (_method?: string) => false,
  signIn: {
    email: ok,
    social: ok,
  },
  signUp: {
    email: ok,
  },
};
