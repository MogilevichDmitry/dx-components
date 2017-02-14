import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {PURE} from 'dx-util/src/react/pure';
import Input from '../Input/Input';
import {themr} from 'react-css-themr';
import ButtonIcon, {BUTTON_ICON_THEME} from '../ButtonIcon/ButtonIcon';
import Holdable from '../Holdable/Holdable';

export const STEPPABLE_INPUT_THEME = {
	container: React.PropTypes.string,
	ButtonIcon: React.PropTypes.shape(BUTTON_ICON_THEME)
};

const KEYCODE = {
	UP: 38,
	DOWN: 40
};

export type TSteppableInputInjectedProps = {
	theme: {
		container?: string,
		container_isFocused?: string,
		input?: string,
		ButtonIcon?: BUTTON_ICON_THEME,
		ClearButtonIcon?: BUTTON_ICON_THEME
	}
};

export type TSteppableInputOwnProps = {
	tabIndex?: number,
	isDisabled?: boolean,
	onIncrement?: Function,
	onDecrement?: Function,
	onClear?: Function,
	incrementIcon?: string,
	decrementIcon?: string,
	clearIcon?: string,
	onFocus?: React.EventHandler<React.FocusEvent<HTMLElement>>,
	onBlur?: React.EventHandler<React.FocusEvent<HTMLElement>>,
	onKeyDown?: React.EventHandler<React.KeyboardEvent<HTMLElement>>,
	children?: React.ReactNode
};

export type TSteppableInputDefaultProps = {
	Input: typeof Input,
	ButtonIcon: typeof ButtonIcon
};

export type TSteppableInputFullProps =
	TSteppableInputInjectedProps & TSteppableInputOwnProps & TSteppableInputDefaultProps;

type TSteppableInputState = {
	isFocused?: boolean
};

@PURE
class SteppableInput extends React.Component<TSteppableInputFullProps, TSteppableInputState> {
	static defaultProps = {
		Input,
		ButtonIcon
	} as TSteppableInputFullProps;

	state: TSteppableInputState = {};

	componentDidUpdate(prevProps: TSteppableInputFullProps) {
		if (prevProps.onClear && !this.props.onClear) {
			//when removing clear button from dom component wierdly loses focus
			ReactDOM.findDOMNode<HTMLElement>(this).focus();
		}
	}

	render() {
		const {
			isDisabled,
			theme,
			children,
			tabIndex,
			decrementIcon,
			incrementIcon,
			clearIcon,
			onIncrement,
			onDecrement,
			onClear,
			Input,
			ButtonIcon
		} = this.props;

		const {isFocused} = this.state;

		return (
			<Input tagName="div"
			       theme={theme}
			       onFocus={this.onFocus}
			       onBlur={this.onBlur}
			       onKeyDown={this.onKeyDown}
			       onWheel={this.onWheel}
			       isFocused={isFocused}
			       tabIndex={(isFocused || isDisabled ) ? -1 : (tabIndex || 0)}
			       disabled={isDisabled}>
				{children}
				{onClear && clearIcon && (
					<ButtonIcon name={clearIcon}
					            isFlat={true}
					            theme={theme.ClearButtonIcon}
					            onClick={this.onClearClick}
					            onMouseDown={this.onButtonMouseDown}
					            isDisabled={isDisabled}
					            tabIndex={-1}/>
				)}
				{onDecrement && decrementIcon && (
					<Holdable onHold={onDecrement}>
						<ButtonIcon name={decrementIcon}
						            theme={theme.ButtonIcon}
						            onClick={this.onDecrementClick}
						            onMouseDown={this.onButtonMouseDown}
						            isDisabled={isDisabled}
						            tabIndex={-1}/>
					</Holdable>
				)}
				{onIncrement && incrementIcon && (
					<Holdable onHold={onIncrement}>
						<ButtonIcon name={incrementIcon}
						            theme={theme.ButtonIcon}
						            onClick={this.onIncrementClick}
						            onMouseDown={this.onButtonMouseDown}
						            isDisabled={isDisabled}
						            tabIndex={-1}/>
					</Holdable>
				)}
			</Input>
		);
	}

	private onClearClick = (e: React.MouseEvent<HTMLElement>) => {
		const {onClear} = this.props;
		onClear && onClear();
	}

	private onIncrementClick = (e: React.MouseEvent<HTMLElement>) => {
		const {onIncrement} = this.props;
		onIncrement && onIncrement();
	}

	private onDecrementClick = (e: React.MouseEvent<HTMLElement>) => {
		const {onDecrement} = this.props;
		onDecrement && onDecrement();
	}

	private onButtonMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (this.state.isFocused) {
			e.preventDefault();
		}
	}

	private onFocus = (e: React.FocusEvent<HTMLElement>) => {
		if (!this.props.isDisabled && !this.state.isFocused) {
			this.setState({
				isFocused: true
			});
			this.props.onFocus && this.props.onFocus(e);
		}
	}

	private onBlur = (e: React.FocusEvent<HTMLElement>) => {
		if (!this.props.isDisabled && this.state.isFocused) {
			this.setState({
				isFocused: false
			});
			this.props.onBlur && this.props.onBlur(e);
		}
	}

	private onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			switch (e.keyCode) {
				case KEYCODE.UP: {
					this.props.onIncrement && this.props.onIncrement();
					break;
				}
				case KEYCODE.DOWN: {
					this.props.onDecrement && this.props.onDecrement();
					break;
				}
			}
			this.props.onKeyDown && this.props.onKeyDown(e);
		}
	}

	private onWheel = (e: React.WheelEvent<HTMLElement>) => {
		const {isDisabled, onIncrement, onDecrement} = this.props;
		const {isFocused} = this.state;

		if (!isDisabled && isFocused) {
			if (e.deltaY < 0) {
				onIncrement && onIncrement();
			} else {
				onDecrement && onDecrement();
			}
		}
	}
}

export const STEPPABLE_INPUT = Symbol('SteppableInput');
export type TSteppableInputProps =
	TSteppableInputOwnProps & Partial<TSteppableInputInjectedProps> & Partial<TSteppableInputDefaultProps>;
export default themr(STEPPABLE_INPUT)(SteppableInput) as React.ComponentClass<TSteppableInputProps>;