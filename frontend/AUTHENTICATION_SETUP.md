# Authentication Setup Guide

This guide explains how to set up Google OAuth authentication for Trippy.

## Prerequisites

- Google Cloud Platform (GCP) account
- Existing Google Cloud project (or create a new one)
- Trippy frontend application set up

## Step 1: Create OAuth 2.0 Credentials

### 1.1 Go to Google Cloud Console

1. Navigate to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (the same one used for Google Maps API)
3. Go to **APIs & Services** > **Credentials**

### 1.2 Configure OAuth Consent Screen

Before creating credentials, you need to configure the OAuth consent screen:

1. Click **OAuth consent screen** in the left sidebar
2. Select **External** user type (unless you have Google Workspace)
3. Click **Create**

4. Fill in the required information:
   - **App name**: Trippy
   - **User support email**: Your email address
   - **App logo**: (Optional) Upload your app logo
   - **App domain**: Your production domain (e.g., `https://trippy.example.com`)
   - **Authorized domains**: Add your domain (e.g., `example.com`)
   - **Developer contact information**: Your email address

5. Click **Save and Continue**

6. **Scopes**: Click **Add or Remove Scopes**
   - Add `.../auth/userinfo.email`
   - Add `.../auth/userinfo.profile`
   - Click **Update** and then **Save and Continue**

7. **Test users** (for development):
   - Add your email address as a test user
   - Click **Save and Continue**

8. Review and click **Back to Dashboard**

### 1.3 Create OAuth 2.0 Client ID

1. Go back to **Credentials** tab
2. Click **+ Create Credentials** > **OAuth client ID**
3. Select **Application type**: **Web application**
4. Enter a **Name**: e.g., "Trippy Web Client"

5. **Authorized JavaScript origins**:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`

6. **Authorized redirect URIs**:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`

7. Click **Create**

8. **Save your credentials**:
   - Copy the **Client ID** (looks like: `123456789-xxxxx.apps.googleusercontent.com`)
   - Copy the **Client secret** (looks like: `GOCSPX-xxxxxxxxxxxxxxx`)

## Step 2: Generate AUTH_SECRET

The `AUTH_SECRET` is used to encrypt session cookies and tokens.

### Option 1: Using OpenSSL (Recommended)

```bash
openssl rand -base64 32
```

### Option 2: Using Node.js

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Option 3: Online Generator

Visit [generate-secret.vercel.app](https://generate-secret.vercel.app/32) (NextAuth's official tool)

Save the generated secret - you'll need it in the next step.

## Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your credentials:

   ```env
   # NextAuth Configuration
   AUTH_SECRET=your_generated_secret_from_step_2
   
   # Google OAuth Credentials
   AUTH_GOOGLE_ID=your_client_id_from_step_1
   AUTH_GOOGLE_SECRET=your_client_secret_from_step_1
   
   # Other existing variables...
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key
   ```

3. **Never commit `.env.local` to version control!**

## Step 4: Test Authentication

### 4.1 Start Development Server

```bash
npm run dev
```

### 4.2 Test Sign In

1. Open http://localhost:3000
2. Click the "Sign in with Google" button
3. You should be redirected to Google's sign-in page
4. Sign in with a test user account (added in Step 1.2)
5. Grant permissions
6. You should be redirected back to the app
7. Your profile picture and name should appear in the header

### 4.3 Test Sign Out

1. Click the "Sign Out" button
2. You should be signed out
3. The "Sign in with Google" button should reappear

## Step 5: Production Deployment

### 5.1 Update OAuth Credentials

1. Go back to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client ID
3. Add production URLs:
   - **Authorized JavaScript origins**: `https://your-production-domain.com`
   - **Authorized redirect URIs**: `https://your-production-domain.com/api/auth/callback/google`
4. Click **Save**

### 5.2 Set Environment Variables in Production

Add these environment variables to your hosting platform (Vercel, Netlify, etc.):

```env
AUTH_SECRET=your_generated_secret
AUTH_GOOGLE_ID=your_client_id
AUTH_GOOGLE_SECRET=your_client_secret
```

**Important**: Use a different `AUTH_SECRET` for production than development!

### 5.3 Verify OAuth Consent Screen

For production use with external users:

1. Go to **OAuth consent screen** in Google Cloud Console
2. Click **Publish App** to make it available to all users
3. (Optional) Go through Google's verification process for a verified badge

## Troubleshooting

### Error: "redirect_uri_mismatch"

**Cause**: The redirect URI doesn't match what's configured in Google Cloud Console.

**Solution**:
1. Check that the redirect URI in Google Cloud Console exactly matches: `http://localhost:3000/api/auth/callback/google` (for dev)
2. Make sure there are no trailing slashes
3. Check for http vs https mismatch

### Error: "Access blocked: Trippy has not completed the Google verification process"

**Cause**: App is in testing mode and user is not a test user.

**Solution**:
1. Go to OAuth consent screen
2. Add the user's email to "Test users"
3. Or publish the app for all users

### Error: "invalid_client"

**Cause**: Client ID or Client Secret is incorrect.

**Solution**:
1. Double-check your `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` in `.env.local`
2. Make sure there are no extra spaces or line breaks
3. Regenerate credentials if necessary

### Sign in works but session doesn't persist

**Cause**: `AUTH_SECRET` is not set or is invalid.

**Solution**:
1. Generate a new `AUTH_SECRET` using `openssl rand -base64 32`
2. Add it to `.env.local`
3. Restart the development server

### "Sign in with Google" button doesn't work

**Cause**: Client-side JavaScript error or missing SessionProvider.

**Solution**:
1. Check browser console for errors
2. Make sure `AuthProvider` is wrapping your app in `layout.tsx`
3. Clear browser cache and cookies

## Security Best Practices

1. **Never commit secrets**: Always use `.env.local` and add it to `.gitignore`
2. **Use different secrets**: Use different `AUTH_SECRET` for development and production
3. **Rotate secrets regularly**: Change your `AUTH_SECRET` periodically
4. **Limit OAuth scopes**: Only request the minimum scopes needed (email, profile)
5. **Enable 2FA**: Use two-factor authentication on your Google account
6. **Monitor usage**: Regularly check the Google Cloud Console for unusual activity
7. **Restrict APIs**: In Google Cloud Console, restrict your OAuth credentials to specific domains

## Additional Resources

- [NextAuth.js Documentation](https://authjs.dev/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth.js Google Provider](https://authjs.dev/getting-started/providers/google)
- [Google Cloud Console](https://console.cloud.google.com/)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the NextAuth.js documentation
3. Check that all environment variables are correctly set
4. Verify your Google Cloud Console configuration matches this guide
