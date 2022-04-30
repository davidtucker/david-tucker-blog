function handler(event) {
  var response = event.response;

  var filename = event.request.uri.split('/').pop();

  // If it ends with a slash
  if(!filename || filename.length === 0) {
    return response;
  }

  // If no extension, don't add headers
  var extension = filename.split('.').pop().toLowerCase();
  if(!extension || extension.length === 0) {
    return response;
  }

  // If HTML add cache headers
  if(extension === 'html') {
    response.headers['cache-control'] = {value: 'must-revalidate, max-age=600'};
    return response;
  }

  // If JPG, PNG, SVG, or WEBP add cache headers
  var imageTypesForCaching = [ 'jpg', 'png', 'svg', 'webp' ];
  if(imageTypesForCaching.includes(extension)) {
    response.headers['cache-control'] = {value: 'public, max-age=63072000'};
    return response;
  }

  // If CSS, JS add cache headers
  var otherTypesForCaching = [ 'css', 'js' ];
  if(otherTypesForCaching.includes(extension)) {
    response.headers['cache-control'] = {value: 'public, max-age=63072000'};
    return response;
  }

  // Return response to viewers
  return response;
}