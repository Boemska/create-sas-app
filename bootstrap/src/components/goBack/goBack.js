import React from 'react'
import {withRouter} from 'react-router'
import './goBack.scss'

class GoBack extends React.PureComponent {
	render() {
		return <div className={'goBackButton'} title={'Back'}>
			<i className="fas fa-chevron-left" onClick={() => this.props.history.goBack()}/>
		</div>
	}
}

export default withRouter(GoBack)
