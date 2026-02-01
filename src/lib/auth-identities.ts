import type { User } from "@supabase/supabase-js";

export type OAuthProvider = "google" | "apple" | "email";

export function getLinkedProviders(user: User | null | undefined): Set<string> {
  const providers = new Set<string>();
  if (!user) return providers;

  const appProviders = (user.app_metadata as any)?.providers;
  if (Array.isArray(appProviders)) {
    for (const p of appProviders) providers.add(String(p));
  }

  const identities = (user as any)?.identities;
  if (Array.isArray(identities)) {
    for (const identity of identities) {
      if (identity?.provider) providers.add(String(identity.provider));
    }
  }

  return providers;
}

export function hasPasswordIdentity(user: User | null | undefined): boolean {
  const providers = getLinkedProviders(user);
  return providers.has("email");
}
