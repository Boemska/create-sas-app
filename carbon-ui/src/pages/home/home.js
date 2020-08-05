import React from 'react'
import './home.scss'
import {managedRequest, call} from './homeActions'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {Content} from "carbon-components-react/lib/components/UIShell";
import {Button} from 'carbon-components-react'
import constants from '../../config/constants';
import ADAPTER_SETTINGS from '../../adapterService/config';

class Home extends React.Component {
	constructor() {
		super()
		this.state = {
			res: ''
		}
	}

	managedRequest = async () => {
		this.setState({res: ''})
		const sasProgram = 'common/startupService'
		const options = {
			sasProgram,
			dataObj: null,
			params: null
		}
		console.log('home mangedReq')
		const res = await this.props.managedRequest(options)
		this.setState({res})
	}

	call = async () => {
		this.setState({res: ''})
		const sasProgram = 'common/startupService'
		const res = await this.props.call(sasProgram)
		this.setState({res})
	}

	handleButtonClick = () => {
		// TODO Add generated code from CSA tab in AppFactory
		this.setState({error: ''}, async () => {
			try {
				const res = await this.props.call('common/startupService', null)
				console.log(res);
				this.setState({response: JSON.stringify(res), error: ''});
			} catch (e) {
				this.setState({error: e.message})
			}
		})
	}


	render() {
		return <Content id='main-content'>
			<div className={'home'} ref={e => {
				this.mainContainer = e
			}}>
				<h1>Carbon UI seed app</h1>
				<div className="data__container">
					{/* For some reason b tag takes fontWeight "inherit" instead its native bold */}
					<div>Currently running on <b style={{fontWeight: 'bold'}}>{ADAPTER_SETTINGS.sasVersion}</b> server</div>
					<div>SAS Program: <code>startupService</code></div>
					<div>Data object: <code>null</code></div>
					{constants.VIYA ? <div className={'mb-2 mt-1'}>

						<Button kind="primary" onClick={this.managedRequest}>H54S.managedRequest</Button>
					</div> : null}
					<div>
						<Button kind="secondary" onClick={this.call}>H54S.call</Button>
					</div>

					{this.state.res && <div>
						<pre>{JSON.stringify(this.state.res, null, 2)}</pre>
					</div>}

				</div>

				<div className={'data__container'}>
					<h2 style={{textAlign: 'center'}} className={'text-center mt-4'}>Read me</h2>
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

				</div>

				<div className={'spt5'}>
					<Button kind={'primary'} onClick={this.handleButtonClick}>Run custom function</Button>
				</div>
				<div>
					<div>Show response here</div>
					{this.state.response && <div>{this.state.response}</div>}
					{this.state.error && <div className={'text-danger'}>Error: {this.state.error}</div>}
				</div>
			</div>
		</Content>
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

