/**
 * External dependencies
 */
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

gsap.registerPlugin( ScrollToPlugin );

/**
 * Visual representation of a VTTCue. Used within a VisualTextTrack.
 */
export class VisualCue {
	/**
	 * HTML element representing the cue.
	 *
	 * @type {HTMLElement}
	 */
	textElement = document.createElement( 'span' );

	/**
	 * Creates a new VisualCue.
	 *
	 * @param {VTTCue}      cue
	 * @param {HTMLElement} parentElement
	 */
	constructor( cue, parentElement ) {
		/**
		 * VTTCue extracted from parent track.
		 */
		this.cue = cue;
		/**
		 * Element containing the parent track's VisualCue text elements.
		 */
		this.parentElement = parentElement;

		this.appendTextElement();
	}

	/**
	 * Sets up text element to include cue data and appends it to the parent.
	 */
	appendTextElement() {
		this.textElement.innerHTML = this.cue.text;
		// TODO add per-block id so block can appear multiple times per page
		this.textElement.id = 'cue-' + this.cue.id;

		gsap.set( this.textElement, { autoAlpha: 0.2 } );
		this.parentElement.appendChild( this.textElement );
	}

	/**
	 * Visually activates text element.
	 */
	activate() {
		gsap.to( this.textElement, { autoAlpha: 1 } );
		this.scrollTo();
	}

	/**
	 * Visually deactivates text element.
	 */
	deactivate() {
		gsap.to( this.textElement, { autoAlpha: 0.2 } );
	}

	/**
	 * Scrolls parent element to center text element in the scroll container.
	 */
	scrollTo() {
		gsap.to( this.parentElement, {
			scrollTo: {
				y: '#' + this.textElement.id,
				offsetY: () => this.parentElement.clientHeight / 2,
			},
			duration: 0.3,
		} );
	}
}
