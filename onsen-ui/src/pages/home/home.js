import React from 'react'
import {dummyCall, getUserData, setTestState} from './homeActions'
import {connect} from 'react-redux'
import {removeRequest, setRequest} from '../../adapterService/adapterActions'
import {Page, Button} from 'react-onsenui';
import './home.scss'

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.handleToggle = this.handleToggle.bind(this)
		this.setRequest = this.setRequest.bind(this)
		this.dummyCall = this.dummyCall.bind(this)
	}

	handleToggle() {
		this.props.setTestState(! this.props.test)
	}

	setRequest(param) {
		const promise = new Promise((resolve, reject) => {
			const a = param.length
			console.log(a)
			setTimeout(() => {
				if (a > 4) {
					resolve(a)
				} else {
					reject(a)
				}
			}, 5000)

		})

		this.props.setRequest(promise, {
			program: param,
			running: true,
			successful: undefined
		})

		promise
			.then(() => this.props.setRequest(promise, {
				program: param,
				running: false,
				successful: true
			}))
			.catch(e => this.props.setRequest(promise, {
				program: param,
				running: false,
				successful: false
			}))
	}

	dummyCall() {
		const sasProgram = 'common/startupService'
		const options = {
			sasProgram,
			dataObj: null
		}
		this.props.dummyCall(options)
	}

	render() {
		return (
			<Page>
				<div className="container">
					<Button onClick={this.handleToggle} className={'btn-margin'}>
						Togglee
					</Button>
					{this.props.test ? <div>True</div> : <div>False</div>}
					<Button onClick={() => this.setRequest('Fail')} className={'btn-margin'}>
						Fail request mock
					</Button>
					<Button onClick={() => this.setRequest('Success')} className={'btn-margin'}>
						Success request mock
					</Button>
					<Button onClick={this.props.getUserData} className={'btn-margin'}>
						Managed request GET USER DATA
					</Button>
					<Button onClick={this.dummyCall} className={'btn-margin'}>
						Create dummy call
					</Button>
				</div>
			</Page>
		)
	}
}

function mapStateToProps(store) {
	return {
		test: store.home.test
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setTestState: state => setTestState(dispatch, state),
		setRequest: (h, obj) => setRequest(dispatch, h, obj),
		removeRequest: p => removeRequest(dispatch, p),
		getUserData: () => getUserData(dispatch),
		dummyCall: options => dummyCall(dispatch, options)
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(Home)
