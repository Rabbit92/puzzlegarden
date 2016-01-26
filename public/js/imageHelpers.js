function fullImageURL(hash) {
    return IMAGES_URL + '/full/' + hash ;
}

function fitImageURL(hash, options) {
    var url = IMAGES_URL + '/fit/' + hash + '?';
    var params = [];
    
    for (var attr in options) {
        params.push(attr + '=' + (options[attr]));
    }
    
    return url + params.join('&');
}

function cropImageURL(hash, options) {
    var url = IMAGES_URL + '/crop-fit/' + hash + '?';
    var params = [];
    
    for (var attr in options) {
        params.push(attr + '=' + (options[attr]));
    }
    
    return url + params.join('&');
}