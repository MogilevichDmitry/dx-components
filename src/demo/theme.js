//this is a demo theme config - includes some additional presentational styles that are not included in the lib
import config from '../config/theme';

import {LIST} from '../components/List/List';
import list from '../components/List/List.demo.styl';

import {MENU} from '../components/Menu/Menu';
import menu from '../components/Menu/Menu.demo.styl';

import {POPOVER} from '../components/Popover/Popover';
import popover from '../components/Popover/Popover.demo.styl';

import {SELECTBOX} from '../components/Selectbox/Selectbox';
import selectbox from '../components/Selectbox/Selectbox.demo.styl';

import {TABLE} from '../components/Table/Table';
import table from '../components/Table/Table.demo.styl';

import {SCROLLABLE} from '../components/Scrollable/Scrollable';
import scrollable from '../components/Scrollable/Scrollable.demo.styl';

export default {
	...config,
	//additional demo styles
	[LIST]: list,
	[MENU]: menu,
	[POPOVER]: popover,
	[SELECTBOX]: selectbox,
	[TABLE]: table,
	[SCROLLABLE]: scrollable
};