

## Google and Apple Sign-In Implementation Plan

### Overview
I'll configure both Google and Apple OAuth using Lovable Cloud's managed authentication (no client IDs needed), add an Apple sign-in button to the Auth page, and update the Account page to allow linking both providers.

### What Will Change

**1. Configure Social Auth Providers**
- Use the `configure-social-auth` tool to enable Google OAuth with managed credentials
- Use the `configure-social-auth` tool to enable Apple OAuth with managed credentials
- This will automatically regenerate the `src/integrations/lovable/index.ts` file with proper support

**2. Update Auth Page (`src/pages/Auth.tsx`)**
- Add an Apple icon component (similar to the Google icon)
- Add Apple loading state
- Add `handleAppleSignIn` function using `lovable.auth.signInWithOAuth("apple")`
- Display both Google and Apple buttons side-by-side or stacked with nice styling
- Both buttons will use the redirect: `${window.location.origin}/auth`

**3. Update Account Page (`src/pages/Account.tsx`)**
- Add Apple icon component
- Add check for Apple linked status: `hasAppleLinked`
- Add `handleLinkApple` function
- Update the "Connected Accounts" section to show both:
  - Google (linked/not linked with action button)
  - Apple (linked/not linked with action button)
- Add translations for Apple-related text

### Redirect URLs
The managed OAuth will automatically handle redirects. The code will use:
- Auth page: `${window.location.origin}/auth` 
- Account page (for linking): `${window.location.origin}/account`

This works for:
- Preview: `https://id-preview--2bc3364c-d83e-406f-a773-91f9912a69fc.lovable.app`
- Published: `https://sirat.lovable.app`
- Custom domain: `https://sir-at.app` (if configured in backend)

### Technical Details

```text
Auth Page Button Layout:
+----------------------------------+
|   [Google Icon] Continue with Google   |
+----------------------------------+
|   [Apple Icon]  Continue with Apple    |
+----------------------------------+
              or
+----------------------------------+
|        Email/Password Form       |
+----------------------------------+
```

```text
Account Page - Connected Accounts Section:
+------------------------------------------+
|  Connected Accounts                      |
+------------------------------------------+
|  [Google Icon] Google    [✓ Linked] or [Link] |
|  [Apple Icon]  Apple     [✓ Linked] or [Link] |
+------------------------------------------+
```

### Files to Modify
1. `src/pages/Auth.tsx` - Add Apple sign-in button and handler
2. `src/pages/Account.tsx` - Add Apple linking capability

### Important Notes
- The managed OAuth solution handles all the OAuth configuration automatically
- No client IDs or secrets are required from you
- Both providers can be used independently (sign up with Google, link Apple later, etc.)
- Users who signed up with email can link both Google and Apple to their account

