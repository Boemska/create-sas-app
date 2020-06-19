import React from 'react'
import {connect} from 'react-redux'
import LogHeader from '../../components/logHeader/logHeader'
import GoBack from '../../components/goBack/goBack'

class ErrorLogs extends React.Component{
	render() {
		const sasErrors = this.props.logs.sasErrors
		return(
			<div>
				<GoBack/>
				<h2 className={'text-center'}> Error Logs</h2>
				{ sasErrors && sasErrors.length >0
					? sasErrors.map((log, index) =>
						<div className={'item'} key={index}>
							<LogHeader/>
							<br/>
							<pre>{log.message}</pre>
						</div>):<h4 className={'text-center text-danger'}>Error logs list is empty!</h4>
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

export default connect(mapStateToProps)(ErrorLogs)
