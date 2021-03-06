import React from 'react';
import MenuItem, {MENU_ITEM_THEME_SHAPE} from '../Menu/MenuItem';
import Highlight, {HIGHLIGHT_THEME_SHAPE} from '../Highlight/Highlight';
import * as PropTypes from 'prop-types';

export const AUTOCOMPLETE_MENU_ITEM_THEME_SHAPE = {
	...MENU_ITEM_THEME_SHAPE,
	Highlight: PropTypes.shape(HIGHLIGHT_THEME_SHAPE)
};

const AutocompleteMenuItem = props => {
	const {search, Highlight, ...menuItemProps} = props;

	return (
		<MenuItem {...menuItemProps} text={props.value}>
			<Highlight search={search} theme={props.theme.Highlight}>
				{props.value}
			</Highlight>
		</MenuItem>
	);
};

AutocompleteMenuItem.propTypes = {
	...MenuItem.propTypes,
	search: PropTypes.string,
	theme: PropTypes.shape(AUTOCOMPLETE_MENU_ITEM_THEME_SHAPE),
	Highlight: PropTypes.func
};
AutocompleteMenuItem.defaultProps = {
	...MenuItem.defaultProps,
	search: '',
	theme: {
		Highlight: {}
	},
	Highlight
};

export default AutocompleteMenuItem;