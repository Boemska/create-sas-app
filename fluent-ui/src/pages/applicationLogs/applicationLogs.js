import React from 'react'
import {connect} from 'react-redux'
import LogHeader from '../../components/logHeader/logHeader'


class ApplicationLogs extends React.Component {

	render() {
		const applicationLogs = this.props.logs.applicationLogs
		return (
			<div>
				<h2 className={'text-center'}> Application Logs</h2>
				{applicationLogs && applicationLogs.length > 0
					? applicationLogs.map((log, index) =>
						<div className={'item'} key={index}>
							<LogHeader log={log}/>
							<br/>
							<pre>{log.message}</pre>
						</div>) : <h4 className={'text-center text-danger'}>Application logs list is empty!</h4>
				}
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		logs: state.adapter.logs
	}
}

export default connect(mapStateToProps)(ApplicationLogs)
