import React from 'react';
import Demo from '../../demo/Demo.jsx';

import Input from './Input.jsx';
import {storiesOf} from '@kadira/storybook';

import css from './Input.page.styl';

const darkDemoTheme = {
	container: css.container
};

storiesOf('Input', module)
	.add('Default', () => (
		<Demo theme={darkDemoTheme}>
			<Input defaultValue="Test Value"/>
		</Demo>
	))
	.add('Readonly', () => {
		return (
			<Demo theme={darkDemoTheme}>
				<Input value="Test Value" readOnly={true}/>
			</Demo>
		);
	})
	.add('Disabled', () => {
		return (
			<Demo theme={darkDemoTheme}>
				<Input value="Test Value" disabled={true}/>
			</Demo>
		);
	});