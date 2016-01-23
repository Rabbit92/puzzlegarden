<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Garden_Puzzle
 * @subpackage Garden_Puzzle/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Garden_Puzzle
 * @subpackage Garden_Puzzle/public
 * @author     Cornel Borina <cornel@borina.ro>
 */
class Garden_Puzzle_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $garden_puzzle    The ID of this plugin.
	 */
	private $garden_puzzle;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $garden_puzzle       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $garden_puzzle, $version ) {

		$this->garden_puzzle = $garden_puzzle;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Garden_Puzzle_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Garden_Puzzle_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->garden_puzzle, plugin_dir_url( __FILE__ ) . 'css/garden-puzzle-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Garden_Puzzle_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Garden_Puzzle_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->garden_puzzle, plugin_dir_url( __FILE__ ) . 'js/garden-puzzle-public.js', array( 'jquery' ), $this->version, false );

	}

}
