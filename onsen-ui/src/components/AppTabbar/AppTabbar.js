import React from 'react';
import Home from '../../pages/home/home'
import Settings from '../../pages/settings/settings'
import {Page, Tabbar, Tab} from 'react-onsenui';
import {connect} from 'react-redux'

class AppTabbar extends React.Component {
	constructor(props) {
		super(props)
		this.name = 'appTabbar' //this name is mandatory for navigator to work
	}

	renderTabs = () => {
		return [
			{
				content: <Home key="home" navigator={this.props.navigator}/>,
				tab: <Tab key="home" label="Home" icon="md-home"/>
			},
			{
				content: <Settings key="settings" navigator={this.props.navigator}/>,
				tab: <Tab key="settings" label="Settings  " icon="md-settings"/>
			}
		];
	}

	render() {
		return (
			<Page>
				<Tabbar
					visible={! this.props.shouldLogin}
					position='auto'
					index={0}
					renderTabs={this.renderTabs}/>
			</Page>
		);
	}
}

function mapStateToProps(state) {
	return {
		shouldLogin: state.login.shouldLogin
	}
}

export default connect(mapStateToProps)(AppTabbar);
