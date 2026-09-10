import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile, stat } from "node:fs/promises";

const git = (...args) => execFileSync("git", args, { encoding: "utf8" });
const files = git("ls-files", "--cached", "--others", "--exclude-standard", "-z").split("\0").filter(Boolean);
const candidateSet = new Set(files);
assert.ok(files.length, "Run from an initialized Git project");
const forbidden = /(^|\/)(node_modules|\.next|out|\.local-tools|\.vercel|\.pnpm-store|design-assets|test-results|playwright-report|\.cache|coverage)(\/|$)|(?:^|\/)\.env(?!\.example$)|\.(?:pem|key|p12|pfx|log|tsbuildinfo)$/i;
const problems = [];
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9]{25,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{30,}\b/,
  /\bAKIA[A-Z0-9]{16}\b/,
  /\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b/,
  /(?:api[_-]?key|access[_-]?token|client[_-]?secret|password)\s*[:=]\s*["'][^"'\s]{16,}["']/i,
];
for (const file of files) {
  if (forbidden.test(file)) problems.push("Excluded/private file is a Git candidate: " + file);
  const info = await stat(file);
  if (!info.isFile() || /\.(webp|png|jpg|jpeg|ico|woff2)$/i.test(file)) continue;
  if (info.size > 5 * 1024 * 1024) { problems.push("Unexpected large text file: " + file); continue; }
  const text = await readFile(file, "utf8");
  if (secretPatterns.some(pattern => pattern.test(text))) problems.push("Possible credential in " + file);
  if (/^(app|components|lib)\//.test(file) && (
    /https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(?=[:/\s"']|$)/i.test(text) ||
    /[a-z]:[\\/](Users|Program Files|Windows)[\\/]/i.test(text) ||
    /\bconsole\.(log|error|debug)\s*\(/.test(text)
  )) problems.push("Local/debug reference in runtime source: " + file);
}
const required = ["package.json", "package-lock.json", "README.md", ".env.example", "next.config.mjs", "vercel.json", "public/.nojekyll", "public/images/alga-logo.webp", "public/images/alga-mark.webp"];
const sources = JSON.parse(await readFile("docs/image-sources.json", "utf8"));
const previewSources = JSON.parse(await readFile("docs/personalization-image-sources.json", "utf8"));
for (const file of [...required, ...sources.map(source => source.file), ...previewSources.map(source => source.file), "assets/fonts/noto-sans-jp-600.woff2", "assets/fonts/OFL.txt"]) {
  if (!candidateSet.has(file)) problems.push("Missing or ignored required file: " + file);
}
const lock = JSON.parse(await readFile("package-lock.json", "utf8"));
const manifest = JSON.parse(await readFile("package.json", "utf8"));
for (const group of ["dependencies", "devDependencies"]) {
  assert.deepEqual(lock.packages[""][group], manifest[group], "Lockfile must match package.json");
}
for (const [name, value] of Object.entries(lock.packages)) {
  if ((name && !name.startsWith("node_modules/")) || value.link || (value.resolved && !value.resolved.startsWith("https://registry.npmjs.org/"))) problems.push("Nonportable package resolution: " + name);
}
const ignoreProbes = [".env", ".env.local", ".env.production", ".vercel/project.json", "node_modules/probe.js", "out/index.html", ".next/cache/probe", ".local-tools/probe", "design-assets/probe.png"];
const ignored = new Set(git("check-ignore", "--no-index", ...ignoreProbes).trim().split(/\r?\n/));
for (const file of ignoreProbes) if (!ignored.has(file)) problems.push("Missing ignore rule: " + file);
assert.deepEqual(problems, [], "Repository checks failed (values are never printed)");
console.log(`PASS: ${candidateSet.size} Git candidates, all product assets included, no detected credentials/local runtime paths, portable npm lockfile, ignore rules verified.`);
