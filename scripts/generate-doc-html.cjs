const fs = require('fs');
const path = require('path');

const mdPath = path.resolve(__dirname, '..', 'PROJECT_DOCUMENTATION.md');
const mdContent = fs.readFileSync(mdPath, 'utf8');
const escapedContent = JSON.stringify(mdContent);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Eventora - Startup Project Documentation</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.0/github-markdown-light.min.css">
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #f6f8fa;
      margin: 0;
      padding: 32px 16px;
      color: #24292f;
    }
    .page-wrapper {
      max-width: 960px;
      margin: 0 auto;
      background: #ffffff;
      padding: 56px;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      border: 1px solid #d0d7de;
    }
    .floating-toolbar {
      position: fixed;
      top: 24px;
      right: 24px;
      display: flex;
      gap: 12px;
      z-index: 1000;
    }
    .print-btn {
      background: #0969da;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(9, 105, 218, 0.35);
      transition: background 0.2s, transform 0.1s;
    }
    .print-btn:hover {
      background: #0856b3;
      transform: translateY(-1px);
    }
    .mermaid {
      background: #f6f8fa;
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
    }
    @media print {
      .floating-toolbar {
        display: none !important;
      }
      body {
        padding: 0;
        background: #ffffff;
      }
      .page-wrapper {
        box-shadow: none;
        border: none;
        border-radius: 0;
        padding: 0;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="floating-toolbar">
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div class="page-wrapper markdown-body" id="doc-content"></div>
  <script>
    const rawMarkdown = ${escapedContent};
    mermaid.initialize({ startOnLoad: false, theme: "neutral" });
    
    const renderer = new marked.Renderer();
    const originalCode = renderer.code.bind(renderer);
    renderer.code = function(code, lang) {
      if (typeof code === 'object' && code !== null) {
        lang = code.lang;
        code = code.text;
      }
      if (lang === "mermaid") {
        return '<div class="mermaid">' + code + '</div>';
      }
      return originalCode(code, lang);
    };
    
    marked.use({ renderer });
    document.getElementById("doc-content").innerHTML = marked.parse(rawMarkdown);
    mermaid.run();
  </script>
</body>
</html>`;

const localOut = path.resolve(__dirname, '..', 'PROJECT_DOCUMENTATION.html');
const userDownloadsOut = 'C:/Users/Hemanth/Downloads/Eventora_Startup_Project_Documentation.html';

fs.writeFileSync(localOut, html, 'utf8');
fs.writeFileSync(userDownloadsOut, html, 'utf8');
console.log('Successfully generated HTML documentation at:');
console.log('1.', localOut);
console.log('2.', userDownloadsOut);
