import {themeable} from 'react-css-themr';

import {ICON} from '../components/Icon/Icon';
import icon from '../components/Icon/Icon.styl';

import {BUTTON} from '../components/Button/Button';
import button from '../components/Button/Button.styl';

import {BUTTON_ICON} from '../components/ButtonIcon/ButtonIcon';
import buttonIcon from '../components/ButtonIcon/ButtonIcon.styl';

import {LINK} from '../components/Link/Link';
import link from '../components/Link/Link.styl';

import {LIST} from '../components/List/List';
import list from '../components/List/List.styl';

import {MENU} from '../components/Menu/Menu';
import menu from '../components/Menu/Menu.styl';

import {POPOVER} from '../components/Popover/Popover';
import popover from '../components/Popover/Popover.styl';

import {SELECTBOX} from '../components/Selectbox/Selectbox';
import selectbox from '../components/Selectbox/Selectbox.styl';

import {RESIZE_DETECTOR} from '../components/ResizeDetector/ResizeDetector';
import resizeDetector from '../components/ResizeDetector/ResizeDetector.styl';

import {INPUT} from '../components/Input/Input.jsx';
import input from '../components/Input/Input.styl';

import {NUMERIC_STEPPER} from '../components/NumericStepper/NumericStepper.jsx';
import numericStepper from '../components/NumericStepper/NumericStepper.styl';

import {TABLE} from '../components/Table/Table';
import table from '../components/Table/Table.styl';

import {GRID} from '../components/Grid/Grid';
import grid from '../components/Grid/Grid.styl';

import {SCROLLABLE} from '../components/Scrollable/Scrollable';
import scrollable from '../components/Scrollable/Scrollable.styl';

import {HORIZONTAL_SCROLLBAR} from '../components/Scrollbar/HorizontalScrollbar.jsx';
import horizontalScrollbar from '../components/Scrollbar/HorizontalScrollbar.styl';

import {VERTICAL_SCROLLBAR} from '../components/Scrollbar/VerticalScrollbar.jsx';
import verticalScrollbar from '../components/Scrollbar/VerticalScrollbar.styl';

export default {
	[ICON]: icon,
	[BUTTON]: button,
	[BUTTON_ICON]: buttonIcon,
	[LINK]: link,
	[LIST]: list,
	[MENU]: menu,
	[POPOVER]: popover,
	[SELECTBOX]: selectbox,
	[RESIZE_DETECTOR]: resizeDetector,
	[SELECTBOX]: selectbox,
	[INPUT]: input,
	[NUMERIC_STEPPER]: numericStepper,
	[TABLE]: table,
	[GRID]: grid,
	[SCROLLABLE]: scrollable,
	[HORIZONTAL_SCROLLBAR]: horizontalScrollbar,
	[VERTICAL_SCROLLBAR]: verticalScrollbar,
};