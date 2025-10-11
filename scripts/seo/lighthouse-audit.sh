#!/bin/bash
##
# Lighthouse CI Audit Script - Estalara SEO
# Runs Lighthouse audits on key pages
##

echo "🏠 Estalara Lighthouse Audit"
echo "========================================"
echo ""

# Check if lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo "⚠️  Lighthouse not installed globally."
    echo "📦 Installing lighthouse..."
    npm install -g lighthouse
fi

# Create output directory
mkdir -p seo/lighthouse

PAGES=(
    "index.html"
    "agents.html"
    "agencies.html"
    "investors.html"
    "about.html"
    "faq.html"
)

echo "Running Lighthouse audits (this may take a few minutes)..."
echo ""

for page in "${PAGES[@]}"; do
    echo "🔍 Auditing: $page"
    
    # Note: Lighthouse works best with served pages
    # For static HTML, we'll document the command but not run it here
    # as it requires a local server
    
    echo "  ⚠️  To run Lighthouse audit:"
    echo "  lighthouse file://$(pwd)/$page --output html --output-path seo/lighthouse/${page%.html}-report.html"
    echo ""
done

echo "📝 Alternative: Use Lighthouse in Chrome DevTools"
echo "   1. Open Chrome and navigate to each page"
echo "   2. Open DevTools (F12)"
echo "   3. Go to Lighthouse tab"
echo "   4. Click 'Analyze page load'"
echo ""

echo "✅ Lighthouse audit script complete!"
echo "📌 For production audit, use: https://developers.google.com/speed/pagespeed/insights/"
