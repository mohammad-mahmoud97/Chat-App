import URL from 'url';

export default function parse(urlStr) {
  var url    = URL.parse(urlStr)
    , secure = false

  if (url.protocol !== 'ws:' && url.protocol !== 'wss:') {
    throw new SyntaxError('scheme component must be "ws" or "wss"')
  }
  if (url.hash) {
    throw new SyntaxError('expected null fragment component')
  }
  if (url.protocol === 'wss:') {
    secure = true
  }
  if (!url.port) {
    if (url.protocol === 'ws:') {
      url.port = '80'
    } else {
      url.port = '443'
    }
  }
  return {
    host     : url.hostname,
    port     : url.port,
    resource : url.path,
    secure   : secure
  }
}