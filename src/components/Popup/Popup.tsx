import * as React from 'react';
import { PURE } from 'dx-util/lib/react/pure';
import * as classnames from 'classnames';
import * as Portal from 'react-overlays/lib/Portal';
import * as RootClose from 'react-overlays/lib/RootCloseWrapper';
import * as PropTypes from 'prop-types';
import { Component, ReactNode } from 'react';
import { ObjectClean } from 'typelevel-ts';
import { PartialKeys } from 'dx-util/lib/object/object';
import { withTheme } from '../../util/react/withTheme';

export const POPUP = Symbol('Popup');

export type TRawPopupProps = {
	theme: {
		container?: string,
		header?: string,
		body?: string,
		footer?: string,
		backdrop?: string,
		backdrop_isModal?: string,
		backdrop_closeOnClickAway?: string,
	},
	children: ReactNode,
	header?: ReactNode,
	footer?: ReactNode,

	isModal?: boolean,
	isOpened?: boolean,

	shouldCloseOnClickAway?: boolean,
	onRequestClose?: () => any,

	container: ReactOverlays.Portal.TPortalProps['container']
};

export const POPUP_THEME_SHAPE_OBJECT = {
	container: PropTypes.string,
	header: PropTypes.string,
	body: PropTypes.string,
	footer: PropTypes.string
};

@PURE
class RawPopup extends Component<TRawPopupProps> {
	render() {
		const {
			theme,
			header,
			children,
			footer,
			isModal,
			container,
			isOpened,
			shouldCloseOnClickAway,
			onRequestClose
		} = this.props;

		if (!isOpened) {
			return null;
		}

		const backdropClassName = classnames(
			theme.backdrop,
			{
				[theme.backdrop_isModal as string]: isModal,
				[theme.backdrop_closeOnClickAway as string]: shouldCloseOnClickAway
			}
		);

		let child = (
			<div className={backdropClassName}>
				<div className={theme.container}>
					{header && <div className={theme.header}>{header}</div>}
					{<div className={theme.body}>{children}</div>}
					{footer && <div className={theme.footer}>{footer}</div>}
				</div>
			</div>
		);

		if (shouldCloseOnClickAway) {
			child = (
				<RootClose onRootClose={onRequestClose}>
					{child}
				</RootClose>
			);
		}

		child = (
			<Portal container={container}>
				{child}
			</Portal>
		);

		return child;
	}
}

export type TPopupProps = ObjectClean<PartialKeys<TRawPopupProps, 'theme'>>;
export const Popup = withTheme(POPUP)(RawPopup);