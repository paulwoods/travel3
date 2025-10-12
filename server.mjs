import http from 'node:http'
import {createReadStream, existsSync} from 'node:fs'
import {extname, join, normalize} from 'node:path'
import {fileURLToPath} from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = normalize(join(__filename, '..'))

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

// Very small static server that serves files from project root.
// Defaults to index.html for '/'.
const server = http.createServer(async (req, res) => {
  try {
    if (!req.url) {
      res.writeHead(400)
      res.end('Bad Request')
      return
    }

    // Prevent basic path traversal
    const urlPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname)
    let safePath = urlPath.replace(/\\/g, '/').replace(/\.\.+/g, '')
    if (safePath === '/') safePath = '/index.html'

    const filePath = join(__dirname, safePath.startsWith('/') ? `.${safePath}` : safePath)

    if (!existsSync(filePath)) {
      res.writeHead(404)
      res.end('Not Found')
      return
    }

    const type = contentType(filePath)
    res.writeHead(200, {'Content-Type': type})
    createReadStream(filePath).pipe(res)
  } catch (err) {
    console.error(err)
    res.writeHead(500)
    res.end('Internal Server Error')
  }
})

server.listen(PORT, () => {
  console.log(`Node server running at http://localhost:${PORT}`)
})

function contentType(file) {
  const ext = extname(file).toLowerCase()
  switch (ext) {
    case '.html':
      return 'text/html; charset=utf-8'
    case '.js':
      return 'text/javascript; charset=utf-8'
    case '.mjs':
      return 'text/javascript; charset=utf-8'
    case '.cjs':
      return 'text/javascript; charset=utf-8'
    case '.ts':
      return 'text/plain; charset=utf-8'
    case '.tsx':
      return 'text/plain; charset=utf-8'
    case '.css':
      return 'text/css; charset=utf-8'
    case '.json':
      return 'application/json; charset=utf-8'
    case '.svg':
      return 'image/svg+xml'
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.gif':
      return 'image/gif'
    default:
      return 'application/octet-stream'
  }
}