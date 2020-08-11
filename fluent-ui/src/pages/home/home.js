import React from 'react'
import {managedRequest, call} from './homeActions'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
// import {Button} from 'react-bootstrap'
import { PrimaryButton as Button } from '@fluentui/react';

class Home extends React.Component {
	state = {
		res: ''
	}
	managedRequest = async () => {
		this.setState({res: ''})
		const sasProgram = 'common/startupService'
		const options = {
			sasProgram,
			dataObj: null,
			params: null
		}
		const res = await this.props.managedRequest(options)
		this.setState({res})
	}

	call = async () => {
		this.setState({res: ''})
		const sasProgram = 'common/startupService'
		const res = await this.props.call(sasProgram)
		this.setState({res})
	}

	render() {
		return <div className={'home'}>
			<h2 className={'text-center mt-4'}>Basic examples</h2>
			<div>
				<div>
					<div className={'mb30'}>
						<Button bsstyle={'primary'} onClick={this.managedRequest}>H54S.managedRequest</Button>
					</div>
					<div>
						<Button bsstyle={'primary'} onClick={this.call}>H54S.call</Button>
					</div>
				</div>
				<div>
					{this.state.res && <div>
						<pre>{JSON.stringify(this.state.res, null, 2)}</pre>
					</div>}
				</div>
			</div>
			<div>
				<h2 className={'text-center mt-4'}>Read me</h2>
				<h3>Running</h3>
				<p><code>yarn install</code></p>
				<p>This will install all dependencies required for app to run.</p>
				<p><code>yarn start</code></p>
				<p>Runs the app in the development mode.<br/>
					Open http://localhost:3000 to view it in the browser.<br/><br/>
					The page will reload if you make edits.<br/>
					You will also see any lint errors in the console.</p>
				<p><code>yarn build</code></p>
				<p>Builds the app for production to the build folder.<br/>
					It correctly bundles React in production mode and optimizes the build for the best performance.<br/><br/>
					The build is minified and the filenames include the hashes.<br/>
					Your app is ready to be deployed!</p>

				<h3>Usage</h3>
				<h4 className={'mb-0 pl-10'}>Microsoft Fluent UI</h4>
				<div className={'pl-20'}><a href="https://developer.microsoft.com/en-us/fluentui#/controls/web">Fluent Documentation</a></div>
				<div className={'pl-20'}><a href="https://developer.microsoft.com/en-us/fluentui#/styles/web/icons">Fluent UI Icons</a></div>
			</div>
		</div>
	}
}

function mapStateToProps(store) {
	return {
		test: store.home.test,
		mainSpinner: store.header.mainSpinner
	}
}

function mapDispatchToProps(dispatch) {
	return {
		managedRequest: options => managedRequest(dispatch, options),
		call: program => call(dispatch, program)
	}
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home))
