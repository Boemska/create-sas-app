import React from 'react';

import {
	Toolbar,
	BackButton
} from 'react-onsenui';

class NavBar extends React.Component {

	render() {
		const {title, navigator, backButton} = this.props;
		return (
			<Toolbar>
				<div className='left'>
					{backButton ? <BackButton onClick={() => navigator.popPage()}>Back</BackButton> : null}
				</div>
				<div className='center'>{title}</div>
			</Toolbar>
		)
	}
}


export default NavBar;