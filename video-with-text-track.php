<?php
namespace Marincarroll\VideoWithTextTrack;

/**
 * Plugin Name:       Video with Text Trck
 * Description:       Displays a muted video with a synced text track beside it.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Marin Carroll
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       video-with-text-track
 *
 * @package Marincarroll
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

function register_video_text_track_block_type() {
	register_block_type( __DIR__ . "/build/block.json" );
}

add_action( 'init', 'Marincarroll\VideoWithTextTrack\register_video_text_track_block_type' );

