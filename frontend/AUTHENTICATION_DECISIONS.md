# Authentication Technical Decision Document

## Overview
This document outlines the technical decisions made for implementing user authentication in Trippy.

**Decision Date**: 2026-02-28
**Status**: Approved

---

## Requirements

- User authentication for future features (e.g., "My Plans" list, favorites)
- Maintain current URL-based sharing functionality
- No backend infrastructure (serverless preferred)
- Support for international users
- Simple and maintainable implementation

---

## OAuth Provider Selection

### Options Considered

#### 1. Google OAuth ✅ **SELECTED**
**Pros:**
- Nearly universal coverage (almost every user has a Google account)
- High trust and security
- Already using Google Maps API (easy integration)
- Standard support in NextAuth.js
- Works globally
- Free to use

**Cons:**
- Single provider (no fallback)

**Decision**: Selected as the primary and only OAuth provider for MVP.

#### 2. LINE OAuth
**Pros:**
- 95 million users in Japan
- Most familiar for Japanese users
- Good for mobile users
- Easy sharing via LINE app

**Cons:**
- Japan-specific (limited international use)
- Additional implementation cost
- Less common outside Japan

**Decision**: Not selected for MVP. Can be added later if Japanese market becomes primary focus.

#### 3. Apple Sign In
**Pros:**
- Required for iOS App Store (if we build native app)
- Privacy-focused users prefer it
- Good mobile experience

**Cons:**
- iOS/macOS only (no Android)
- Only useful if building native iOS app
- Additional implementation complexity

**Decision**: Not selected for MVP. Will be required only if we publish to iOS App Store.

#### 4. GitHub OAuth
**Pros:**
- Easy to implement
- Good for developer audience

**Cons:**
- Developer-focused (not suitable for general travel app users)
- Limited user base

**Decision**: Not selected. Not suitable for general travel app audience.

#### 5. Facebook/Meta OAuth
**Pros:**
- Large user base
- Social sharing features

**Cons:**
- Privacy concerns
- Declining trust
- Many users avoid Facebook login

**Decision**: Not selected due to trust issues.

---

## Authentication Library Selection

### Options Considered

#### 1. NextAuth.js (Auth.js) v5 ✅ **SELECTED**
**Pros:**
- Official recommendation for Next.js
- Free and open source
- No backend required (serverless compatible)
- Built-in session management
- Native Google OAuth support
- Lightweight and simple
- Large community and good documentation
- Type-safe with TypeScript

**Cons:**
- Basic features only (no advanced UI components)
- Manual session management in client components

**Decision**: Selected for its simplicity, cost (free), and perfect fit with our serverless architecture.

#### 2. Supabase Auth
**Pros:**
- Includes PostgreSQL database
- Rich user management features
- Could also store trip plans
- Good documentation

**Cons:**
- Requires backend service (not serverless)
- Monthly cost ($25+ for production)
- Overkill if we only need authentication
- Additional infrastructure to maintain

**Decision**: Not selected. Too complex for our needs since we're keeping URL-based trip storage.

#### 3. Firebase Auth
**Pros:**
- Google service (same as Maps API)
- Firestore database included
- Real-time sync capabilities
- Good mobile SDK

**Cons:**
- Requires GCP setup and billing
- Vendor lock-in
- More complex than needed
- Cost scales with usage

**Decision**: Not selected. Too heavy for our simple authentication needs.

#### 4. Clerk
**Pros:**
- Most modern UI components
- Beautiful pre-built components
- Easy to implement
- Great developer experience

**Cons:**
- Paid service ($25+/month required)
- Vendor lock-in
- Overkill for simple Google OAuth

**Decision**: Not selected due to cost and complexity.

---

## Data Storage Strategy

### Options Considered

#### 1. URL-based Storage (Current) ✅ **SELECTED**
**Pros:**
- No backend required
- Simple and maintainable
- Already implemented and working
- Free (no infrastructure cost)
- Trip plans are always shareable
- No database migrations or backups needed

**Cons:**
- Limited to URL length (~2000 chars in practice)
- No cross-device sync
- Can't implement "My Plans" server-side list

**Enhancement for Authenticated Users:**
- Store references to trip plan URLs in localStorage
- Display "My Plans" list from localStorage
- Still shareable via URL
- No backend required

**Decision**: Keep URL-based storage. Authentication is for optional features (like "My Plans" list), not required for core functionality.

#### 2. Database Storage (Supabase/Firebase)
**Pros:**
- Store unlimited trips
- Cross-device synchronization
- Server-side "My Plans" management
- Can add social features later

**Cons:**
- Requires backend service
- Monthly cost
- More complex implementation
- Database migrations and backups
- Changes fundamental architecture

**Decision**: Not selected for MVP. Can be added later if needed, but URL-based storage works well for our use case.

---

## Implementation Plan

### Phase 1: Authentication Setup
1. Install NextAuth.js v5
2. Configure Google OAuth provider
3. Set up authentication routes
4. Add sign in/out UI components
5. Implement session management

### Phase 2: User Features (Optional)
1. Add "My Plans" page (localStorage-based)
2. Allow users to save trip plan URLs locally
3. Display saved plans in user dashboard
4. Add plan nicknames/descriptions

### Phase 3: Future Enhancements (if needed)
1. Add more OAuth providers (LINE, Apple)
2. Migrate to database storage (if URL limits become issue)
3. Add social features (public plans, following)

---

## Security Considerations

- Use HTTP-only cookies for session tokens
- Implement CSRF protection
- Store only necessary user data (email, name, profile picture)
- No sensitive data in URLs
- Comply with GDPR/privacy regulations
- Session timeout (30 days)

---

## Cost Analysis

| Solution | Monthly Cost | Setup Cost | Maintenance |
|----------|-------------|------------|-------------|
| **NextAuth.js + URL Storage** | **$0** | **Low** | **Low** |
| Clerk | $25+ | Low | Low |
| Supabase Auth + DB | $25+ | Medium | Medium |
| Firebase Auth + DB | ~$20+ | Medium | Medium |

**Decision**: NextAuth.js with URL storage = $0/month, simplest to maintain.

---

## Technical Stack

- **Authentication**: NextAuth.js v5 (Auth.js)
- **OAuth Provider**: Google OAuth 2.0
- **Session Storage**: HTTP-only cookies
- **Trip Plan Storage**: URL parameters (Base64 encoded)
- **User Data Storage**: None required (session only)
- **Optional Features**: localStorage for "My Plans" list

---

## Success Criteria

✅ Users can sign in with Google
✅ Session persists across page refreshes
✅ Sign out works correctly
✅ No backend infrastructure required
✅ Current URL-based sharing still works
✅ Zero monthly cost
✅ Simple to maintain

---

## Future Considerations

### When to Add Database Storage
Consider migrating to database storage if:
- Trip plans commonly exceed URL length limits
- Users request cross-device synchronization
- Need to implement social features
- Want to add plan analytics

### When to Add More OAuth Providers
Consider adding LINE if:
- Japanese market becomes primary focus
- Users request it

Consider adding Apple if:
- Building native iOS app
- Publishing to App Store

---

## References

- [NextAuth.js Documentation](https://authjs.dev/)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Authentication Best Practices](https://nextjs.org/docs/app/building-your-application/authentication)

---

## Revision History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-02-28 | 1.0 | Initial decision document | Development Team |
