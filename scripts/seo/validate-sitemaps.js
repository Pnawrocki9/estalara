#!/usr/bin/env node
/**
 * Sitemap Validator - Estalara SEO Audit
 * Validates sitemap.xml and checks for issues
 */

const fs = require('fs');
const path = require('path');

function validateSitemap() {
  console.log('🗺️  Validating sitemap.xml...\n');
  
  const sitemapPath = path.join(__dirname, '../../sitemap.xml');
  
  if (!fs.existsSync(sitemapPath)) {
    console.log('❌ ERROR: sitemap.xml not found!');
    return;
  }

  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const issues = [];
  const warnings = [];
  const info = [];

  // Extract URLs from sitemap
  const urlMatches = sitemap.match(/<loc>(.*?)<\/loc>/g);
  if (!urlMatches) {
    issues.push('No URLs found in sitemap');
    return;
  }

  const urls = urlMatches.map(u => u.replace(/<\/?loc>/g, ''));
  info.push(`Total URLs in sitemap: ${urls.length}`);

  // Check for HTTP vs HTTPS
  const httpUrls = urls.filter(u => u.startsWith('http://'));
  if (httpUrls.length > 0) {
    issues.push(`${httpUrls.length} URLs using HTTP instead of HTTPS`);
  }

  // Check for trailing slashes consistency
  const withTrailing = urls.filter(u => u.endsWith('/'));
  const withoutTrailing = urls.filter(u => !u.endsWith('/') && !u.match(/\.(html|xml|pdf)$/));
  if (withTrailing.length > 0 && withoutTrailing.length > 0) {
    warnings.push('Inconsistent trailing slash usage');
  }

  // Check for lastmod dates
  const lastmodMatches = sitemap.match(/<lastmod>(.*?)<\/lastmod>/g);
  if (!lastmodMatches || lastmodMatches.length !== urls.length) {
    warnings.push('Not all URLs have lastmod dates');
  } else {
    info.push(`All URLs have lastmod dates: ${lastmodMatches.length}`);
  }

  // Check for priority values
  const priorityMatches = sitemap.match(/<priority>(.*?)<\/priority>/g);
  if (!priorityMatches) {
    warnings.push('No priority values set');
  } else {
    info.push(`Priority values set for ${priorityMatches.length} URLs`);
  }

  // Check for changefreq
  const changefreqMatches = sitemap.match(/<changefreq>(.*?)<\/changefreq>/g);
  if (!changefreqMatches) {
    warnings.push('No changefreq values set');
  } else {
    info.push(`Changefreq set for ${changefreqMatches.length} URLs`);
  }

  // Check for image sitemap
  const hasImageSitemap = sitemap.includes('xmlns:image');
  if (!hasImageSitemap) {
    warnings.push('No image sitemap namespace');
  } else {
    info.push('Image sitemap namespace present');
  }

  // Check for video sitemap reference
  const hasVideoSitemap = sitemap.includes('sitemap-video.xml');
  if (!hasVideoSitemap) {
    warnings.push('No video sitemap referenced (important for livestreaming platform)');
  }

  // Check external URLs
  const externalUrls = urls.filter(u => !u.includes('estalara.com'));
  if (externalUrls.length > 0) {
    issues.push(`${externalUrls.length} external URLs in sitemap`);
  }

  // Results
  console.log('📊 Sitemap Validation Results:');
  console.log('='.repeat(60));
  
  console.log('\n📌 Information:');
  info.forEach(i => console.log(`  ℹ️  ${i}`));

  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(w => console.log(`  🟡 ${w}`));
  }

  if (issues.length > 0) {
    console.log('\n❌ Issues:');
    issues.forEach(i => console.log(`  🔴 ${i}`));
  }

  if (issues.length === 0) {
    console.log('\n✅ Sitemap validation passed!');
  }

  // Check robots.txt for sitemap reference
  console.log('\n🤖 Checking robots.txt...');
  const robotsPath = path.join(__dirname, '../../robots.txt');
  if (fs.existsSync(robotsPath)) {
    const robots = fs.readFileSync(robotsPath, 'utf8');
    if (robots.includes('sitemap.xml')) {
      console.log('  ✅ Sitemap referenced in robots.txt');
    } else {
      console.log('  ❌ Sitemap NOT referenced in robots.txt');
    }
  } else {
    console.log('  ❌ robots.txt not found');
  }
}

validateSitemap();
