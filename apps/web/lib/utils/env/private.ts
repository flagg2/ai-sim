import { z } from "zod";

const privateEnvSchema = z.object({
  stripe: z.object({
    secretKey: z.string(),
  }),
  promoCodeSecret: z.string(),
  supabase: z.object({
    serviceRoleKey: z.string(),
  }),
});

export const privateEnv = privateEnvSchema.parse({
  promoCodeSecret: process.env.PROMO_CODE_SECRET!,
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
  },
  supabase: {
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },
});
