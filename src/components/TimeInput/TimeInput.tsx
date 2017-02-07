import * as React from 'react';
import SteppableInput, {
	TSteppableInputInjectedProps,
	STEPPABLE_INPUT_THEME
} from '../SteppableInput/SteppableInput';
import {PURE} from 'dx-util/src/react/pure';
import {TControlProps, createControlProps, KeyCode, KEY_CODE_NUM_MAP} from '../Control/Control';
import * as classnames from 'classnames';
import {themr} from 'react-css-themr';

export type TTime = {
	hours: number,
	minutes: number
};

enum ActiveSection {
	Hours,
	Minutes
}

type TTimeInputOwnProps = TControlProps<TTime> & {
	incrementIcon: string,
	decrementIcon: string,
	clearIcon: string,
	isDisabled?: boolean
};
type TTimeInputInjectedProps = TSteppableInputInjectedProps & {
	theme: {
		section?: string,
		section_isActive?: string,
		separator?: string,
		SteppableInput?: {}
	}
};
type TTimeInputDefaultProps = {
	SteppableInput: typeof SteppableInput
};
type TTimeInputFullProps = TTimeInputDefaultProps & TTimeInputOwnProps & TTimeInputInjectedProps;

type TTimeInputState = {
	activeSection?: ActiveSection,
	hours?: number,
	minutes?: number
};

@PURE
class TimeInput extends React.Component<TTimeInputFullProps, TTimeInputState> {
	static propTypes = {
		...createControlProps(React.PropTypes.shape({
			hours: React.PropTypes.number,
			minutes: React.PropTypes.number
		}))
	};

	static defaultProps = {
		SteppableInput
	};

	state: TTimeInputState = {};
	private secondInput: boolean = false;

	componentWillMount() {
		const {value} = this.props;
		if (value) {
			const {hours, minutes} = value;
			this.setState({
				hours,
				minutes
			});
		}
	}

	componentWillReceiveProps(newProps: TTimeInputFullProps) {
		if (this.props.value !== newProps.value && isDefined(newProps.value)) {
			let hours;
			let minutes;
			if (newProps.value) {
				hours = newProps.value.hours;
				minutes = newProps.value.minutes;
			}
			this.setState({
				hours,
				minutes
			});
		}
	}

	render() {
		const {
			theme,
			decrementIcon,
			incrementIcon,
			isDisabled,
			clearIcon,
			value,
			SteppableInput
		} = this.props;
		const {hours, minutes, activeSection} = this.state;

		const hoursClassName = classnames(
			theme.section,
			{
				[theme.section_isActive as string]: activeSection === ActiveSection.Hours
			}
		);

		const minutesClassName = classnames(
			theme.section,
			{
				[theme.section_isActive as string]: activeSection === ActiveSection.Minutes
			}
		);

		let onClear;
		if (isDefined(value) || isDefined(hours) || isDefined(minutes)) {
			onClear = this.onClear;
		}

		return (
			<SteppableInput isDisabled={isDisabled}
			                theme={theme.SteppableInput}
			                onBlur={this.onBlur}
			                onFocus={this.onFocus}
			                decrementIcon={decrementIcon}
			                incrementIcon={incrementIcon}
			                clearIcon={clearIcon}
			                onKeyDown={this.onKeyDown}
			                onClear={onClear}
			                onDecrement={this.onDecrement}
			                onIncrement={this.onIncrement}>
				<div className={theme.container}>
					<span className={hoursClassName} onMouseDown={this.onHoursMouseDown}>
						{this.format(hours)}
					</span>
					<span className={theme.separator}>:</span>
					<span className={minutesClassName}
					      onMouseDown={this.onMinutesMouseDown}>
						{this.format(minutes)}
					</span>
				</div>
			</SteppableInput>
		);
	}

	private format(value?: number): string {
		if (isDefined(value)) {
			return `${value >= 0 && value < 10 ? 0 : ''}${value}`;
		} else {
			return '--';
		}
	}

	private onHoursMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		this.setState({
			activeSection: ActiveSection.Hours
		});
		this.correctMinutes();
	}

	private onMinutesMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		this.setState({
			activeSection: ActiveSection.Minutes
		});
	}

	private onIncrement = () => {
		this.secondInput = false;
		this.step(1);
	}

	private onDecrement = () => {
		this.secondInput = false;
		this.step(-1);
	}

	private onClear = () => {
		this.secondInput = false;
		this.updateStateTime();
	}

	private onFocus = (e: React.FocusEvent<HTMLElement>) => {
		this.secondInput = false;
		if (!isDefined(this.state.activeSection)) {
			this.setState({
				activeSection: ActiveSection.Hours
			});
		}
	}

	private onBlur = (e: React.FocusEvent<HTMLElement>) => {
		this.secondInput = false;
		this.correctMinutes();
		this.setState({
			activeSection: undefined
		});
	}

	private onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
		const {activeSection, hours, minutes} = this.state;
		switch (e.keyCode) {
			case KeyCode.Left: {
				if (activeSection === ActiveSection.Minutes) {
					this.secondInput = false;
					this.correctMinutes();
					this.setState({
						activeSection: ActiveSection.Hours
					});
				}
				break;
			}
			case KeyCode.Right: {
				if (activeSection === ActiveSection.Hours) {
					this.secondInput = false;
					this.correctMinutes();
					this.setState({
						activeSection: ActiveSection.Minutes
					});
				}
				break;
			}
			case KeyCode.Delete: //fallthrough
			case KeyCode.Backspace: {
				this.secondInput = false;
				switch (activeSection) {
					case ActiveSection.Minutes: {
						this.updateStateTime(hours, undefined);
						break;
					}
					case ActiveSection.Hours: {
						this.updateStateTime(undefined, minutes);
						break;
					}
				}
				break;
			}
			default: {
				const number = KEY_CODE_NUM_MAP[e.keyCode];
				if (isDefined(number)) {
					this.handleDigitKeyDown(number);
				}
			}
		}
	}

	private handleDigitKeyDown(digit: number) {
		const {hours, minutes} = this.state;
		switch (this.state.activeSection) {
			case ActiveSection.Hours: {
				if (this.secondInput) {
					let newHours;
					if (hours < 2) {
						newHours = Number(`${hours}${digit}`);
					} else if (hours === 2) {
						newHours = Math.min(Number(`${hours}${digit}`), 23);
					} else {
						newHours = digit;
					}
					this.updateStateTime(newHours, minutes);
					this.setState({
						activeSection: ActiveSection.Minutes
					});
					this.secondInput = false;
				} else {
					this.updateStateTime(digit, minutes);
					if (digit > 2) {
						this.setState({
							activeSection: ActiveSection.Minutes
						});
						this.secondInput = false;
					} else {
						this.secondInput = true;
					}
				}
				break;
			}
			case ActiveSection.Minutes: {
				if (this.secondInput) {
					const newMinutes = Number(`${minutes >= 10 ? ('' + minutes)[1] : minutes}${digit}`);
					this.updateStateTime(hours, newMinutes);
				} else {
					this.updateStateTime(hours, digit);
					this.secondInput = true;
				}
			}
		}
	}

	private step(amount: number): void {
		const {hours, minutes, activeSection} = this.state;
		switch (activeSection) {
			case ActiveSection.Hours: {
				this.updateStateTime(add(hours, amount, 23), minutes);
				break;
			}
			case ActiveSection.Minutes: {
				this.updateStateTime(
					hours,
					add(Math.min(typeof minutes !== 'undefined' ? minutes : Infinity, 59), amount, 59)
				);
				break;
			}
		}
	}

	private updateStateTime(hours?: number, minutes?: number): void {
		const {onChange, value} = this.props;

		const canBuildValue = isDefined(hours) && isDefined(minutes) && minutes < 60;
		const newValueDiffers = canBuildValue && (
				typeof value === 'undefined' ||
				value.hours !== hours ||
				value.minutes !== minutes
			);

		if (canBuildValue) {
			if (newValueDiffers) {
				onChange && onChange({
					hours,
					minutes
				} as any);
			}
		} else {
			if (isDefined(this.props.value)) {
				onChange && onChange(undefined);
			}
			this.setState({
				hours,
				minutes
			});
		}
	}

	private correctMinutes() {
		if (this.state.minutes >= 60) {
			this.updateStateTime(this.state.hours, 59);
		}
	}
}

type TTimeInputProps = TTimeInputOwnProps & Partial<TTimeInputDefaultProps> & Partial<TTimeInputInjectedProps>;
export const TIME_INPUT = Symbol('TimeInput');
export default themr(TIME_INPUT)(TimeInput) as React.ComponentClass<TTimeInputProps>;

/**
 * Values can be zeros (start from 0). Max is included value.
 */
function add(a: number | undefined, b: number, max: number): number {
	if (!isDefined(a)) {
		return b < 0 ? max : 0;
	}
	let result = (a + b) % (max + 1);
	if (result < 0) {
		result += (max + 1);
	}
	return result;
}

function isDefined(value: any): boolean {
	return typeof value !== 'undefined';
}