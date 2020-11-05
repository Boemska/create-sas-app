import React from 'react';
import adapterService from "../../adapterService/adapterService";
import {connect} from 'react-redux'
import Badge from "../badge/badge";
import {getUserData, setUserData, setSplitter} from '../../pages/home/homeActions'
import ErrorLogs from '../../pages/errorLogs/errorLogs'
import {
	Dialog,
	Icon,
	Page,
	List,
	ListItem,
	Switch
} from 'react-onsenui'
import FailedRequests from '../../pages/failedRequests/failedRequests'
import DebugLogs from '../../pages/debugLogs/debugLogs'
import ApplicationLogs from '../../pages/applicationLogs/applicationLogs'
import './userInfoSplitter.scss'
import {getRequestsList} from '../../common/utils'


export class UserInfoSplitter extends React.PureComponent {
	constructor(props) {
		super(props);
		this.loadPage = this.loadPage.bind(this);
		this.state = {
			debugMode: false,
			dialogShown:false,
			expandedRequests:false
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

	logout = () => {
		this.closeSplitter();
		adapterService.logout()
			.then(() => {
				// This will trigger getting user's data and
				// creating of fresh csrf token for login form
				// which will pop up automatically
				this.props.setUserData(null)
				this.props.getUserData()
			})
			.catch(error => {
				this.setDialog(true);
			})
	}

	closeSplitter = () => {
		this.props.setSplitter(false);
	}

	handleSwitchChange = () => {
		this.setState({
			debugMode: ! this.state.debugMode
		}, () => {
			adapterService._debugMode = this.state.debugMode;
			const debugMode = adapterService._debugMode
			localStorage.setItem("debugMode", debugMode);
		})
	}

	loadPage(page) {
		this.closeSplitter();
		const currentPage = this.props.navigator.pages.slice(- 1)[0];
		let new_page;
		if (page.WrappedComponent) { //if component is wrapped (connect(...)(ComponentName))
			new_page = new page.WrappedComponent();
		} else {
			new_page = new page();
		}
		const page_name = new_page.name
		if (currentPage.key !== page_name) {
			this.props.navigator.resetPage({component: page, props: {key: page_name}}, {animation: 'fade'});
		}
	}

	setDialog=(isOpenDialog)=>{
		this.setState({dialogShown:isOpenDialog})
	}

	setExpandedList=()=>{
		this.setState({expandedRequests:!this.state.expandedRequests})
	}

	handleUpdate=()=>{
			window.location.reload();
	}

	onPush = (component, key) => {
    this.props.navigator.pushPage({component: component, props: {key: key}}, {animation: "fade"})
    this.props.setSplitter(false);
  }

	render() {
		const requestsStatus = getRequestsList(this.props.requests)
		return (
			<Page>
				<List>
					{	this.props.isUpdateAvailable &&
						<ListItem key={'newUpdate'} onClick={this.handleUpdate} tappable>
								Update
								<div className="right">
									<i style={{color:"#fdcf08",fontSize:"20px"}}
										className="fas fa-exclamation-circle text-warning"/>
									</div>
							</ListItem>
					}
					<ListItem key={'debugMode'} tappable onClick={this.handleSwitchChange}>
						Debug Mode
						<div className="right">
							<Switch checked={this.state.debugMode}/>
						</div>
					</ListItem>
					<ListItem key={'applicationLogs'} onClick={() => this.onPush(ApplicationLogs, 'applicationLogs')} tappable>
						Application Logs
					</ListItem>
					{
						this.state.debugMode ?
							<ListItem key={'debugLogs'} onClick={() => this.onPush(DebugLogs, 'debugLogs')}  tappable>
								Debug Logs
								<div className="right">
									<Badge background={'#0079b8'}
												 value={this.props.logs && this.props.logs.debugData.length > 0 ? this.props.logs.debugData.length : 0}
												 color={'#ffffff'}/>
								</div>
							</ListItem>
							:
							<ListItem key={'failedRequest'} onClick={() => this.onPush(FailedRequests, 'failedRequest')} tappable>
								Failed Requests
								<div className="right">
									<Badge background={'#e12200'}
												 value={this.props.logs && this.props.logs.failedRequests.length > 0 ? this.props.logs.failedRequests.length : 0}
												 color={'#ffffff'}/>
								</div>
							</ListItem>
					}
					<ListItem key={'errorLogs'} onClick={() => this.onPush(ErrorLogs, 'errorLogs')}  tappable>
						Errors
						<div className="right">
							<Badge background={'#fdcf08'}
										 value={this.props.logs && this.props.logs.sasErrors.length > 0 ? this.props.logs.sasErrors.length : 0}
										 color={'#000000'}/>
						</div>
					</ListItem>
					<ListItem className={'logout'} key={'logout'} onClick={this.logout} tappable>
						Log Out
						<div className="right">
							<Icon
								size={{material: 22}}
								icon='md-square-right'/>
						</div>
					</ListItem>
					<ListItem key={'expandedRequests'} expandable expanded={this.state.expandedRequests} onClick={this.setExpandedList}>
						Requests
						<div className="expandable-content requests-wrapper">
							{requestsStatus.requests.length > 0 ?
								<List key={'request-list'} className={'requests-list'}>
									{
										requestsStatus.requests.map((request, index) =>
											<ListItem key={index} className={'request'}>
												<div className={'center text-wrapper'}>{request.program}</div>
												<div className={'left padding-icon'}>
													{! request.running && request.successful &&
													<i className={'far fa-check-circle text-success align-self-center'}/>}
													{! request.running && ! request.successful &&
													<i className={'fas fa-times-circle text-danger align-self-center'}/>}
													{request.running && <div><i className={'fas fa-spinner fa-spin fa-fw text-primary'}/></div>}
												</div>
											</ListItem>)
									}
								</List>
								:
								<div className={'no-requests'}>there are no requests</div>
							}
						</div>
					</ListItem>
				</List>
				 <Dialog
          isOpen={this.state.dialogShown}
          isCancelable={true}
          onCancel={()=>this.setDialog(false)}>
          <div className={'dialog-div'}>
            <p className={'message'}>
							Something went wrong!
            </p>
          </div>
        </Dialog>
			</Page>
		)
	}
}


function mapStateToProps(state) {
	return {
		logs: state.adapter.logs,
		requests: state.adapter.requests,
		isUpdateAvailable:state.home.newUpdate
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getUserData: () => getUserData(dispatch),
		setUserData: data => setUserData(dispatch, data),
		setSplitter: (isSplitterOpen) => setSplitter(dispatch, isSplitterOpen)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoSplitter)

