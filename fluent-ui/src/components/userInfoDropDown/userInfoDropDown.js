import React from 'react';
import './userInfoDropDown.scss'
import unknownPerson from '../../assets/images/unknownPerson.png'
import adapterService from "../../adapterService/adapterService";
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import Badge from "../badge/badge";
import toastr from 'toastr'
import {getUserData, setRightPanel, setUserData} from '../../pages/home/homeActions'
import {Persona, Toggle} from '@fluentui/react'

export class UserInfoDropDown extends React.PureComponent {
	constructor(props) {
		super(props);
		this.statusBarShow = this.statusBarShow.bind(this);
		this.logout = this.logout.bind(this);
		this.handleSwitchChange = this.handleSwitchChange.bind(this);
		this.state = {
			statusBar: false,
			debugMode: false
		}
	}

	componentDidMount() {
		this.props.getUserData()
		let debugMode;
		const debugModeLocalStore = localStorage.getItem('debugMode');
		if (debugModeLocalStore) {
			debugModeLocalStore === 'true' ? debugMode = true : debugMode = false
			this.setState({
				debugMode: debugMode
			}, () => {
				adapterService._debugMode = this.state.debugMode;
			})
		}
	}

	logout() {
		adapterService.logout()
			.then(() => {
				// This will trigger getting user's data and
				// creating of fresh csrf token for login form
				// which will pop up automatically
				this.props.setUserData(null)
				this.props.getUserData()
			})
			.catch(e => {
				toastr.error('Something went wrong!')
			})
	}

	statusBarShow(show) {
		this.setState({
			statusBar: show
		})
	}

	handleSwitchChange() {
		this.setState({
			debugMode: !this.state.debugMode
		}, () => {
			adapterService._debugMode = this.state.debugMode;
			const debugMode = adapterService._debugMode
			localStorage.setItem("debugMode", debugMode);
		})
	}

	render() {
		const username = this.props.userData ? this.props.userData.name || (this.props.userData.userInfo && this.props.userData.userInfo[0].USERNAME) : 'Not Logged In'
		const avatar = this.props.userData ? this.props.userData.userAvatar || (this.props.userData.userInfo && this.props.userData.userInfo[0].AVATAR_URI) : unknownPerson
		return (
			<div tabIndex='0' className={'info-bar-drop'}>
				<div
					className={'info-header'}
					onClick={() => this.props.setRightPanel(!this.props.rightPanel)}
					// onMouseEnter={() => this.statusBarShow(true)}
					// onMouseLeave={() => this.statusBarShow(false)}
				>
					<Persona
						imageUrl={avatar}
						text={username}
						size={13}
						hidePersonaDetails={false}
						imageAlt="Annie Lindqvist, no presence detected"
						className={'persona'}
					/>
					<i className={`fas fa-caret-left fa-1x ${this.state.statusBar ? 'arrowDown' : ''}`}/>
				</div>
				{this.state.statusBar &&
				<div className={'status-drop-down'}>
					<Toggle label="Debug mode" className={'toggleItem'} inlineLabel checked={this.state.debugMode} onChange={this.handleSwitchChange} />
					<div className={'item'} onClick={() => {
						this.props.history.push('/applicationLogs')
					}}>
						<span>Application Logs</span>
						<Badge background={'#737373'}
									 value={this.props.logs && this.props.logs.applicationLogs.length > 0 ? this.props.logs.applicationLogs.length : 0}
									 color={'#ffffff'}/>
					</div>
					{!this.state.debugMode &&
					<
						div className={'item'} onClick={() => {
						this.props.history.push('/failedRequests')
					}}>
						<span>Failed Requests</span>
						<Badge background={'#e12200'}
									 value={this.props.logs && this.props.logs.failedRequests.length > 0 ? this.props.logs.failedRequests.length : 0}
									 color={'#ffffff'}/>
					</div>}
					{this.state.debugMode &&
					<
						div className={'item'} onClick={() => {
						this.props.history.push('/debugLogs')
					}}>
						<span>Debug Logs</span>
						<Badge background={'#0079b8'}
									 value={this.props.logs && this.props.logs.debugData.length > 0 ? this.props.logs.debugData.length : 0}
									 color={'#ffffff'}/>
					</div>}
					<div className={'item'} onClick={() => {
						this.props.history.push('/errorLogs')
					}}>
						<span>Errors</span>
						<Badge background={'#fdcf08'}
									 value={this.props.logs && this.props.logs.sasErrors.length > 0 ? this.props.logs.sasErrors.length : 0}
									 color={'#000000'}/>
					</div>
					<div className={'divider'}>
					</div>
					<div className={'item logout'} onClick={this.logout}>
						<span>Log Out</span>
						<i className={'fas fa-sign-out-alt fa-1x'}></i>
					</div>
				</div>}
			</div>
		)
	}
}


function mapStateToProps(state) {
	return {
		userData: state.home.userData,
		logs: state.adapter.logs,
		rightPanel: state.home.rightPanel
	}

}

function mapDispatchToProps(dispatch) {
	return {
		getUserData: () => getUserData(dispatch),
		setUserData: data => setUserData(dispatch, data),
		setRightPanel: state => setRightPanel(dispatch, state)
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserInfoDropDown))

