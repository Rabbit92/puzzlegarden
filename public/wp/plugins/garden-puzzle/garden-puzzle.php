<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://gradinapuzzle.ro
 * @since             1.0.0
 * @package           Garden_Puzzle
 *
 * @wordpress-plugin
 * Plugin Name:       Gradina Puzzle
 * Plugin URI:        http://gradinapuzzle.ro/despre-noi/
 * Description:       Acest plugin adauga sectiuni de administrare pentru Gradina Puzzle. Daca dezactivezi acest pugin, nu vei mai putea administra site-ul
 * Version:           1.0.0
 * Author:            Cornel Borina
 * Author URI:        http://cornel.borina.ro/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       garden-puzzle
 * Domain Path:       /languages
 */
// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-garden-puzzle-activator.php
 */
function activate_garden_puzzle() {
    \App\Admin\Plugin::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-garden-puzzle-deactivator.php
 */
function deactivate_garden_puzzle() {
    \App\Admin\Plugin::deactivate();
}

register_activation_hook(__FILE__, 'activate_garden_puzzle');
register_deactivation_hook(__FILE__, 'deactivate_garden_puzzle');

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_garden_puzzle() {
    $plugin = new \App\Admin\Plugin(plugin_dir_path(__FILE__));
    $plugin->run();
}

run_garden_puzzle();
