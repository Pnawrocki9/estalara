#!/usr/bin/env node
/**
 * Site Crawler - Estalara SEO Audit
 * Crawls all HTML pages and extracts SEO-relevant data
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PUBLIC_PAGES = [
  'index.html',
  'agents.html',
  'agencies.html',
  'investors.html',
  'about.html',
  'faq.html',
  'privacy.html',
  'terms.html'
];

const ADMIN_PAGES = [
  'admin.html',
  'admin-login.html',
  'cms.html',
  'cms-login.html'
];

const findings = [];
const results = {
  pages: [],
  issues: [],
  warnings: [],
  success: []
};

/**
 * Extract meta tags from HTML content
 */
function extractMetaTags(html, filename) {
  const data = {
    file: filename,
    title: '',
    metaDescription: '',
    canonical: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: '',
    h1Tags: [],
    schemaTypes: [],
    hreflang: [],
    hasCanonical: false,
    hasOG: false,
    hasTwitter: false,
    hasSchema: false,
    images: [],
    links: []
  };

  // Title
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
  if (titleMatch) {
    data.title = titleMatch[1].trim();
  }

  // Meta description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  if (descMatch) {
    data.metaDescription = descMatch[1];
  }

  // Canonical
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  if (canonicalMatch) {
    data.canonical = canonicalMatch[1];
    data.hasCanonical = true;
  }

  // Open Graph
  const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
  if (ogTitleMatch) {
    data.ogTitle = ogTitleMatch[1];
    data.hasOG = true;
  }

  const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
  if (ogDescMatch) {
    data.ogDescription = ogDescMatch[1];
  }

  const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  if (ogImageMatch) {
    data.ogImage = ogImageMatch[1];
  }

  // Twitter
  const twitterMatch = html.match(/<meta\s+name=["']twitter:card["']\s+content=["']([^"']+)["']/i);
  if (twitterMatch) {
    data.twitterCard = twitterMatch[1];
    data.hasTwitter = true;
  }

  // H1 tags
  const h1Matches = html.match(/<h1[^>]*>(.*?)<\/h1>/gis);
  if (h1Matches) {
    data.h1Tags = h1Matches.map(h => h.replace(/<[^>]+>/g, '').trim());
  }

  // Schema.org structured data
  const schemaMatches = html.match(/<script\s+type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis);
  if (schemaMatches) {
    data.hasSchema = true;
    schemaMatches.forEach(match => {
      try {
        const jsonMatch = match.match(/<script[^>]*>(.*?)<\/script>/is);
        if (jsonMatch) {
          const json = JSON.parse(jsonMatch[1]);
          if (json['@type']) {
            data.schemaTypes.push(json['@type']);
          }
        }
      } catch (e) {
        // Invalid JSON
      }
    });
  }

  // Hreflang
  const hreflangMatches = html.match(/<link\s+rel=["']alternate["']\s+hreflang=["']([^"']+)["'][^>]*>/gi);
  if (hreflangMatches) {
    data.hreflang = hreflangMatches.map(m => {
      const langMatch = m.match(/hreflang=["']([^"']+)["']/i);
      return langMatch ? langMatch[1] : '';
    });
  }

  // Images
  const imgMatches = html.match(/<img[^>]*>/gi);
  if (imgMatches) {
    imgMatches.forEach(img => {
      const srcMatch = img.match(/src=["']([^"']+)["']/i);
      const altMatch = img.match(/alt=["']([^"']*)["']/i);
      if (srcMatch) {
        data.images.push({
          src: srcMatch[1],
          hasAlt: !!altMatch,
          alt: altMatch ? altMatch[1] : ''
        });
      }
    });
  }

  return data;
}

/**
 * Analyze page for SEO issues
 */
function analyzePage(data) {
  const issues = [];
  const warnings = [];
  const success = [];

  // Title checks
  if (!data.title) {
    issues.push({ page: data.file, type: 'CRITICAL', issue: 'Missing <title> tag' });
  } else if (data.title.length < 30) {
    warnings.push({ page: data.file, type: 'WARNING', issue: `Title too short (${data.title.length} chars)` });
  } else if (data.title.length > 60) {
    warnings.push({ page: data.file, type: 'WARNING', issue: `Title too long (${data.title.length} chars)` });
  } else {
    success.push({ page: data.file, check: 'Title length optimal' });
  }

  // Meta description
  if (!data.metaDescription) {
    issues.push({ page: data.file, type: 'CRITICAL', issue: 'Missing meta description' });
  } else if (data.metaDescription.length < 120) {
    warnings.push({ page: data.file, type: 'WARNING', issue: `Meta description too short (${data.metaDescription.length} chars)` });
  } else if (data.metaDescription.length > 160) {
    warnings.push({ page: data.file, type: 'WARNING', issue: `Meta description too long (${data.metaDescription.length} chars)` });
  } else {
    success.push({ page: data.file, check: 'Meta description optimal' });
  }

  // Canonical URL
  if (!data.hasCanonical) {
    issues.push({ page: data.file, type: 'HIGH', issue: 'Missing canonical URL' });
  } else {
    success.push({ page: data.file, check: 'Canonical URL present' });
  }

  // Open Graph
  if (!data.hasOG) {
    issues.push({ page: data.file, type: 'HIGH', issue: 'Missing Open Graph tags' });
  } else {
    success.push({ page: data.file, check: 'Open Graph tags present' });
  }

  // Twitter Cards
  if (!data.hasTwitter) {
    warnings.push({ page: data.file, type: 'MEDIUM', issue: 'Missing Twitter Card tags' });
  } else {
    success.push({ page: data.file, check: 'Twitter Card tags present' });
  }

  // H1 tags
  if (data.h1Tags.length === 0) {
    issues.push({ page: data.file, type: 'HIGH', issue: 'No H1 tag found' });
  } else if (data.h1Tags.length > 1) {
    warnings.push({ page: data.file, type: 'MEDIUM', issue: `Multiple H1 tags (${data.h1Tags.length})` });
  } else {
    success.push({ page: data.file, check: 'Single H1 tag present' });
  }

  // Structured data
  if (!data.hasSchema) {
    issues.push({ page: data.file, type: 'HIGH', issue: 'No Schema.org structured data' });
  } else {
    success.push({ page: data.file, check: `Schema.org present: ${data.schemaTypes.join(', ')}` });
  }

  // Hreflang
  if (data.hreflang.length === 0) {
    warnings.push({ page: data.file, type: 'MEDIUM', issue: 'No hreflang tags (international site)' });
  } else {
    success.push({ page: data.file, check: `Hreflang tags present: ${data.hreflang.length}` });
  }

  // Images without alt text
  const missingAlt = data.images.filter(img => !img.hasAlt || img.alt === '');
  if (missingAlt.length > 0) {
    warnings.push({ page: data.file, type: 'MEDIUM', issue: `${missingAlt.length} images missing alt text` });
  }

  return { issues, warnings, success };
}

/**
 * Main crawler function
 */
function crawlSite() {
  console.log('🕷️  Starting Estalara SEO Crawler...\n');

  PUBLIC_PAGES.forEach(file => {
    const filepath = path.join(__dirname, '../../', file);
    
    if (!fs.existsSync(filepath)) {
      findings.push({ file, status: 'ERROR', message: 'File not found' });
      return;
    }

    try {
      const html = fs.readFileSync(filepath, 'utf8');
      const data = extractMetaTags(html, file);
      results.pages.push(data);

      const analysis = analyzePage(data);
      results.issues.push(...analysis.issues);
      results.warnings.push(...analysis.warnings);
      results.success.push(...analysis.success);

      findings.push({ file, status: 'OK', message: 'Crawled successfully' });
    } catch (error) {
      findings.push({ file, status: 'ERROR', message: error.message });
    }
  });

  // Generate report
  console.log('📊 Crawl Results:');
  console.log('='.repeat(60));
  findings.forEach(f => {
    const icon = f.status === 'OK' ? '✅' : '❌';
    console.log(`${icon} ${f.file}: ${f.message}`);
  });

  console.log('\n🔴 CRITICAL ISSUES:', results.issues.filter(i => i.type === 'CRITICAL').length);
  console.log('🟠 HIGH PRIORITY:', results.issues.filter(i => i.type === 'HIGH').length);
  console.log('🟡 WARNINGS:', results.warnings.length);
  console.log('🟢 SUCCESS:', results.success.length);

  // Save detailed report
  const reportPath = path.join(__dirname, '../../seo/crawl-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Detailed report saved to: ${reportPath}`);

  // Generate CSV for findings
  generateCSV();
}

/**
 * Generate CSV report
 */
function generateCSV() {
  const csvRows = [
    'Page,Priority,Type,Issue,Status'
  ];

  results.issues.forEach(i => {
    csvRows.push(`${i.page},${i.type},Issue,"${i.issue}",To Fix`);
  });

  results.warnings.forEach(w => {
    csvRows.push(`${w.page},${w.type},Warning,"${w.issue}",To Review`);
  });

  const csvPath = path.join(__dirname, '../../seo/findings.csv');
  fs.writeFileSync(csvPath, csvRows.join('\n'));
  console.log(`📄 CSV report saved to: ${csvPath}`);
}

// Run crawler
crawlSite();
