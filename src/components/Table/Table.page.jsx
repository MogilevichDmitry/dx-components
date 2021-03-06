import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import Table, {
	TableCell as Cell,
	TableHead as THead,
	TableBody as TBody,
	TableRow as Tr
} from './Table';
import Demo from '../../demo/Demo';
import css from './Table.page.styl';

const firstTheme = {
	cell: css.cell_first
};

const secondStyle = {
	width: 200
};

const notifyClicked = action('Click');

storiesOf('Table', module).add('default', () => (
	<Demo>
		<Table>
			<THead>
				<Tr>
					<Cell rowSpan={2} theme={firstTheme}>1</Cell>
					<Cell style={secondStyle}>2</Cell>
					<Cell>3</Cell>
				</Tr>
				<Tr>
					<Cell theme={firstTheme} colSpan={2}>_________colspan_________</Cell>
				</Tr>
			</THead>
			<TBody>
				<Tr>
					<Cell rowSpan={2}>
						________4_________
					</Cell>
					<Cell colSpan={2}>________5_________</Cell>
				</Tr>
				<Tr onClick={notifyClicked}>
					<Cell>_8_</Cell>
					<Cell>_9_</Cell>
				</Tr>
			</TBody>
		</Table>
	</Demo>
));