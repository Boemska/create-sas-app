import React from 'react'
// import LogoImg from '../../assets/images/saslogo.svg'
import LogoImg from '../../assets/images/eu-transparent.png'
import './header.scss'
import LoadingIndicator from '../loading-indicator/loading-indicator'
import UserInfoDropDown from '../userInfoDropDown/userInfoDropDown'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {removeRequest} from '../../adapterService/adapterActions'
import moment from 'moment'
import '@mdi/font/scss/materialdesignicons.scss'
import adapterService from '../../adapterService/adapterService'
import {setGlobalData, setLanguage, setQuestionData} from '../../pages/home/homeActions'
import {getFormJson} from '../../utils/utils'


class Header extends React.PureComponent {

	constructor(props) {
		super(props)
		this.requestsWatcherInterval = null
		this.state = {
			error: ''
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
		this.requestsWatcher();
	}

	componentWillReceiveProps(np) {
		if (this.props.userData !== np.userData && np.userData && np.userData.id) {
			this.setState({error: ''})
			this.props.managedRequest(null, null, {
				sasProgram: 'General/startupService',
				dataObj: null
			})
				.then(res => {
					this.props.setGlobalData(res)
					return res.qnr_locations && res.qnr_locations[0] && res.qnr_locations[0].file
				})
				.then(file => {
					if (file) {
						this.props.managedRequest('get', file + '/content', {})
							.then(res => {
								const questionData = getFormJson(res.body)
								this.props.setQuestionData(questionData)
							})
					}
				})
				.catch(e => {
					this.setState({error: e.message})
					console.log(e)
				})
		}
		if (this.props.globalData !== np.globalData) {
			let lang = 'en'
			const settings = np.globalData.settings
			if (settings) {
				for (let s; s = 0; s < settings.length, s++) {
					if (settings[s].property === 'language') {
						lang = settings[s].value
						break;
					}
				}
			}
			this.props.setLanguage(lang)
		}
	}

	componentWillUnmount() {
		clearInterval(this.requestsWatcherInterval);
	}

	render() {
		return (<header>
			<div className={'logoContainer'}>
				<img src={LogoImg} alt={'logo'} onClick={() => {
					this.props.history.push('/')
				}}/>
				<div className={'appName'}><span className={'big'}>FADN</span><span className={'small'}>Farm Accountancy Data Network</span>
				</div>
				{this.state.error && <span className={'text-danger'}>{this.state.error}</span>}

			</div>

			<div className={'info-block'}>
				<LoadingIndicator/>
				{/* eslint-disable-next-line react/jsx-no-undef */}
				<UserInfoDropDown/>
			</div>
		</header>)
	}
}

function mapStateToProps(state) {
	return {
		requests: state.adapter.requests,
		userData: state.home.userData,
		globalData: state.home.globalData,
		questionData: state.home.questionData
	}
}

function mapDispatchToProps(dispatch) {
	return {
		removeRequest: (promise) => removeRequest(dispatch, promise),
		managedRequest: (method, url, options) => adapterService.managedRequest(dispatch, method, url, options),
		setGlobalData: data => setGlobalData(dispatch, data),
		setQuestionData: data => setQuestionData(dispatch, data),
		setLanguage: lang => setLanguage(dispatch, lang)
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))

