#!/bin/bash
##
# Master SEO Audit Runner - Estalara
# Runs all SEO audit scripts and generates comprehensive report
##

echo "🚀 Estalara Comprehensive SEO Audit"
echo "========================================"
echo "Started: $(date)"
echo ""

# Create output directory
mkdir -p seo

echo "📋 Running audits..."
echo ""

# 1. Crawl site
echo "1️⃣  Crawling site structure..."
node scripts/seo/crawl-site.js
echo ""

# 2. Validate sitemaps
echo "2️⃣  Validating sitemaps..."
node scripts/seo/validate-sitemaps.js
echo ""

# 3. Performance check
echo "3️⃣  Analyzing performance..."
bash scripts/seo/check-performance.sh
echo ""

# 4. Check robots.txt
echo "4️⃣  Checking robots.txt..."
if [ -f "robots.txt" ]; then
    echo "✅ robots.txt exists"
    echo "Lines: $(wc -l < robots.txt)"
    echo "Size: $(ls -lh robots.txt | awk '{print $5}')"
else
    echo "❌ robots.txt not found"
fi
echo ""

# 5. Check for broken links (basic)
echo "5️⃣  Checking for common link issues..."
echo "Checking for localhost references:"
grep -r "localhost" --include="*.html" . | wc -l
echo "Checking for http:// links:"
grep -r "http://" --include="*.html" . | grep -v "https://" | wc -l
echo ""

# 6. Summary
echo "========================================"
echo "✅ Audit Complete!"
echo "Completed: $(date)"
echo ""
echo "📊 Reports generated:"
echo "  - seo/crawl-results.json"
echo "  - seo/findings.csv"
echo ""
echo "📌 Next steps:"
echo "  1. Review findings in seo/findings.csv"
echo "  2. Check detailed results in seo/crawl-results.json"
echo "  3. Run Lighthouse audit for performance metrics"
echo "  4. Review seo/PLAN.md for action items"
