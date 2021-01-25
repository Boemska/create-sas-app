import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
// import adapterService from '../../adapterService/adapterService'
import './home.scss'
import adapterService from '../../adapterService/adapterService'
import {getFormJson} from '../../utils/utils'

const dgButtons = {
	results: {
		title: 'Results Submission',
		content: 'If you have already collected an aggregated results dataset and are looking to submit it, you may do so'+
			' through this part of the application.   Datasets must be in XML format, and cleaned, and maybe some other stuff.',
		button: 'Submit'
	},
	interview: {
		title: 'Interview Mode',
		content: 'If you are an agent collecting data by directly interviewing farmers, then this is the button to click.\n' +
			'\n' +
			'There may be some other guidance data that we put here, but for now here is some more placeholder text.',
		button: 'Interview'
	},
	figures: {
		title: 'Submit my figures',
		content: 'If you are a farmer and you’re here to directly complete the questionnaire for your farm, then this is definitely the box you will be most interested in. This is the one. Don’t look at any others.\n' +
			'\n' +
			'Good luck.',
		button: 'Complete'
	}
}


class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: ''
		}
	}

	render() {
		const fields = {}
		this.props.globalData.role_permissions && this.props.globalData.role_permissions.forEach(p => fields[p.role] = !!parseInt(p.permitted))
		console.log('FIELDS', fields)
		return <div className={'home'}>
			{Object.keys(fields).map((key,i) => {
				if (fields[key]) {
					return <div key={key+i} className={'dgButton'}>
						<div className={'header'}>{dgButtons[key].title}</div>
						<div className={'content'}>{dgButtons[key].content}</div>
						<div className={'footer'}><button className={'pull-right'} onClick={() => this.props.history.push(`/${key}`)}>{dgButtons[key].button}</button></div>
						{this.state.error && <div className={'text-red'}>{this.state.error}</div>}
					</div>
				} else {
					return null
				}
			})}
		</div>
	}
}

function mapStateToProps(store) {
	return {
		mainSpinner: store.header.mainSpinner,
		userData: store.home.userData,
		globalData: store.home.globalData
	}
}

function mapDispatchToProps(dispatch) {
	return {
	}
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home))
