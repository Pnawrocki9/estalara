# Logo Persistence Guide for Netlify Deployment

## Overview
This guide explains how to ensure your logo persists correctly when deploying to Netlify.

## Two Methods for Logo Management

### Method 1: Using Asset Files (RECOMMENDED for Netlify)

This is the recommended approach for Netlify deployments as it ensures your logo is always available.

**Steps:**
1. Place your logo file in the `assets/` directory
2. Use a simple filename without spaces (e.g., `EstalaraLogo.png`, `logo.svg`)
3. In the CMS Settings (Admin or CMS panel), enter the relative path:
   - Example: `assets/EstalaraLogo.png`
   - Example: `assets/logo.svg`

**Benefits:**
- ✅ Logo file is part of your git repository
- ✅ Deploys automatically with your site to Netlify
- ✅ Works across all browsers and devices
- ✅ No localStorage size limitations
- ✅ Logo loads faster (no base64 encoding)

**Available Logo Files:**
- `assets/logo.svg` (current default)
- `assets/EstalaraLogo.png`
- `assets/EstalaraLogo-alt.png`

### Method 2: File Upload (Creates Data URL)

When you upload a logo file through the CMS:
1. The file is converted to a base64 data URL
2. Stored in browser's localStorage
3. Works immediately but has limitations

**Limitations:**
- ⚠️ Only stored in your browser's localStorage
- ⚠️ Other users/devices won't see your uploaded logo
- ⚠️ Can be lost if localStorage is cleared
- ⚠️ Increases localStorage size (max ~5-10MB per domain)
- ⚠️ Not recommended for production sites

**When to use:**
- Quick testing during development
- Temporary logo changes
- When you can't modify the assets folder

## How to Change Your Logo on Netlify

### Option A: Update via CMS (Easiest)
1. Go to Settings in your CMS or Admin panel
2. Scroll to "Upload Logo"
3. In the URL field, enter: `assets/EstalaraLogo.png` (or your logo filename)
4. Click "Save Changes"
5. Refresh your website pages to see the change

### Option B: Add New Logo File
1. Add your logo file to the `assets/` folder in your repository
2. Make sure the filename has no spaces (use hyphens or camelCase)
   - ✅ Good: `mylogo.png`, `my-logo.png`, `MyLogo.png`
   - ❌ Bad: `my logo.png`, `My Logo.png`
3. Commit and push to git
4. Update the logo URL in CMS settings: `assets/mylogo.png`
5. Deploy to Netlify

## Troubleshooting

### Logo not showing after deployment
**Problem:** Logo shows locally but not on Netlify
**Solution:** 
- Make sure you're using a relative path like `assets/logo.png`, not a data URL
- Verify the logo file exists in the `assets/` folder
- Check that the filename matches exactly (case-sensitive)
- Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Logo has broken URL with %20
**Problem:** Logo URL contains `%20` or other encoded characters
**Solution:**
- Rename your logo file to remove spaces
- Update the logo URL in CMS settings
- Example: rename `Estalara Logo.png` to `EstalaraLogo.png`

### Logo changes not persisting
**Problem:** Logo URL resets after page refresh
**Solution:**
- Make sure you clicked "Save Changes" in the CMS
- Check browser console for localStorage errors
- Verify you're not in private/incognito mode

### Logo works in CMS but not on website
**Problem:** Preview works in CMS but not on actual pages
**Solution:**
- Refresh the website pages after saving changes
- The CMS stores changes in localStorage which needs to be read by each page
- Close and reopen browser if changes don't appear

## Best Practices

1. **Always use relative paths** for production: `assets/logo.png`
2. **Keep logo files small**: Optimize images before uploading (max 200KB recommended)
3. **Use appropriate formats**:
   - SVG for scalable graphics (best for logos)
   - PNG for logos with transparency
   - JPG for photographic logos
4. **Test on Netlify preview** before final deployment
5. **Version control**: Keep logo files in git repository

## Current Configuration

- Default logo: `assets/logo.svg`
- Logo files available:
  - `assets/logo.svg`
  - `assets/EstalaraLogo.png`
  - `assets/EstalaraLogo-alt.png`
- Logo is loaded by: `cms-integration.js` (line 311-364)
- Logo path stored in: localStorage key `estalaraAdminData.logoUrl`

## Need Help?

If you encounter issues:
1. Check browser console for errors (F12)
2. Verify localStorage contains your settings
3. Ensure logo file exists in assets folder
4. Try clearing cache and hard refresh
5. Check Netlify deployment logs for errors
