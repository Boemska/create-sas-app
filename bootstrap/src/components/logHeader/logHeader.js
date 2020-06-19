import React from 'react'
import moment from 'moment'

const LogHeader = (props) => {
	const {log} = props
	if (log) {
		const title = log.sasProgram === undefined ? 'Unknown service name' : log.sasProgram
		return <div>
			<div className={'pull-left'}>{title}</div>
			{log && log.time &&
			<div className={'pull-right'}>{moment(log.time).format('MMM Do YYYY h:mm:ss')}</div>
			}
		</div>
	}
	return null

}

export default LogHeader
