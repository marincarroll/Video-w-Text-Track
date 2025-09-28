/**
 * External dependencies.
 */
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin( ScrollTrigger );

/**
 * Internal dependencies.
 */
import { VisualCue } from './class-visual-cue';

/**
 * Visual representation of a video's TextTrack.
 */
export class VisualTextTrack {
	/**
	 * Array of VisualCues associated with the VisualTextTrack.
	 *
	 * @type {[VisualCue]}
	 */
	visualCues = [];

	/**
	 * Creates a new VisualTextTrack.
	 *
	 * @param {HTMLElement} element
	 */
	constructor( element ) {
		/**
		 * The encompassing parent element containing video, track, and visual
		 * representation of track.
		 */
		this.element = element;

		/**
		 * The default <track> element.
		 *
		 * @type {HTMLTrackElement}
		 */
		this.trackElement = element.querySelector( 'track[default]' );

		/**
		 * Bail early if there is no default <track>.
		 */
		if ( ! this.trackElement ) {
			// eslint-disable-next-line no-console
			console.warn(
				'No text track of kind "Captions" or "Subtitles" was uploaded to the Video with Text Track block.'
			);
			return;
		}

		/**
		 * The track being visually represented.
		 *
		 * @type {TextTrack}
		 */
		this.track = this.trackElement.track;

		/**
		 * Wrapper element to contain visual representation of track.
		 *
		 * @type {HTMLElement}
		 */
		this.textWrapper = element.querySelector(
			'.video-text-track__scroller'
		);

		/**
		 * The <video> element.
		 *
		 * @type {HTMLVideoElement}
		 */
		this.video = element.querySelector( 'video' );

		this.setupTrack();
		this.playOnEnter();
	}

	/**
	 * If the text track is already loaded, sets up its cues. Otherwise, do so
	 * when the track finishes loading.
	 */
	setupTrack() {
		const { readyState } = this.trackElement;
		const { LOADED } = window.HTMLTrackElement;

		if ( readyState >= LOADED ) {
			this.setupCues();
		} else {
			this.trackElement.addEventListener( 'load', () => {
				this.setupCues();
			} );
		}
	}

	/**
	 * Creates VisualCues based on the track's cues.
	 */
	setupCues() {
		// TODO docs - cue is type VTTCue which extends TextTrackCue - not sure
		//  how to document or if this is a bug in WebVTT API docs
		Object.values( this.track.cues ).forEach( ( cue ) => {
			const visualCue = new VisualCue( cue, this.textWrapper );
			this.visualCues.push( visualCue );
		} );

		this.track.addEventListener( 'cuechange', () => this.onCuechange() );
	}

	/**
	 * Visually deactivates previously active cue. Scrolls to the cue closest to
	 * the playhead. If that cue is also active, visually activates it.
	 *
	 * Note we are not using TextTrackCue's 'enter'/'exit' events because they
	 * don't fire when video is seeked to the middle of a cue.
	 */
	onCuechange() {
		this.latestCue?.deactivate();
		this.updateLatestCue();

		if ( ! this.track.activeCues.length ) {
			this.latestCue.scrollTo();
		} else {
			this.latestCue.activate();
		}
	}

	/**
	 * Finds and stores the closest cue prior to the playhead.
	 */
	updateLatestCue() {
		let nextLatestCue = this.visualCues.findLast( ( visualCue ) => {
			return visualCue.cue.startTime <= this.video.currentTime;
		} );

		if ( ! nextLatestCue ) {
			nextLatestCue = this.visualCues[ 0 ];
		}

		/**
		 * The closest cue prior to the playhead.
		 *
		 * @type {VisualCue}
		 */
		this.latestCue = nextLatestCue;
	}

	/**
	 * Plays video when it enters the viewport.
	 */
	playOnEnter() {
		ScrollTrigger.create( {
			trigger: this.element,
			pin: true,
			start: 'center center',
			end: '+=2000',
			onEnter: () => {
				this.video.play();
			},
		} );
	}
}
