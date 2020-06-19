import React from 'react'
import './boCollapsible.scss'

class BoCollapsible extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			collapsed: false
		}
	}

	collapse() {
		this.setState({
			collapsed: !this.state.collapsed
		})
	}

	render() {
		const open = this.state.collapsed ? 'open' : ''
		return (
			<div className={'boCollapsible'}>
				<div className={'title'} onClick={() => {
					this.collapse()
				}}>
					<i className={`fas fa-caret-right fa-1x  ${open}`}/>
					{typeof this.props.title === 'function' ? this.props.title() : this.props.title}
				</div>

				<div className={`content ${open}`}>
					{typeof this.props.content === 'function' ? this.props.content() : this.props.content}
				</div>
			</div>

		)
	}
}

export default BoCollapsible
