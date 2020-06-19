import React from 'react'
import {connect} from 'react-redux'
import LogHeader from '../../components/logHeader/logHeader'
import {Page, Card} from 'react-onsenui'
import './applicatoinLogs.scss'

class ApplicationLogs extends React.Component {

	constructor(props) {
		super(props);
		this.name = 'applicationLogs'
	}

	render() {
		const applicationLogs = this.props.logs.applicationLogs
		return (
			<Page>
				{applicationLogs && applicationLogs.length > 0
					? applicationLogs.map((log, index) =>
						<Card key={index}>
							<LogHeader log={log}/>
							<br/>
							<div className={'requestStatus'}>
								{log.message}
							</div>
						</Card>) : <h4 className={'text-center text-danger'}>Application logs list is empty!</h4>
				}
			</Page>
		)
	}
}

function mapStateToProps(state) {
	return {
		logs: state.adapter.logs
	}
}

export default connect(mapStateToProps, null)(ApplicationLogs)
