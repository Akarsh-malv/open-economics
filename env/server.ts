import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnv = createEnv({
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.NODE_ENV === "test" ||
    process.env.NODE_ENV === "development",
  server: {
    NGROK_URL: z.url().optional().or(z.literal("")),
    DATABASE_URL: z
      .url()
      .min(10)
      .refine((val) => val.startsWith("postgresql://"), {
        message: "DATABASE_URL must start with 'postgresql://'",
      })
      .default("postgresql://mock:mock@localhost:5432/mock"),
    DB_HOST: z.string().optional(),
    DB_PORT: z.coerce.number().optional(),
    DB_PASSWORD: z.string().optional(),
    DB_USER: z.string().optional(),
    DB_NAME: z.string().optional(),

    BETTER_AUTH_SECRET: z.string().min(16).default("mock-auth-secret-local-only"),
    BETTER_AUTH_URL: z.url().min(1).default("http://localhost:3000"),

    RESEND_API_KEY: z
      .string()
      .min(1)
      .refine((val) => val.startsWith("re"), {
        message: "RESEND_API_KEY must start with 're'",
      })
      .default("re_mock"),
    RESEND_FROM_EMAIL: z.email(
      "RESEND_FROM_EMAIL must be a valid email address",
    ).default("noreply@example.com"),

    PAYLOAD_SECRET: z.string().min(16).default("mock-payload-secret"),
    MONGO_URL: z
      .string()
      .min(1)
      .refine(
        (val) =>
          val.startsWith("mongodb://") || val.startsWith("mongodb+srv://"),
        {
          message: "MONGO_URL must start with 'mongodb://' or 'mongodb+srv://'",
        },
      )
      .default("mongodb://localhost:27017/mock"),

    ENABLE_S3: z.coerce.boolean().default(false),
    S3_BUCKET: z.string().optional(),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET: z.string().optional(),
    S3_ENDPOINT: z.url().optional().or(z.literal("")),

    MUX_TOKEN_ID: z.string().min(1).default("mock"),
    MUX_TOKEN_SECRET: z.string().min(1).default("mock"),
    MUX_WEBHOOK_SIGNING_SECRET: z.string().min(1).default("mock"),
    MUX_JWT_KEY_ID: z.string().min(1).default("mock"),
    MUX_JWT_KEY: z.string().min(1).default("mock"),

    STRIPE_SECRET_KEY: z
      .string()
      .min(10)
      .refine((val) => val.startsWith("sk"), {
        message: "STRIPE_SECRET_KEY must start with 'sk'",
      })
      .default("sk_test_mock"),
    STRIPE_WEBHOOK_SECRET: z
      .string()
      .min(10)
      .refine((val) => val.startsWith("whsec"), {
        message: "STRIPE_WEBHOOK_SECRET must start with 'whsec'",
      })
      .default("whsec_mock"),

    UPSTASH_REDIS_REST_URL: z.url().default("http://localhost:6379"),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1).default("mock"),

    GOOGLE_CLIENT_SECRET: z.string().min(1).default("mock"),
  },
  experimental__runtimeEnv: {},
});

// export type ServerEnv = typeof serverEnv;
