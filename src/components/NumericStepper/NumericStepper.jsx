import React from 'react';
import {themr} from 'react-css-themr';
import {PURE} from 'dx-util/src/react/pure';
import Input from '../Input/Input.jsx';
import Holdable from '../Holdable/Holdable.jsx';
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
export default class NumericStepper extends React.Component {

	static propTypes = {
		pattern: React.PropTypes.instanceOf(RegExp),
		isDisabled: React.PropTypes.bool,
		onChange: React.PropTypes.func,
		formatter: React.PropTypes.func,
		defaultValue(props) {
			const {defaultValue, value, min, max} = props;
			const type = typeof defaultValue;
			if (type !== 'undefined') {
				if (type !== 'number') {
					throw new Error('DefaultValue should be a number');
				} else {
					if (defaultValue < min || defaultValue > max) {
						throw new Error(`DefaultValue: ${defaultValue} should be greater than min: ${min} 
						and lower than max: ${max}`);
					}
				}
			} else {
				if (typeof value === 'undefined') {
					throw new Error('Either defaultValue or value should be specified');
				}
			}
		},
		value(props) {
			const {defaultValue, value, min, max} = props;
			const type = typeof value;
			if (type !== 'undefined') {
				if (type !== 'number') {
					throw new Error('Value should be a number');
				} else {
					if (value < min || value > max) {
						throw new Error(`Value: ${value} should be greater than min: ${min} 
						and lower than max: ${max}`);
					}
				}
			} else {
				if (typeof defaultValue === 'undefined') {
					throw new Error('Either defaultValue or value should be specified');
				}
			}
		},
		min(props) {
			const {min, max} = props;
			const type = typeof min;
			if (type !== 'undefined') {
				if (type !== 'number') {
					throw new Error('Min should be a number');
				} else {
					if (min >= max) {
						throw new Error('Invalid min value. Min value should be lower than max');
					}
				}
			}
		},
		max(props) {
			const {min, max} = props;
			const type = typeof max;
			if (type !== 'undefined') {
				if (type !== 'number') {
					throw new Error('Max should be a string or a number');
				} else {
					if (max <= min) {
						throw new Error('Invalid Max value. Max value should be greater than min');
					}
				}
			}
		},
		step: React.PropTypes.number,
		HoldableComponent: React.PropTypes.func,
		ButtonComponent: React.PropTypes.func,
		InputComponent: React.PropTypes.func,

		repeatInterval: React.PropTypes.number,
		repeatDelay: React.PropTypes.number,

		upIconName: React.PropTypes.string,
		downIconName: React.PropTypes.string,

		theme: React.PropTypes.shape({
			container: React.PropTypes.string,
			container_isInvalid: React.PropTypes.string,
			input: React.PropTypes.string,
			buttons: React.PropTypes.string,
			button: React.PropTypes.string,
			button__icon: React.PropTypes.string,
			button_up: React.PropTypes.string,
			button_down: React.PropTypes.string
		})
	};

	constructor(...args) {
		super(...args);
		const {defaultValue, value} = this.props;

		this.state = {
			isFocused: false
		};

		if (typeof value !== 'undefined') {
			this.state = {
				...this.state,
				value
			};
		} else if (typeof defaultValue !== 'undefined') {
			this.state = {
				...this.state,
				value: defaultValue
			};
		}
	}

	componentWillReceiveProps(newProps) {
		const {defaultValue} = newProps;
		const newPropsContainNewValue = typeof newProps.value !== 'undefined';
		if (newPropsContainNewValue) {
			this.setState({
				value: newProps.value
			});
		} else {
			const previousValueIsReset = typeof this.props.value !== 'undefined' && !newPropsContainNewValue;
			if (previousValueIsReset) {
				this.setState({
					value: (void 0), //eslint-disable-line no-void
				});
			}
			const hasCurrentValue = typeof this.state.value !== 'undefined';
			const newPropsContainNewDefaultValue = typeof newProps.defaultValue !== 'undefined';
			const shouldSetNewDefaultValue =
				(previousValueIsReset || !hasCurrentValue) && newPropsContainNewDefaultValue;

			if (shouldSetNewDefaultValue) {
				this.setState({
					value: defaultValue,
				});
			}
		}
	}

	static defaultProps = {
		step: 1,
		pattern: /^-?$|^-?\d*([.]\d*)?$/,
		max: Infinity,
		min: -Infinity,
		isDisabled: false,
		HoldableComponent: Holdable,
		InputComponent: Input,
		ButtonComponent: ButtonIcon
	};

	setValue(newValue) {
		const {value} = this.state;
		const {onChange} = this.props;

		if (newValue !== value) {
			this.setState({
				value: newValue
			});
			onChange && onChange(newValue);
		}
	}

	step(n) {
		const {value} = this.state;
		const {step, min, max} = this.props;
		const newValue = (value || 0) + (step * n);
		if (newValue >= min || newValue <= max) {
			this.setValue(newValue);
		}
	}

	increase = () => {
		this.step(1);
	}

	decrease = () => {
		this.step(-1);
	}

	render() {
		const {value, isFocused} = this.state;

		const {
			theme,
			min,
			formatter,
			max,
			upIconName,
			downIconName,
			isDisabled,
			pattern,
			HoldableComponent: Holdable,
			InputComponent: Input,
			ButtonComponent: Button,
		} = this.props;

		const formattedValue = formatter ? formatter(value) : value;

		const {onWheel, onChange, onBlur, onFocus, onKeyDown} = this;

		const inputProps = {
			value: formattedValue,
			isDisabled,
			onBlur,
			onChange,
			onFocus,
			pattern,
			onKeyDown,
			theme: {
				container: theme.input
			}
		};

		if (!isDisabled && isFocused) {
			inputProps.onWheel = onWheel;
		}
		const buttonTheme = Object.keys(BUTTON_TYPE).reduce((acc, current) => {
			return {
				...acc,
				[current]: {
					container: classnames(theme.button, theme[`button_${BUTTON_TYPE[current]}`]),
					icon: classnames(theme.button__icon)
				}
			};
		}, {});

		const className = classnames(theme.container, {
			[theme.container_isInvalid]: value < min || value > max
		});

		return (
			<div className={className}>
				<Input key="input" {...inputProps} />
				<div className={theme.buttons}>
					<Holdable onHold={this.onButtonDownClick} isDisabled={isDisabled || value <= min}>
						<Button onClick={this.onButtonDownClick}
						        name={downIconName}
						        theme={buttonTheme.UP}/>
					</Holdable>
					<Holdable onHold={this.onButtonUpClick} isDisabled={isDisabled || value >= max}>
						<Button onClick={this.onButtonUpClick}
						        theme={buttonTheme.DOWN}
						        name={upIconName}/>
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

	onBlur = (event) => {
		//const {}
		const {value} = event.target;
		this.setState({
			isFocused: false
		});

		this.setValue(Number(value));
	}

	onWheel = e => {
		if (e.deltaY < 0) {
			this.increase();
		} else {
			this.decrease();
		}
	}

	onButtonDownClick = () => {
		this.decrease();
	}

	onButtonUpClick = () => {
		this.increase();
	}
}