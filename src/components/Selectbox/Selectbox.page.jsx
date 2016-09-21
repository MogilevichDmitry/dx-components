import React from 'react';
import {storiesOf} from '@kadira/storybook';
import Demo from '../../demo/Demo.jsx';
import Button from '../Button/Button.jsx';
import Selectbox from './Selectbox.jsx';
import css from './Selectbox.demo.styl';
import MenuItem from '../Menu/MenuItem.jsx';
import {PURE} from 'dx-util/src/react/pure';

import iconSmallDropdownArrow from './img/icon-small-dropdown-arrow.svg';
import iconListItemTick from './img/icon-list-item-tick.svg';

import SelectboxAnchor from './SelectboxAnchor.jsx';

class DemoSelectboxAnchor extends React.Component {

	static propTypes = {
		...SelectboxAnchor.PropTypes
	}

	render() {
		const {theme} = this.props;

		const newProps = {
			...this.props,
			isPrimary: true,
			caretIconName: iconSmallDropdownArrow,
			theme: {
				...theme,
				container: css.anchor
			}
		};

		return <SelectboxAnchor {...newProps}/>;
	}
}

@PURE
class SelectboxPage extends React.Component {
	state = {}

	render() {
		return (
			<Demo>
				<section>
					<Selectbox placeholder="Choose your hero"
					           selectedItemIconName={iconListItemTick}
					           AnchorComponent={DemoSelectboxAnchor}
					           onChange={this.onHeroChange}>
						<MenuItem value="superman">Superman</MenuItem>
						<MenuItem value="batman">Batman</MenuItem>
						<MenuItem value="flash">Flash</MenuItem>
					</Selectbox>
					<Selectbox placeholder="Controlled by left"
					           value={this.state.hero}
					           AnchorComponent={DemoSelectboxAnchor}
					           onChange={this.onHeroChange}
					           selectedItemIconName={iconListItemTick}>
						<MenuItem value="superman">Superman</MenuItem>
						<MenuItem value="batman">Batman</MenuItem>
						<MenuItem value="flash">Flash</MenuItem>
					</Selectbox>
					<Selectbox defaultValue="batman"
					           value={this.state.hero}
					           AnchorComponent={DemoSelectboxAnchor}
					           onChange={this.onHeroChange}
					           selectedItemIconName={iconListItemTick}>
						<MenuItem value="superman">Superman</MenuItem>
						<MenuItem value="batman">Batman</MenuItem>
						<MenuItem value="flash">Flash</MenuItem>
					</Selectbox>
					<Button onClick={this.onResetClick}>Reset</Button>
				</section>

				<section>
					<Selectbox defaultValue="superman">
						<MenuItem value="superman">Superman</MenuItem>
						<MenuItem value="batman">Batman</MenuItem>
						<MenuItem value="flash">Flash</MenuItem>
					</Selectbox>
					<Selectbox defaultValue="superman"
					           isDisabled={true}>
						<MenuItem value="superman">Superman</MenuItem>
						<MenuItem value="batman">Batman</MenuItem>
						<MenuItem value="flash">Flash</MenuItem>
					</Selectbox>
				</section>
			</Demo>
		);
	}

	onHeroChange = hero => {
		this.setState({
			hero
		});
	}

	onResetClick = e => {
		this.setState({
			hero: (void 0) //eslint-disable-line no-void
		});
	}
}

storiesOf('Selectbox', module).add('default', () => <SelectboxPage/>);