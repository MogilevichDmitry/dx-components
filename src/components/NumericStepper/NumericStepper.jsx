import React, {PropTypes, Component} from 'react';
import {themr} from 'react-css-themr';
import {DEBOUNCE} from 'dx-util/src/function/function.js';
import {PURE} from 'dx-util/src/react/pure';
import Input from '../Input/Input.jsx';
import ButtonIcon from '../ButtonIcon/ButtonIcon.jsx';
import Button from '../Button/Button.jsx';
import classnames from 'classnames';

export const NUMERIC_STEPPER = Symbol('NumericStepper');

const BUTTON_TYPE = {
	UP: 'up',
	DOWN: 'down'
};

const KEYCODE = {
	UP: 38,
	DOWN: 40
};

@PURE
@themr(NUMERIC_STEPPER)
export default class NumericStepper extends Component {

	static propTypes = {
		...Input.propTypes,
		step: React.PropTypes.number,
		min: React.PropTypes.number,
		max: React.PropTypes.number,
		formatter: React.PropTypes.func,
		ButtonComponent: React.PropTypes.func,
		InputComponent: React.PropTypes.func,

		repeatInterval: React.PropTypes.number,
		repeatDelay: React.PropTypes.number,

		upIconName: React.PropTypes.string,
		downIconName: React.PropTypes.string,

		theme: React.PropTypes.shape({
			container: React.PropTypes.string,
			container__input: React.PropTypes.string,
			container__input_isCorrected: React.PropTypes.string,
			container__buttons: React.PropTypes.string,
			container__button: React.PropTypes.string,
			container__button__icon: React.PropTypes.string,
			container__button_up: React.PropTypes.string,
			container__button_down: React.PropTypes.string
		})
	};

	constructor(props) {
		super(props);

		this.state = {
			value: props.value,
			isCorrected: false,
			isFocused: false
		};
	}

	static defaultProps = {
		step: 1,
		max: Infinity,
		min: 0,
		value: 1,
		pattern: /^-?[0-9]\d*(\.\d+)?$/,
		isDisabled: false,
		InputComponent: Input,
		ButtonComponent: ButtonIcon
	};

	setValue(newValue) {
		const {value} = this.state;
		const {onChange} = this.props;

		const correctedValue = this.getCorrectedValue(newValue);

		const isChanged = correctedValue !== value;
		const isCorrected = correctedValue !== newValue;

		if (isChanged) {
			this.setState({
				value: correctedValue,
				isCorrected
			});
			onChange && onChange(correctedValue);
		}

		if (!isChanged && isCorrected) {
			this.setState({
				isCorrected
			});
		}
	}

	getCorrectedValue(value) {
		const {min, max} = this.props;
		let newValue = parseFloat(value);
		if (newValue < min) {
			newValue = min;
		}
		if (newValue > max) {
			newValue = max;
		}
		return newValue;
	}

	step(n) {
		const {value} = this.state;
		const {step} = this.props;
		const newValue = (value || 0) + (step * n);
		this.setValue(newValue);
	}

	increase = () => {
		this.step(1);
	}

	decrease = () => {
		this.step(-1);
	}

	componentWillReceiveProps(newProps) {
		this.setValue(newProps.value);
	}

	componentWillUpdate(newProps, newState) {
		if (newState.isCorrected) {
			const timout = setTimeout(() => {
				this.setState({
					isCorrected: !newState.isCorrected
				});
				clearTimeout(timout);
			}, 750);
		}
	}

	render() {
		const {value, isFocused, isCorrected} = this.state;

		const {
			theme,
			formatter,
			min,
			max,
			upIconName,
			downIconName,
			isDisabled,
			pattern,
			repeatInterval,
			repeatDelay,
			InputComponent: Input,
			ButtonComponent: Button,
		} = this.props;

		const formatValue = formatter ? formatter(value) : value;

		const inputTheme = {
			container: classnames(theme.container__input, {
				[theme.container__input_isCorrected]: isCorrected
			})
		};

		const {onWheel, onChange, onBlur, onFocus, onKeyDown} = this;

		const inputProps = {
			value: formatValue,
			isDisabled,
			onBlur,
			onChange,
			onFocus,
			pattern,
			onKeyDown,
			theme: inputTheme
		};

		if (!isDisabled && isFocused) {
			inputProps.onWheel = onWheel;
		}
		const buttonTheme = Object.keys(BUTTON_TYPE).reduce((acc, current) => {
			return {
				...acc,
				[current]: {
					container: classnames(theme.container__button, theme[`container__button_${BUTTON_TYPE[current]}`]),
					icon: classnames(theme.container__button__icon)
				}
			};
		}, {});

		return (
			<div className={theme.container}>
				<Input {...inputProps} />
				<div className={theme.container__buttons}>
					<Holdable onHold={this.onButtonDownClick} delay={repeatDelay} interval={repeatInterval}
							  isDisabled={isDisabled || value <= min}>
						<Button onClick={this.onButtonDownClick}
								name={downIconName}
								theme={buttonTheme.UP} />
					</Holdable>
					<Holdable onHold={this.onButtonUpClick} delay={repeatDelay} interval={repeatInterval}
							  isDisabled={isDisabled || value >= max}>
						<Button onClick={this.onButtonUpClick}
								theme={buttonTheme.DOWN}
								name={upIconName} />
					</Holdable>
				</div>
			</div>
		);
	}

	onKeyDown = event => {
		switch (event.keyCode) {
			case KEYCODE.UP:
				this.increase();
				break;
			case KEYCODE.DOWN:
				this.decrease();
				break;
		}
	}

	onFocus = () => {
		this.setState({
			isFocused: true
		});
	}

	onBlur = () => {
		const {value} = this.state;
		const {onBlur} = this.props;
		this.setValue(value);
		this.setState({
			isFocused: false
		});

		onBlur && onBlur();
	}

	onWheel = e => {
		if (e.deltaY < 0) {
			this.increase();
		} else {
			this.decrease();
		}
	}

	@DEBOUNCE(200)
	onChange = (value) => {
		const newValue = parseFloat(value);
		const {isFocused} = this.state;
		if (!isFocused) {
			this.setValue(newValue);
		} else {
			this.setState({
				value: newValue
			});
		}
	}

	onButtonDownClick = () => {
		this.decrease();
	}

	onButtonUpClick = () => {
		this.increase();
	}
}

class Holdable extends React.Component {

	static propTypes = {
		children: React.PropTypes.element,
		delay: React.PropTypes.number,
		isDisabled: React.PropTypes.bool,
		interval: React.PropTypes.number,
		onHold: React.PropTypes.func
	}

	_timeout
	_interval;

	static defaultProps = {
		interval: 50,
		delay: 300
	};

	componentWillReceiveProps(newProps) {
		if (newProps.isDisabled) {
			this.stop();
		}
	}

	onMouseDown = () => {
		const {interval, delay, onHold} = this.props;
		this._timeout = setTimeout(() => {
			this._interval = setInterval(() => {
				onHold && onHold();
			}, interval);
		}, delay);
	}

	stop() {
		clearTimeout(this._timeout);
		clearInterval(this._interval);
	}

	onMouseUp = () => {
		this.stop();
	}

	render() {
		const {children: element, isDisabled} = this.props;
		const {onMouseDown, onMouseUp, ...props} = element.props;
		const newProps = {
			props,
			isDisabled,
			onMouseDown: () => {
				this.onMouseDown();
				onMouseDown && onMouseDown();
			},
			onMouseUp: () => {
				this.onMouseUp();
				onMouseUp && onMouseUp();
			}
		};

		return (
			React.cloneElement(element, newProps)
		);
	}
}