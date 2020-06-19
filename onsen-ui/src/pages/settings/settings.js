import React from 'react'
import {Page} from 'react-onsenui';
import './settings.scss'

class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.name = 'settings' //this name is mandatory for navigator to work
	}

	render() {
		return (
			<Page>
				<h2 className={'centered-title'}> Settings Page </h2>
			</Page>
		)
	}
}


export default Settings;
