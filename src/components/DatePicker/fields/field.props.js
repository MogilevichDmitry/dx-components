import React from 'react';
import moment from 'moment';

/**
 * Custom field components should handle these properties to interact with DatePicker.
 */
export const DATE_PICKER_FIELD_PROPS = {
	value: React.PropTypes.instanceOf(Date),
	dateFormatter: React.PropTypes.func,
	onChange: React.PropTypes.func,
	min: React.PropTypes.instanceOf(Date),
	max: React.PropTypes.instanceOf(Date),
	onClick: React.PropTypes.func,
	isDisabled: React.PropTypes.bool,
	isInvalid: React.PropTypes.bool,
	locale: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	isDatePickerOpened: React.PropTypes.bool,
	theme: React.PropTypes.shape({
		field: React.PropTypes.string,
		field_invalid: React.PropTypes.string
	})
};