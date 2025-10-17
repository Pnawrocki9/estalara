# Pricing Section & Navigation Fix

## Problem
1. In CMS, the Pricing page shows "No sections found for this page"
2. On the frontend, "New Link" appears in the navigation instead of "Pricing"

## Root Cause
The stored data in localStorage/Firebase doesn't have:
- Properly initialized `pageStructures` for the Pricing page
- Correct navigation items (may have "New Link" instead of "Pricing")

## Solution

### Quick Fix (Recommended)
1. Open the file: `fix-pricing-data.html` in your browser
2. Click the "🚀 Fix Data Now" button
3. Refresh the CMS page
4. Go to Page Structure → Select "Pricing"
5. You should now see all 6 pricing sections

### What the Fix Does
- Initializes `pageStructures` object if missing
- Adds Pricing page structure with 6 sections:
  1. Hero Section
  2. Pricing Cards
  3. How It Works
  4. Value Proposition
  5. FAQ Section
  6. CTA Section
- Removes any "New Link" items from navigation
- Ensures "Pricing" link exists with correct label and URL
- Sets proper visibility for all navigation items

### Manual Fix (Alternative)
If you prefer to manually fix the data:

1. Open browser console on any page
2. Run this code:
```javascript
const data = JSON.parse(localStorage.getItem('estalaraAdminData') || '{"version":4}');
data.version = 4;
data.pageStructures = data.pageStructures || {};
data.pageStructures.pricing = [
  { id: 'hero', type: 'hero', title: 'Hero Section', visible: true, order: 1, editable: false },
  { id: 'pricing', type: 'section', title: 'Pricing Cards', visible: true, order: 2, editable: true },
  { id: 'how-it-works', type: 'section', title: 'How It Works', visible: true, order: 3, editable: true },
  { id: 'value-proposition', type: 'section', title: 'Value Proposition', visible: true, order: 4, editable: true },
  { id: 'faq', type: 'section', title: 'FAQ Section', visible: true, order: 5, editable: true },
  { id: 'cta', type: 'section', title: 'CTA Section', visible: true, order: 6, editable: true }
];
data.navigation = data.navigation || [];
data.navigation = data.navigation.filter(item => item.label !== 'New Link');
const pricingLink = data.navigation.find(item => item.label === 'Pricing');
if (!pricingLink) {
  const maxId = Math.max(0, ...data.navigation.map(n => n.id || 0));
  data.navigation.push({
    id: maxId + 1,
    label: 'Pricing',
    url: 'pricing.html',
    order: data.navigation.length + 1,
    visible: true
  });
} else {
  pricingLink.visible = true;
}
localStorage.setItem('estalaraAdminData', JSON.stringify(data));
console.log('✅ Data fixed! Refresh the page.');
```

## Verification Steps

### 1. Check CMS Page Structure
1. Go to CMS → Page Structure
2. Select "Pricing" from dropdown
3. You should see:
   - 👁️ Hero Section (Locked)
   - 👁️ Pricing Cards
   - 👁️ How It Works
   - 👁️ Value Proposition
   - 👁️ FAQ Section
   - 👁️ CTA Section

### 2. Check Frontend Navigation
1. Open `index.html` or any frontend page
2. Look at the navigation menu
3. You should see "Pricing" link (not "New Link")
4. Click on it - should go to `pricing.html`

### 3. Check Pricing Page
1. Navigate to `pricing.html`
2. All sections should be visible:
   - Hero with pricing heading
   - Three pricing cards (Free, AI Ads, Hot Leads)
   - How It Works section
   - Value Proposition section
   - FAQ section
   - CTA section

## Technical Details

### Page Structure Location
- **Frontend default structures**: `cms-integration-refactored.js` lines 1040-1047
- **CMS default structures**: `cms.js` lines 1041-1048
- **ContentStore defaults**: `content-store.js` lines 587-598

### Navigation Location
- **ContentStore defaults**: `content-store.js` lines 433-441 (includes Pricing)
- **CMS navigation editor**: `cms.js` lines 1250-1280

### Why This Happened
The page structures and navigation are initialized from defaults only when:
1. No data exists in localStorage
2. Data is missing the `version: 4` flag
3. First-time setup

If data already existed but was incomplete, the defaults wouldn't be applied.

## Future Prevention
The fix script ensures that:
- All page structures are initialized
- Navigation has correct items with proper visibility
- Data version is set to prevent resets

## Need More Help?
If you still see issues after running the fix:
1. Clear browser cache
2. Open browser DevTools → Application → Local Storage
3. Delete `estalaraAdminData` key
4. Refresh the page (will reinitialize from defaults)
5. Run the fix script again
