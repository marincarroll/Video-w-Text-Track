import {
	store as blockEditorStore,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { useCallback, useEffect } from '@wordpress/element';
import { Placeholder } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * WebVTT TextTrack kinds that are not intended for visual display.
 *
 * Visual kinds are 'subtitles' (the default) and 'captions'.
 *
 * @see [TextTrack: kind property](https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/kind)
 *
 * @type {string[]}
 */
const INVIABLE_DEFAULT_TRACK_KINDS = [ 'metadata', 'chapters', 'descriptions' ];

const Edit = ( { clientId } ) => {
	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	const blockProps = useBlockProps( {
		className: 'video-text-track',
	} );
	const { children, ...innerBlocksProps } = useInnerBlocksProps( blockProps, {
		template: [
			[
				'core/video',
				{
					muted: true,
				},
			],
		],
		templateLock: 'contentOnly',
	} );

	/**
	 * The inner core/video block.
	 */
	const [ videoBlock ] = useSelect(
		( select ) => {
			const { getBlocks } = select( blockEditorStore );
			return getBlocks( clientId );
		},
		[ clientId ]
	);

	const videoBlockClientId = videoBlock?.clientId;
	const tracks = videoBlock?.attributes?.tracks;
	const defaultTrack = tracks?.find( ( track ) => track.default );

	/**
	 *  Updates core/video's 'tracks' attribute so the visually displayed track
	 *  includes 'default' property.
	 *
	 *  This serves as an HTML attribute in the rendered <track> element.
	 *
	 *  @see [<track> attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track#attributes)
	 */
	const setTracksAttribute = useCallback(
		( nextDefault ) => {
			const nextTracks = tracks;
			nextTracks.forEach( ( track ) => {
				track.default = track === nextDefault;
			} );
			updateBlockAttributes( videoBlockClientId, { nextTracks } );
		},
		[ tracks, updateBlockAttributes, videoBlockClientId ]
	);

	// TODO Add something to inspector controls in case there is more than one
	//  viable track added and the user wants to use a different one.
	/**
	 * When core/video's 'tracks' attribute changes, selects the the first track
	 * of a kind viable for visual display as the default.
	 */
	useEffect( () => {
		if ( ! tracks || ! tracks.length ) {
			return;
		}

		const firstViableDefault = tracks.find( ( track ) => {
			return ! INVIABLE_DEFAULT_TRACK_KINDS.includes( track.kind );
		} );

		setTracksAttribute( firstViableDefault );
	}, [ tracks, setTracksAttribute ] );

	return (
		<div { ...innerBlocksProps }>
			<div className="video-text-track__inner">
				{ children }
				<div className="video-text-track__text">
					<div className="video-text-track__scroller">
						{ defaultTrack ? (
							<p>{ defaultTrack.label }</p>
						) : (
							<Placeholder
								icon="warning"
								label={ __(
									'No text tracks added',
									'marincarroll'
								) }
								instructions={ __(
									"Add a text track of kind 'Captions' or 'Subtitles' to the video block to continue.",
									'marincarroll'
								) }
							/>
						) }
					</div>
				</div>
			</div>
		</div>
	);
};

export default Edit;
