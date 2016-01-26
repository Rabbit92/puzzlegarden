<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// var_dump(get_included_files()); exit;
// var_dump(defined('DB_HOST')); exit;

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'puzzle');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'admin');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'KX6U :Sxy &Xd}|6+Q/+gLwDCF<z+e_e8/hoB+hdM`YDQn1VX#3(+qvdb= mQys+');
define('SECURE_AUTH_KEY',  'zo~U.6~(^`VBDL&D-r|xX>pb/kYb4Z4+ATU/{V<`{.#50Nn~ac{@[b*Wf~h_x4P%');
define('LOGGED_IN_KEY',    ')g,1)NW61|[Jsw:Czg5E||G`|Zfp%pL+,7r|hD`|^WmTi33u| ,S>O4XxM|-m6Jn');
define('NONCE_KEY',        '>}=bK1n [CRx{u3WWyRRX}_!F]Xq=zVMLn/8C57Ahs.|fsW~97d{PQw~)rExUC}v');
define('AUTH_SALT',        'vpw^)4x8>ajeNK7~iHk-j1pzjfUeyV@<g`WYt) |_]nTv+y=myy.W@&MV%~zKUX&');
define('SECURE_AUTH_SALT', 's_t.Hb3ISWu Iy%~~O#@Gp*(GaJv3x!lhq=1r,9L+W*+)&R<HgGr|}|MxTM=3s/d');
define('LOGGED_IN_SALT',   '^)b6-b5^3YGICC%gX}JRya)xNT0u8E(L+VC</+B34cu]$p!{=Q` +-OMv|rO*a]k');
define('NONCE_SALT',       'Ouc=XIj{;v,:kTPjHtVWJh1/)$B8-Ht w}!BACE~hs]0Y(fG~(ka@H/QSP{+>vy&');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', true);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

require_once(ABSPATH . 'laravel-load.php');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
