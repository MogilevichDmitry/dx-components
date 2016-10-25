import React from 'react';
import DatePicker from './DatePicker';
import {storiesOf} from '@kadira/storybook';
import Demo from '../../demo/Demo.jsx';
import {DATE_PICKER_FIELD_PROPS} from './fields/field.props';
import {PURE} from 'dx-util/src/react/react';
import classnames from 'classnames';
import {cloneDate, addMonths} from '../../util/func/date';

import iconOpenCalendar from './resources/icon-open-calendar.svg';
import nextMonthIcon from './resources/icon-move-right.svg';
import previousMonthIcon from './resources/icon-move-left.svg';
import css from './DatePicker.page.styl';
import stateful from '../../util/react/stateful';
const darkDemoTheme = {
	container: css.container
};

const now = new Date();
const minDemo = cloneDate(now);
addMonths(minDemo, -1);
const maxDemo = cloneDate(now);
addMonths(maxDemo, 1);

const CustomLabelField = (props) => {
	const onContextMenu = e => {
		e.preventDefault();
		props.onChange(now);
	};

	const className = classnames(css.customLabelField, props.theme.field);

	const {dateFormatter, value} = props;

	return (
		<span onClick={props.onClick} onContextMenu={onContextMenu}
		      className={className}>
			{dateFormatter ? dateFormatter(value) : value}
		</span>
	);
};

CustomLabelField.propTypes = {
	...DATE_PICKER_FIELD_PROPS,
	theme: React.PropTypes.shape({
		container: React.PropTypes.string
	})
};

const locale = 'en';
const headerDateFormatter = (date) => {
	return new Intl.DateTimeFormat(locale, {
		month: 'short',
		year: 'numeric'
	}).format(date);
};

const headerDayFormatter = (date) => {
	return new Intl.DateTimeFormat(locale, {
		weekday: 'short'
	}).format(date);
};

const dayFormatter = (date) => {
	return new Intl.DateTimeFormat(locale, {
		day: 'numeric'
	}).format(date);
};

const dateFormatter = (date) => {
	return new Intl.DateTimeFormat(locale).format(date);
};

const DemoDatePicker = (props) => (
	<DatePicker {...props} />
);

DemoDatePicker.defaultProps = {
	openCalendarIcon: iconOpenCalendar,
	nextMonthIcon,
	headerDateFormatter,
	headerDayFormatter,
	dayFormatter,
	dateFormatter,
	previousMonthIcon
};

const Stateful = stateful()(DemoDatePicker);

@PURE
class DatePickerPage extends React.Component {
	state = {
		date: new Date()
	}

	render() {
		return (
			<Demo theme={darkDemoTheme}>
				<section className={css.section}>
					<DemoDatePicker value={this.state.date}
					                onChange={this.onDateChange}/>
				</section>
				<section className={css.section}>
					<DemoDatePicker value={this.state.date}
					                onChange={this.onDateChange}
					                Input={CustomLabelField}/>
				</section>
				<section className={css.section}>
					<DemoDatePicker value={this.state.date}
					                onChange={this.onDateChange}
					                locale="ru"
					                min={minDemo}/>
				</section>
				<section className={css.section}>
					<DemoDatePicker value={this.state.date}
					                onChange={this.onDateChange}
					                isDisabled={true}/>
				</section>
				<section className={css.section}>
					<Stateful defaultValue={now}
					          max={maxDemo}
					          onChange={this.onDateChange}/>
				</section>
			</Demo>
		);
	}

	onDateChange = date => {
		let newDate = Date.parse(date);
		if (isNaN(newDate)) {
			newDate = now;
		} else {
			newDate = new Date(newDate);
		}
		this.setState({
			date: newDate
		});
	}
}

storiesOf('DatePicker', module)
	.add('controlled', () => <DatePickerPage/>);