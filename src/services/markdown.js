let markedApi = null;
let katexReady = false;

function looksLikeMath(source) {
  return /\$\$[\s\S]+?\$\$|\$[^$\n]+\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)/.test(
    source
  );
}

async function ensureMarked() {
  if (markedApi) return markedApi;
  const { marked } = await import("marked");
  marked.setOptions({ gfm: true, breaks: true });
  markedApi = marked;
  return markedApi;
}

async function ensureKatex() {
  if (katexReady) return;
  await Promise.all([
    import("katex"),
    import("katex/dist/katex.min.css"),
  ]);
  katexReady = true;
}

function wrapImages(html) {
  return html.replace(/<img\b([^>]*)>/gi, (full, attrs) => {
    const alt = /alt="([^"]*)"/i.exec(attrs)?.[1] || "";
    const src = /src="([^"]*)"/i.exec(attrs)?.[1] || "";
    const isWide = /wide|full|hero/i.test(alt);
    return `<figure class="article-media${isWide ? " full-bleed" : ""}"><img${attrs} loading="lazy" decoding="async" data-lightbox="${src}"><figcaption>${alt}</figcaption></figure>`;
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fff\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function extractToc(html) {
  const matches = [...html.matchAll(/<h([2-4])([^>]*)>([\s\S]*?)<\/h\1>/gi)];
  return matches.map((match, index) => {
    const level = Number(match[1]);
    const text = match[3].replace(/<[^>]+>/g, "").trim();
    const existingId = /id="([^"]+)"/.exec(match[2])?.[1];
    const id = existingId || `heading-${index + 1}-${slugify(text)}`;
    return { level, text, id };
  });
}

export function applyHeadingIds(html, toc) {
  let cursor = 0;
  return html.replace(/<h([2-4])([^>]*)>([\s\S]*?)<\/h\1>/gi, (full, level, attrs, inner) => {
    const item = toc[cursor++];
    if (!item) return full;
    if (/id=/.test(attrs)) return full;
    return `<h${level}${attrs} id="${item.id}">${inner}</h${level}>`;
  });
}

export async function renderMarkdown(source) {
  const marked = await ensureMarked();
  let html = marked.parse(source || "");
  html = wrapImages(html);

  if (looksLikeMath(source || "")) {
    await ensureKatex();
    const { default: renderMathInElement } = await import(
      "katex/contrib/auto-render"
    );
    const host = document.createElement("div");
    host.innerHTML = html;
    renderMathInElement(host, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false },
      ],
      throwOnError: false,
    });
    html = host.innerHTML;
  }

  const toc = extractToc(html);
  html = applyHeadingIds(html, toc);
  return { html, toc };
}
