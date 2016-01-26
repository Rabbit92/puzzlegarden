<?php
if (defined('LARAVEL_START')) {
    // Do not load Laravel again
    return;
}
require __DIR__.'/../bootstrap/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

// set the public path to this directory
$app->bind('path.public', function() {
    return __DIR__;
});

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);
