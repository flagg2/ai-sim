import { z } from "zod";

const publicEnvSchema = z.object({
  stripe: z.object({
    publicKey: z.string(),
    couponIds: z.object({
      fullDiscount: z.string(),
    }),
    priceIds: z.object({
      subscription: z.string(),
    }),
  }),
  webUrl: z.string(),
  supabase: z.object({
    url: z.string(),
    anonKey: z.string(),
  }),
  server: z.object({
    url: z.string().default("http://localhost:3000"),
  }),
});

export const publicEnv = publicEnvSchema.parse({
  stripe: {
    publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!,
    couponIds: {
      fullDiscount: process.env.NEXT_PUBLIC_STRIPE_FULL_DISCOUNT_COUPON_ID!,
    },
    priceIds: {
      subscription: process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID!,
    },
  },
  webUrl: process.env.NEXT_PUBLIC_WEB_URL!,
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  server: {
    url: process.env.NEXT_PUBLIC_SERVER_URL!,
  },
});
