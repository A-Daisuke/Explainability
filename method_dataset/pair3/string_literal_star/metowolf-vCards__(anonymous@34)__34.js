const server = createServer(async (req, res) => {
  try {
    let filePath = req.url === '/' ? '/index.html' : req.url
    
    // 移除查询参数
    filePath = filePath.split('?')[0]
    
    // 安全检查：防止路径遍历攻击
    if (filePath.includes('..')) {
      res.writeHead(403, { 'Content-Type': 'text/plain' })
      res.end('Forbidden')
      return
    }
    
    const fullPath = path.join(PUBLIC_DIR, filePath)
    
    if (!existsSync(fullPath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('File not found')
      return
    }
    
    const content = await readFile(fullPath)
    const mimeType = getMimeType(fullPath)
    
    res.writeHead(200, { 
      'Content-Type': mimeType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    })
    res.end(content)
    
  } catch (error) {
    console.error('Error serving file:', error)
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end('Internal Server Error')
  }
})
