import React from 'react'
import LogoImg from '../../assets/images/blogo.svg'
import './header.scss'
import LoadingIndicator from '../loading-indicator/loading-indicator'
import UserInfoDropDown from '../userInfoDropDown/userInfoDropDown'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {removeRequest} from '../../adapterService/adapterActions'
import moment from 'moment'
import {Customizations, Stack, Persona, PersonaPresence, PersonaSize} from '@fluentui/react'
import unknownPerson from '../../assets/images/unknownPerson.png' 
import {setRightPanel} from '../../pages/home/homeActions'
import {HeaderButton} from '../headerButton/headerButton'

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
				<img src={LogoImg} alt={'logo'} onClick={() => {
					this.props.history.push('/')
				}}/>
				<div className={'info-block'}>
					{/* eslint-disable-next-line react/jsx-no-undef */}
					{/* <UserInfoDropDown/> */}
					<Stack 
						gap={10}
						horizontal
					 	onClick={()=>this.props.setRightPanel(!this.props.rightPanel)}
					 	className={'info-block'}
					>
						{/* <LoadingIndicator/> */}
						<HeaderButton 
							color={'white'} 
							background={'#005A9E'}
							value={this.props.logs.applicationLogs.length}/>
						<Persona
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
		userData: state.home.userData,
		logs: state.adapter.logs,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		removeRequest: (promise) => removeRequest(dispatch, promise),
		setRightPanel: (rightPanel) => setRightPanel(dispatch,rightPanel)
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))

