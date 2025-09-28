/**
 * Internal dependencies.
 */
import { VisualTextTrack } from './class-visual-text-track';
document.querySelectorAll( '.video-text-track__inner' ).forEach( ( block ) => {
	new VisualTextTrack( block );
} );
