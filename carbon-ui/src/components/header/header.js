import React from 'react'
// import LogoImg from '../../assets/images/blogo.svg'
import './header.scss'
import LoadingIndicator from '../loading-indicator/loading-indicator'
import UserInfoDropDown from '../userInfoDropDown/userInfoDropDown'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {removeRequest} from '../../adapterService/adapterActions'
import moment from 'moment'
import {
	Header as CarbonHeader,
	HeaderGlobalBar,
	HeaderPanel,
	HeaderNavigation,
	HeaderMenuItem,
	HeaderName
} from "carbon-components-react/lib/components/UIShell";
import {Close32, Menu32, Restart32, Folder32, Edit32, UserAvatarFilled32, Warning32, Information32} from '@carbon/icons-react';
import ReactTooltip from "react-tooltip";
import Save from '../save/save'
import { Button } from 'carbon-components-react'
import constants from '../../config/constants';

const logs = ['/applicationLogs', '/errorLogs', '/failedRequests', '/debugLogs'];

class Header extends React.PureComponent {

	constructor(props) {
		super(props)
		this.requestsWatcherInterval = null;
		this.state = {
			toogleSidenav: false,
			toogleNewProjectDialog: false
		}
	}

	requestsWatcher = () => {
		this.requestsWatcherInterval = setInterval(() => {
			Array.from(this.props.requests.keys()).forEach(key => {
				let param = this.props.requests.get(key)
				let timeDiff = moment().diff(moment(param.timestamp), 'seconds')
				if (timeDiff > 360) {
					this.props.removeRequest(key)
				}
			})
		})
	}

	componentDidMount() {
		// this.requestsWatcher();
	}

	componentWillUnmount() {
		clearInterval(this.requestsWatcherInterval);
	}

	routing = () => {
		//console.log(logs.includes(this.props.history.location.pathname))
		if (logs.includes(this.props.history.location.pathname)) {
			this.props.history.replace('/')
		}
		else {
			this.props.history.push('/')
		}

	}

	render() {
		const avatar = this.props.userData && (this.props.userData.userAvatar || (this.props.userData.userDetails && this.props.userData.userDetails[0].AVATAR_URI))
		const username = this.props.userData && (this.props.userData.name || (this.props.userData.userDetails && this.props.userData.userDetails[0].USERNAME))
		return (
			<CarbonHeader aria-label="Boemska Platform name">
				<div onClick={() => this.props.triggerPanel()} style={{marginLeft: '10px'}}>
					{
						!this.props.panelTogled ? <Menu32 className={'headerIcon'}/> : <Close32 className={'headerIcon'}/>
					}
				</div>
				{/* <HeaderName className={'name'} onClick={() => this.routing()} prefix="">
							<img src={LogoImg} alt={'logo'} className={'logo'} />
						</HeaderName> */}
				<HeaderName children="" prefix="Carbon seed">

				</HeaderName>
				{ constants.VIYA?
          <HeaderNavigation aria-label="Actions">

					<HeaderMenuItem onClick={() => this.props.openDialog()} data-tip="Add new project">
						<Edit32 className={'headerIcon'}/>
					</HeaderMenuItem>
					<HeaderMenuItem data-tip="Refresh">
						<Restart32 className={'headerIcon'}/>
					</HeaderMenuItem>
					<HeaderMenuItem data-tip="Project list" onClick={() => this.props.history.push('/projectList')}>
						<Folder32 className={'headerIcon'}/>
					</HeaderMenuItem>
					<HeaderMenuItem data-tip="Save">
						<Save color={"white"}/>
					</HeaderMenuItem>
					<ReactTooltip className="tolltip" delayShow={500}/>
				</HeaderNavigation> : null
        }
				<HeaderGlobalBar>
					{
						this.props.update?
							<Button renderIcon={Warning32} className={'spr5'} onClick={() => window.location.reload()}>New update available </Button>	: null
					}
           {
            this.props.offline?
              <Button renderIcon={Information32} className={'spr5'}>App working in offline mode </Button>	: null
          }


					<LoadingIndicator/>

					<div>
						{avatar ? <img src={avatar} alt="user" className="user-avatar"/> : <UserAvatarFilled32 className="avatar"/>}
					</div>
					<div onClick={() => this.setState({...this.state, toogleSidenav: !this.state.toogleSidenav})}>
						{this.props.userData ? <span className={'title spl5 spr5'}>{username}</span> :
							<span className={'title spl5 spr5'}>Not logged in</span>
						}
					</div>
				</HeaderGlobalBar>

				<HeaderPanel aria-label="Sidenav" expanded={this.state.toogleSidenav}>
					<UserInfoDropDown
						closeSideNav={() => this.setState({...this.state, toogleSidenav: !this.state.toogleSidenav})}/>
				</HeaderPanel>

				{/* <NewProject edit={null} open={this.state.toogleNewProjectDialog} close={() => this.setState({...this.state, toogleNewProjectDialog: false})} /> */}
			</CarbonHeader>
		)
	}
}

function mapStateToProps(state) {
	return {
		requests: state.adapter.requests,
		userData: state.home.userData,
		update: state.header.update,
    offline: state.header.offline
	}
}

function mapDispatchToProps(dispatch) {
	return {
		removeRequest: (promise) => removeRequest(dispatch, promise),

	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))

