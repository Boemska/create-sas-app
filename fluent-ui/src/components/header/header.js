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
import unknownPerson from '../../assets/images/unknownPerson.png'

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
		this.requestsWatcher();
	}

	componentWillUnmount() {
		clearInterval(this.requestsWatcherInterval);
	}

	render() {
		const avatar = this.props.userData ? this.props.userData.userAvatar || (this.props.userData.userInfo && this.props.userData.userInfo[0].AVATAR_URI) : unknownPerson
		return (
			<div className={'header'} style={{backgroundColor: this.customization.theme.palette.themePrimary}}>
				{this.props.width < 600 ? <FontIcon
					iconName="Waffle"
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
								iconProps={{iconName: 'CloudDownload'}}
								title={'New update available'}
								ariaLabel={'New update available'}/>
						}
						{
							this.props.offline &&
							<IconButton
								style={{width: '60px'}}
								className={'offlineIconButton'}
								iconProps={{iconName: 'StreamingOff'}} title={'App working in offline mode'}
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
							presence={this.props.userData ? PersonaPresence.online : PersonaPresence.away}
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
		setRightPanel: (rightPanel) => setRightPanel(dispatch, rightPanel)
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))

