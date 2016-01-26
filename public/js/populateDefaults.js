function populateDefaults(dest, src) {
    for (var key in src) {
        if (! isset(dest[key])) {
            dest[key] = src[key];
        }
    }
    
    return dest;
}