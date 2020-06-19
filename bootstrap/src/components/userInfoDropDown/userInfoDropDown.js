import React from 'react';
import './userInfoDropDown.scss'
import unknownPerson from '../../assets/images/unknownPerson.png'
import adapterService from "../../adapterService/adapterService";
import {connect} from 'react-redux'
import Toggle from 'react-toggle'
import {withRouter} from 'react-router'
import Badge from "../badge/badge";
import toastr from 'toastr'
import {getUserData, setUserData} from '../../pages/home/homeActions'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6


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

		let debugMode = localStorage.getItem('debugMode');
		if (debugMode) {
			debugMode = JSON.parse(debugMode)
		} else {
			debugMode = false
		}

		this.setState({debugMode}, () => {
			adapterService.setDebugMode(this.state.debugMode)
		})
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
			adapterService.setDebugMode(this.state.debugMode)
		})
	}

	render() {
		const username = this.props.userData && (this.props.userData.name || (this.props.userData.userDetails && this.props.userData.userDetails[0].USERNAME))
		const avatar = this.props.userData && (this.props.userData.userAvatar || (this.props.userData.userDetails && this.props.userData.userDetails[0].AVATAR_URI))

		return (
			<div tabIndex='0' className={'info-bar-drop'}>
				<div
					className={'info-header'}
					onClick={() => this.setState({statusBar: !this.state.statusBar})}
					// onMouseEnter={() => this.statusBarShow(true)}
					// onMouseLeave={() => this.statusBarShow(false)}
				>
					<img src={this.props.userData ? avatar : unknownPerson} alt="avatar"/>
					{this.props.userData ? <span className={'title'}>{username}</span> :
						<span className={'title'}>Not logged in</span>
					}
					<i className={`fas fa-caret-left fa-1x ${this.state.statusBar ? 'arrowDown' : ''}`}/>
				</div>
				<ReactCSSTransitionGroup
					transitionName="notifications"
					transitionEnterTimeout={0}
					transitionLeaveTimeout={0}>
					{this.state.statusBar &&
					<div className={'status-drop-down'}>
						<div className={'toggleItem'} onClick={this.handleSwitchChange}>
							<div className={'toggle'}>Debug Mode
								<Toggle
									id='cheese-status'
									checked={this.state.debugMode}
									onChange={this.handleSwitchChange}/>
							</div>
						</div>
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
				</ReactCSSTransitionGroup>
			</div>
		)
	}
}


function mapStateToProps(state) {
	return {
		userData: state.home.userData,
		logs: state.adapter.logs
	}

}

function mapDispatchToProps(dispatch) {
	return {
		getUserData: () => getUserData(dispatch),
		setUserData: data => setUserData(dispatch, data)
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserInfoDropDown))

