import React from 'react'
import './header.scss'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {removeRequest} from '../../adapterService/adapterActions'
import moment from 'moment'
import {setLeftPanel} from '../../pages/home/homeActions'
import {
	Customizations,
	Stack,
	Persona,
	PersonaPresence,
	PersonaSize,
	FontIcon,
	mergeStyles,
	IconButton
} from '@fluentui/react'
import {setRightPanel} from '../../pages/home/homeActions'
import {HeaderButton} from '../headerButton/headerButton'
import {getUserData} from '../../pages/home/homeActions'

const iconClass = mergeStyles({
	fontSize: 50,
	height: 50,
	width: 50,
	color: '#fff'
})

class Header extends React.PureComponent {
	constructor(props) {
		super(props)
		this.requestsWatcherInterval = null
		this.customization = Customizations.getSettings(['theme'])
		this.state = {
      requests: [],
      loading: false
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

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.props.requests !== nextProps.requests) {
		 this.getRequestsList(nextProps)
		}
	 }

	 getRequestsList (props) {
    const requests = Array.from(props.requests.values()).reverse()

    let loading = false;
    for (let file of requests) {
      if (file.running) {
        loading = true;
        break;
      }
    }

    this.loading = loading;
    const obj = {
      loading, 
      requests
    }
    this.setState(obj)
    props.setHeaderState(obj)
  }

	componentDidMount() {
		this.requestsWatcher();
		this.props.getUserData();
	}

	componentWillUnmount() {
		clearInterval(this.requestsWatcherInterval);
	}

	getPresentanceStage=()=>{
		if (this.props.offline) {

			return PersonaPresence.offline
			}
		if (this.state.loading){
		
			return PersonaPresence.away
		}
    if (!this.state.loading && this.state.requests.length > 0 &&  !this.state.requests[0].successful){

			return PersonaPresence.dnd
		} 
    if (!this.state.loading && this.state.requests.length > 0 &&  this.state.requests[0].successful){

			return PersonaPresence.online
		}  
	}

	render() {
    const avatar = this.props.userData? this.props.userData.userAvatar : null;
    const presence = this.getPresentanceStage();
		return (
			<div className={'header'} style={{backgroundColor: this.customization.theme.palette.themePrimary}}>
				{this.props.width < 600 ? <IconButton
          iconProps={{iconName: 'GlobalNavButton'}}
					className={`${iconClass} leftPanelToggle`}
					onClick={() => this.props.toggleLeftPanel(!this.props.leftPanel)}/> : <div></div>
				}
				<div className={'info-block'}>
					<Stack
						gap={10}
						horizontal
						className={'info-block'}
					>
						{/* <LoadingIndicator/> */}
						{
							this.props.update &&
								<IconButton
								onClick={() => window.location.reload()}
								style={{width: '60px', fontSize: '50px'}}
								className={'updateIconButton'}
								iconProps={{iconName: 'Refresh'}}
								title={'New update available'}
								ariaLabel={'New update available'}/>
						}
						{
							this.props.offline &&
							<IconButton
								style={{width: '60px'}}
								className={'offlineIconButton'}
								iconProps={{iconName: 'WifiWarning4'}} title={'App working in offline mode'}
								ariaLabel={'App working in offline mode'}/>
						}
						<HeaderButton
							onClick={() => this.props.setRightPanel(!this.props.rightPanel)}
							color={'white'}
							background={'#005A9E'}
							value={this.props.logs.applicationLogs.length}/>
						<Persona
							onClick={() => this.props.setRightPanel(!this.props.rightPanel)}
							size={PersonaSize.size32}
							presence={presence}
							imageAlt="User photo"
							imageUrl={avatar}
						/>
					</Stack>
				</div>
			</div>)
	}
}

function mapStateToProps(state) {
	return {
		requests: state.adapter.requests,
		leftPanel: state.home.leftPanel,
		rightPanel: state.home.rightPanel,
		width: state.home.width,
		userData: state.home.userData,
		logs: state.adapter.logs,
		offline: state.header.offline,
		update: state.header.update
	}
}

function mapDispatchToProps(dispatch) {
	return {
		removeRequest: (promise) => removeRequest(dispatch, promise),
		toggleLeftPanel: state => setLeftPanel(dispatch, state),
		setRightPanel: (rightPanel) => setRightPanel(dispatch, rightPanel),
		getUserData: () => getUserData(dispatch)
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))

