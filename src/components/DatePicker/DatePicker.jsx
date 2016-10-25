import React from 'react';
import moment from 'moment';
import {themr} from 'react-css-themr';
import DateInput from './fields/DateInput';
import Popover, {POPOVER_THEME_SHAPE_OBJECT} from '../Popover/Popover';
import ButtonIcon, {BUTTON_ICON_THEME} from '../ButtonIcon/ButtonIcon';
import {PURE} from 'dx-util/src/react/react';
import stateful from '../../util/react/stateful';
import Calendar from '../Calendar/Calendar';
import {CALENDAR_THEME} from '../Calendar/Calendar.constants';

import {isDateValid} from '../../util/func/date';

export const DATEPICKER_THEME = {
	container: React.PropTypes.string,
	field: React.PropTypes.string,
	field_invalid: React.PropTypes.string,
	ButtonOpen: React.PropTypes.shape(BUTTON_ICON_THEME),
	Popover: React.PropTypes.shape(POPOVER_THEME_SHAPE_OBJECT),
	Calendar: React.PropTypes.shape(CALENDAR_THEME)
};

export const DATE_PICKER = Symbol('DATE_PICKER');

@PURE
@themr(DATE_PICKER)
class DatePicker extends React.Component {
	static propTypes = {
		value: React.PropTypes.instanceOf(Date),
		min: React.PropTypes.instanceOf(Date),
		max: React.PropTypes.instanceOf(Date),

		onChange: React.PropTypes.func,
		dateFormatter: React.PropTypes.func,
		headerDateFormatter: React.PropTypes.func,
		dayFormatter: React.PropTypes.func,
		headerDayFormatter: React.PropTypes.func,
		openCalendarIcon: React.PropTypes.string,
		previousMonthIcon: React.PropTypes.string.isRequired,
		nextMonthIcon: React.PropTypes.string.isRequired,
		withField: React.PropTypes.bool,
		placeholder: React.PropTypes.string,
		isDisabled: React.PropTypes.bool,
		locale: React.PropTypes.string,
		theme: React.PropTypes.shape(DATEPICKER_THEME),
		Input: React.PropTypes.func,
	}

	static defaultProps = {
		locale: 'en',
		withField: true,
		Input: DateInput
	}

	state = {
		isOpened: false
	};

	_anchor;

	render() {
		const {
			theme,
			openCalendarIcon,
			isDisabled,
			dateFormatter,
			headerDateFormatter,
			headerDayFormatter,
			dayFormatter,
			placeholder,
			value,
			min,
			max,
			Input,
			previousMonthIcon,
			nextMonthIcon,
			locale,
			withField
		} = this.props;

		const isInvalid = !isDateValid(moment(this.props.value), this.props.min, this.props.max);

		return (
			<div className={theme.container} ref={el => this._anchor = el}>
				{withField && (
					<Input value={moment(value).locale(locale)}
						   dateFormatter={dateFormatter}
						   min={moment(min).locale(locale)}
						   max={moment(max).locale(locale)}
						   onClick={this.onFieldClick}
						   onChange={this.onFieldDateChange}
						   theme={theme}
						   isDisabled={isDisabled}
						   isInvalid={isInvalid}
						   locale={locale}
						   placeholder={placeholder}
						   isDatePickerOpened={this.state.isOpened}/>
				)}
				{openCalendarIcon && (
					<ButtonIcon onClick={this.onIconClick}
								name={openCalendarIcon}
								theme={theme.ButtonOpen}
								isDisabled={isDisabled}/>
				)}

				<Popover theme={theme.Popover}
						 isOpened={this.state.isOpened}
						 anchor={this._anchor}
						 closeOnClickAway={true}
						 onRequestClose={this.onPopoverRequestClose}>
					<Calendar theme={theme.Calendar}
							  value={value}
							  onChange={this.onCalendarDateChange}
							  min={min}
							  max={max}
							  headerDateFormatter={headerDateFormatter}
							  dayFormatter={dayFormatter}
							  headerDayFormatter={headerDayFormatter}
							  previousMonthIcon={previousMonthIcon}
							  nextMonthIcon={nextMonthIcon}
							  locale={locale}/>
				</Popover>
			</div>
		);
	}

	onFieldClick = () => {
		const {isOpened} = this.state;
		this.setState({
			isOpened: !isOpened
		});
	}

	openDatePicker = () => {
		this.setState({
			isOpened: true
		});
	}

	closeDatePicker = () => {
		this.setState({
			isOpened: false
		});
	}

	/**
	 * @param {moment.Moment} newDate
	 */
	onFieldDateChange = newDate => {
		const {min, max, onChange} = this.props;

		if (isDateValid(newDate, min, max)) {
			this.setState({
				isOpened: false
			});
			onChange && onChange(newDate.format());
		} else {
			this.setState({
				isOpened: false
			});
			onChange && onChange(null); // empty value;
		}
	}

	/**
	 * @param {string} dateISO
	 */
	onCalendarDateChange = dateISO => {
		const {onChange} = this.props;

		this.setState({
			isOpened: false
		});

		onChange && onChange(dateISO);
	}

	onPopoverRequestClose = () => this.closeDatePicker();
	onIconClick = () => this.openDatePicker();
}

DatePicker.Stateful = stateful()(DatePicker);

export default DatePicker;