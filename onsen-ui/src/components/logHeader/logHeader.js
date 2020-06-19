import React from 'react'
import moment from 'moment'

const LogHeader = (props) => {
	const {log} = props
	const title = log.sasProgram === undefined ? 'Unknown service name' : log.sasProgram
	return <div>
		<div>{title}</div>
		{log && log.time &&
		<div>{moment(log.time).format('MMM Do YYYY h:mm:ss')}</div>
		}
	</div>
}

export default LogHeader
