import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // Same-origin Next.js app — baseURL is optional but explicit is safer
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [inferAdditionalFields(), jwtClient()],
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
