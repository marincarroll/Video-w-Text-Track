<?php
namespace Marincarroll\VideoWithTextTrack;

/**
 * Plugin Name:       Video with Text Track
 * Description:       Displays a muted video with a synced text track beside it.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Marin Carroll
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       marincarroll
 *
 * @package Marincarroll
 * @subpackage VideoWithTextTrack
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * TODO
 */
function register_video_text_track_block_type() {
	register_block_type( __DIR__ . "/build/block.json" );
}

add_action( 'init', 'Marincarroll\VideoWithTextTrack\register_video_text_track_block_type' );

