#!/bin/bash
##
# Performance Check Script - Estalara SEO Audit
# Analyzes images, scripts, and performance metrics
##

echo "⚡ Estalara Performance Audit"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Must run from project root"
    exit 1
fi

echo ""
echo "📦 Bundle Size Analysis"
echo "------------------------"

# Check HTML file sizes
echo "HTML Files:"
find . -maxdepth 1 -name "*.html" -exec ls -lh {} \; | awk '{print $9, $5}' | grep -v "^debug\|^test\|^AUTO\|^QUICK"

# Check JS file sizes
echo ""
echo "JavaScript Files:"
find . -maxdepth 1 -name "*.js" -exec ls -lh {} \; | awk '{print $9, $5}'

# Check asset sizes
echo ""
echo "Assets:"
if [ -d "assets" ]; then
    du -sh assets/
    find assets/ -type f -exec ls -lh {} \; | awk '{print $9, $5}' | sort -k2 -hr | head -10
fi

echo ""
echo "🖼️  Image Optimization Check"
echo "----------------------------"

# Count images
total_images=$(find . -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.webp" -o -name "*.svg" \) | wc -l)
echo "Total images: $total_images"

# Check for WebP usage
webp_count=$(find . -type f -name "*.webp" | wc -l)
echo "WebP images: $webp_count"

# Check for large images
echo ""
echo "Large images (>500KB):"
find . -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -size +500k -exec ls -lh {} \; | awk '{print $9, $5}'

echo ""
echo "📊 External Dependencies Analysis"
echo "----------------------------------"

# Count external scripts
cdn_count=$(grep -r "cdn\." *.html | wc -l)
echo "CDN references: $cdn_count"

# List unique CDN domains
echo ""
echo "External domains:"
grep -rh "https://" *.html | grep -o 'https://[^/"]*' | sort -u | grep -v "estalara.com"

echo ""
echo "🔍 Render-Blocking Resources"
echo "------------------------------"

# Check for blocking scripts
blocking_scripts=$(grep -c "<script src=" index.html)
echo "Synchronous scripts in index.html: $blocking_scripts"

# Check for defer/async usage
defer_count=$(grep -c "defer" index.html)
async_count=$(grep -c "async" index.html)
echo "Scripts with defer: $defer_count"
echo "Scripts with async: $async_count"

echo ""
echo "🎨 CSS Analysis"
echo "----------------"

# Check for inline styles
inline_style_lines=$(grep -c "<style>" index.html)
echo "Inline <style> blocks: $inline_style_lines"

# Check for external stylesheets
external_css=$(grep -c '<link.*stylesheet' index.html)
echo "External stylesheets: $external_css"

echo ""
echo "⚠️  Recommendations:"
echo "--------------------"

if [ $webp_count -eq 0 ]; then
    echo "🔴 P0: Convert images to WebP format for better compression"
fi

if [ $cdn_count -gt 10 ]; then
    echo "🟠 P1: Consider bundling/reducing CDN dependencies ($cdn_count found)"
fi

if [ $blocking_scripts -gt 5 ]; then
    echo "🟡 P2: Add defer/async to non-critical scripts"
fi

echo ""
echo "✅ Performance audit complete!"
echo "📄 For detailed metrics, run Lighthouse audit"
