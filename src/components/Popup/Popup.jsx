import React from 'react';
import {PURE} from 'dx-util/lib/react/pure';
import {themr} from 'react-css-themr';
import classnames from 'classnames';
import Portal from 'react-overlays/lib/Portal';
import RootClose from 'react-overlays/lib/RootCloseWrapper';

export const POPUP = Symbol('Popup');

export const POPUP_THEME_SHAPE_OBJECT = {
	container: React.PropTypes.string,
	header: React.PropTypes.string,
	body: React.PropTypes.string,
	footer: React.PropTypes.string
};

@themr(POPUP)
@PURE
export default class Popup extends React.Component {
	static propTypes = {
		children: React.PropTypes.node.isRequired,
		header: React.PropTypes.node,
		footer: React.PropTypes.node,

		theme: React.PropTypes.shape(POPUP_THEME_SHAPE_OBJECT),

		isModal: React.PropTypes.bool,
		isOpened: React.PropTypes.bool,

		shouldCloseOnClickAway: React.PropTypes.bool,
		onRequestClose: React.PropTypes.func,

		container: Portal.propTypes.container
	}

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
				[theme.backdrop_isModal]: isModal,
				[theme.backdrop_closeOnClickAway]: shouldCloseOnClickAway
			}
		);

		let child = (
			<div className={backdropClassName}>
				<div className={theme.container}>
					{header && <div className={theme.header}>{header}</div>}
					{children && <div className={theme.body}>{children}</div>}
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