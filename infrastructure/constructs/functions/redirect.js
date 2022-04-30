function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var host = request.headers.host.value;
  // Check if trying to use www domain
  if(host.startsWith("www.")) {
    var newURL = 'https://' + host.slice(4) + uri;
    var response = {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers:
          { "location": { "value": newURL } }
    }
    return response;
  }
  // Check whether the URI is missing a file name.
  if (uri.endsWith('/')) {
      request.uri += 'index.html';
  }
  // Check whether the URI is missing a file extension.
  else if (!uri.includes('.')) {
      request.uri += '/index.html';
  }
  return request;
}