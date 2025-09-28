/**
 * WordPress dependencies
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const save = () => {
	const blockProps = useBlockProps.save( {
		className: 'video-text-track',
	} );
	const { children, ...innerBlocksProps } =
		useInnerBlocksProps.save( blockProps );
	return (
		<div { ...innerBlocksProps }>
			<div className="video-text-track__inner">
				{ children }
				<div className="video-text-track__text">
					<div
						className="video-text-track__scroller"
						aria-label={ __( 'Video transcript', 'marincarroll' ) }
					></div>
				</div>
			</div>
		</div>
	);
};

export default save;
