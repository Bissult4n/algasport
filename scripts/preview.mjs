// Local QA only. Deploy the out/ directory; production does not run this script.
import "./env.mjs";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve("out");
const port = Number(process.env.PORT || 4173);
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
const mime = { ".html":"text/html; charset=utf-8", ".js":"application/javascript", ".css":"text/css", ".svg":"image/svg+xml", ".webp":"image/webp", ".png":"image/png", ".ico":"image/x-icon", ".json":"application/json", ".txt":"text/plain; charset=utf-8" };
const server = createServer(async (req,res)=>{
  try {
    let path = decodeURIComponent(new URL(req.url,"http://localhost").pathname);
    if (base && !path.startsWith(base + "/")) { res.writeHead(404).end(); return; }
    path = path.slice(base.length);
    let file = resolve(root, "." + path);
    if(file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    if((await stat(file)).isDirectory()) file = resolve(file,"index.html");
    const content = await readFile(file);
    res.writeHead(200,{"Content-Type":mime[extname(file)] || "application/octet-stream", "Cache-Control":"no-store"});
    res.end(req.method === "HEAD" ? undefined : content);
  } catch { res.writeHead(404,{"Content-Type":"text/plain"}).end("Not found"); }
});
server.listen(port,"127.0.0.1",()=>console.log("Static preview: http://localhost:" + port + base + "/"));
