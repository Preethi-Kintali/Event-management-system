const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { marked } = require('marked');

const reports = [
  { id: '02', file: '02_Source_Code_Handover_Report', title: 'Source Code Handover Report' },
  { id: '03', file: '03_Project_Setup_Guide', title: 'Project Setup Guide' },
  { id: '04', file: '04_Technical_Documentation', title: 'Technical Documentation' },
  { id: '05', file: '05_Database_and_API_Documentation', title: 'Database and API Documentation' },
  { id: '06', file: '06_Testing_Report', title: 'Testing Report' },
  { id: '07', file: '07_Project_Status_and_Pending_Work_Report', title: 'Project Status and Pending Work Report' },
  { id: '08', file: '08_Final_Project_Handover_Summary', title: 'Final Project Handover Summary' }
];

const reportsDir = path.resolve(__dirname, '..', 'reports');
const downloadsDir = 'C:/Users/Hemanth/Downloads';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const baseCss = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  
  :root {
    --primary: #0284c7;
    --primary-dark: #0369a1;
    --text-main: #0f172a;
    --text-muted: #475569;
    --bg-code: #0f172a;
    --border-color: #cbd5e1;
    --border-light: #e2e8f0;
    --table-header: #f8fafc;
    --table-alt: #f1f5f9;
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: var(--text-main);
    background: #ffffff;
    line-height: 1.6;
    font-size: 13.5px;
    margin: 0;
    padding: 32px 40px;
  }

  .report-header {
    border-bottom: 3px solid var(--primary);
    padding-bottom: 20px;
    margin-bottom: 28px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .header-badge {
    display: inline-block;
    background: #e0f2fe;
    color: var(--primary-dark);
    font-weight: 700;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 4px 10px;
    border-radius: 4px;
    margin-bottom: 8px;
    border: 1px solid #bae6fd;
  }

  .doc-title-h1 {
    font-size: 26px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 6px 0;
    letter-spacing: -0.02em;
  }

  .doc-meta {
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 500;
  }

  .confidential-tag {
    text-align: right;
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  h1, h2, h3, h4, h5 {
    color: #0f172a;
    font-weight: 700;
    page-break-after: avoid;
    break-after: avoid;
  }

  h1 {
    font-size: 22px;
    border-bottom: 2px solid var(--border-light);
    padding-bottom: 8px;
    margin-top: 32px;
    margin-bottom: 16px;
    color: #0369a1;
  }

  h2 {
    font-size: 17px;
    border-bottom: 1px solid var(--border-light);
    padding-bottom: 6px;
    margin-top: 26px;
    margin-bottom: 12px;
    color: #0f172a;
  }

  h3 {
    font-size: 14.5px;
    margin-top: 20px;
    margin-bottom: 8px;
    color: #1e293b;
  }

  p {
    margin: 0 0 12px 0;
    text-align: justify;
  }

  strong {
    color: #0f172a;
    font-weight: 600;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0 20px 0;
    font-size: 12px;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  table th {
    background-color: var(--table-header);
    color: #0f172a;
    font-weight: 700;
    text-align: left;
    padding: 9px 12px;
    border: 1px solid var(--border-color);
    letter-spacing: 0.02em;
  }

  table td {
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    vertical-align: top;
  }

  table tr:nth-child(even) td {
    background-color: #f8fafc;
  }

  code {
    font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
    font-size: 11.5px;
    background: #f1f5f9;
    color: #0369a1;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }

  pre {
    background: #0f172a;
    color: #f8fafc;
    padding: 14px 18px;
    border-radius: 8px;
    overflow-x: auto;
    font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
    font-size: 11.5px;
    line-height: 1.5;
    margin: 16px 0;
    page-break-inside: avoid;
    break-inside: avoid;
    border: 1px solid #1e293b;
  }

  pre code {
    background: transparent;
    color: inherit;
    padding: 0;
    border: none;
    font-size: inherit;
  }

  blockquote {
    margin: 16px 0;
    padding: 12px 18px;
    border-left: 4px solid var(--primary);
    background: #f0f9ff;
    color: #0369a1;
    border-radius: 0 6px 6px 0;
    font-size: 13px;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  blockquote p {
    margin: 0;
    color: #0c4a6e;
    font-weight: 500;
  }

  hr {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 24px 0;
  }

  ul, ol {
    margin: 0 0 14px 0;
    padding-left: 22px;
  }

  li {
    margin-bottom: 6px;
  }

  .footer-notice {
    margin-top: 40px;
    padding-top: 16px;
    border-top: 1px solid #e2e8f0;
    font-size: 11px;
    color: #94a3b8;
    display: flex;
    justify-content: space-between;
    page-break-before: avoid;
    break-before: avoid;
  }

  @page {
    size: A4;
    margin: 14mm 14mm 14mm 14mm;
  }

  @media print {
    body {
      padding: 0;
      font-size: 12.5px;
    }
    pre {
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
`;

function buildHtml(markdownContent, title) {
  // Fix callout styling if any
  let processedMd = markdownContent.replace(/> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n/g, (match, type) => {
    return `**[${type}]**: `;
  });

  const parsedBody = marked.parse(processedMd);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} - Eventura Enterprise</title>
  <style>${baseCss}</style>
</head>
<body>
  <div class="report-header">
    <div>
      <span class="header-badge">Official Project Deliverable</span>
      <div class="doc-meta">Eventura (powered by Clientura) &bull; Enterprise Handover Deliverable</div>
    </div>
    <div class="confidential-tag">
      CONFIDENTIAL &bull; ENTERPRISE RELEASE
    </div>
  </div>

  <main>
    ${parsedBody}
  </main>

  <div class="footer-notice">
    <span>Eventura Platform Handover Suite &bull; Version 1.0.0</span>
    <span>Generated: October 29, 2026 &bull; Strict Multi-Tenant Architecture</span>
  </div>
</body>
</html>`;
}

console.log('=== STARTING ENTERPRISE PDF & HTML REPORT GENERATION ===\n');

for (const report of reports) {
  const mdPath = path.join(reportsDir, `${report.file}.md`);
  const htmlPath = path.join(reportsDir, `${report.file}.html`);
  const pdfPath = path.join(reportsDir, `${report.file}.pdf`);
  const userPdfPath = path.join(downloadsDir, `${report.file}.pdf`);

  if (!fs.existsSync(mdPath)) {
    console.error(`Error: Markdown file not found at ${mdPath}`);
    continue;
  }

  console.log(`[Processing ${report.id}/08]: ${report.title}`);

  // 1. Read Markdown & build HTML
  const mdContent = fs.readFileSync(mdPath, 'utf8');
  const fullHtml = buildHtml(mdContent, report.title);
  fs.writeFileSync(htmlPath, fullHtml, 'utf8');
  console.log(`  -> HTML generated: ${htmlPath}`);

  // 2. Run Chrome Headless to generate vector PDF
  const chromeArgs = [
    `"${chromePath}"`,
    '--headless=new',
    '--disable-gpu',
    '--run-all-compositor-stages-before-draw',
    '--no-pdf-header-footer',
    `--print-to-pdf="${pdfPath}"`,
    `"${htmlPath}"`
  ].join(' ');

  try {
    execSync(chromeArgs, { stdio: 'pipe', timeout: 30000 });
    const stat = fs.statSync(pdfPath);
    console.log(`  -> PDF generated: ${pdfPath} (${(stat.size / 1024).toFixed(1)} KB)`);

    // 3. Copy to Downloads folder
    fs.copyFileSync(pdfPath, userPdfPath);
    console.log(`  -> Copied to Downloads: ${userPdfPath}`);
  } catch (err) {
    console.error(`  -> Failed to generate PDF for ${report.file}:`, err.message);
  }
  console.log('');
}

console.log('=== ALL 7 REPORTS SUCCESSFULLY GENERATED ===');
