import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Input from '../../Input/Input';
import {PURE} from 'dx-util/src/react/react';
import {DATE_PICKER_FIELD_PROPS} from './field.props';
import classnames from 'classnames';
import {isDateValid} from '../../../util/func/date';

@PURE
export default class DateInput extends React.Component {
	static propTypes = {
		...DATE_PICKER_FIELD_PROPS
	}

	state = {
		displayedDate: this.formatDateForView(this.props)
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			displayedDate: this.formatDateForView(newProps)
		});
	}

	render() {
		const {
			theme,
			isDisabled,
			isInvalid
		} = this.props;

		const inputTheme = {
			container: classnames(theme.field, {
				[theme.field_invalid]: isInvalid
			})
		};

		return (
			<Input value={this.state.displayedDate}
				   theme={inputTheme}
				   onClick={this.onClick}
				   onChange={this.onChange}
				   onBlur={this.onBlur}
				   onKeyDown={this.onKeyDown}
				   disabled={isDisabled}/>
		);
	}

	formatDateForView(props) {
		return props.isInvalid ? props.placeholder : props.value.format(props.dateFormat);
	}

	onClick = e => {
		this.props.openDatePicker();
	}

	onChange = e => {
		this.setState({
			displayedDate: e.target.value
		});
	}

	onBlur = e => {
		const inputDate = moment(e.target.value, this.props.dateFormat);
		this.props.onChange(inputDate);
	}

	onKeyDown = e => {
		if (e.keyCode === 13) {
			e.target.blur();
		}
	}
}