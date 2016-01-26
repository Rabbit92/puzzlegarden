<?php
// Let Wordpress Plugin that this is a Laravel-first context
define('LARAVEL_CONTEXT', true);

/**
 * Laravel - A PHP Framework For Web Artisans
 *
 * @package  Laravel
 * @author   Taylor Otwell <taylorotwell@gmail.com>
 */
/*
  |--------------------------------------------------------------------------
  | Register The Auto Loader
  |--------------------------------------------------------------------------
  |
  | Composer provides a convenient, automatically generated class loader for
  | our application. We just need to utilize it! We'll simply require it
  | into the script here so that we don't have to worry about manual
  | loading any of our classes later on. It feels nice to relax.
  |
 */

require __DIR__ . '/../bootstrap/autoload.php';

/*
  |--------------------------------------------------------------------------
  | Turn On The Lights
  |--------------------------------------------------------------------------
  |
  | We need to illuminate PHP development, so let us turn on the lights.
  | This bootstraps the framework and gets it ready for use, then it
  | will load up this application so that we can run it and send
  | the responses back to the browser and delight our users.
  |
 */

$app = require_once __DIR__ . '/../bootstrap/app.php';

// set the public path to this directory
$app->bind('path.public', function() {
    return __DIR__;
});

/*
  |--------------------------------------------------------------------------
  | Run The Application
  |--------------------------------------------------------------------------
  |
  | Once we have the application, we can handle the incoming request
  | through the kernel, and send the associated response back to
  | the client's browser allowing them to enjoy the creative
  | and wonderful application we have prepared for them.
  |
 */

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

/**
 * Tells WordPress to load the WordPress theme and output it.
 *
 * @var bool
 */
define('WP_USE_THEMES', false);

/** Loads the WordPress Environment and Template */
require( dirname( __FILE__ ) . '/wp-blog-header.php' );

$response = $kernel->handle(
        $request  = Illuminate\Http\Request::capture()
);

$response->send();

$kernel->terminate($request, $response);
