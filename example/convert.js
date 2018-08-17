const fs = require("fs");
const path = require("path");
const hljs = require("highlight.js");
const MarkdownIt = require("markdown-it");

const srcFile = path.resolve(__dirname, "example.md");
const src = fs.readFileSync(srcFile, "utf8");

const md = new MarkdownIt({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(lang, str, true).value +
          "</code></pre>"
        );
      } catch (__) {}
    }

    return (
      '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
    );
  }
});

const headings = src.split(/\x0d\x0a|\x0a|\x0d/).filter(x => /^#/.test(x));
const title = md
  .render(headings.length > 0 ? headings[0] : `# ${srcFile}`)
  .replace(/<[^>]+>/g, "");

const result = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${title}</title>
<link rel="stylesheet" href="../markdown-style.css">
</head>
<body>
${md.render(src)}
</body>
</html>
`;

const destFile = path.resolve(__dirname, "example.html");
fs.writeFileSync(destFile, result, "utf8");
