import React from 'react';
import './menuItem.scss'
import PropTypes from 'prop-types'

class MenuItem extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			expandBoxOpen: false
		}
		this.toggleExpandBox = this.toggleExpandBox.bind(this)
	}

	toggleExpandBox() {
		if (this.props.isOpen) {
			this.setState({
				expandBoxOpen: !this.state.expandBoxOpen
			})
		} else {
			this.setState({
				expandBoxOpen: true
			})
			this.props.sideBarOpen()
		}
	}

	render() {
		const {isOpen, title, icon, expandable, content} = this.props
		const openClass = isOpen ? 'open' : 'closed'
		const arrowDown = this.state.expandBoxOpen ? 'arrowDown' : ''
		return (
			<div className={'menuContainer'}>
				<div className={`menuItem ${this.props.active && this.props.active === this.props.id ? 'active' : ''}`}
						 onClick={() => {
							 this.toggleExpandBox()
							 this.props.setActive && this.props.setActive(this.props.id)
						 }}>
					<div className={'menuItemTitle'}>
						<div>
							{icon}
						</div>
						<span className={openClass}>{title}</span>
					</div>
					{expandable &&
					<div className={'expandBar'}>
						<i className={`toggleIcon fas fa-chevron-right ${arrowDown}`}/>
					</div>
					}
				</div>

				{this.state.expandBoxOpen &&
				<div className={`expandBox ${openClass}`}>
					{content}
				</div>
				}

			</div>
		)
	}
}

MenuItem.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	sideBarOpen: PropTypes.func.isRequired,
	setActive: PropTypes.func,
	active: PropTypes.string,
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	icon: PropTypes.object,
	expandable: PropTypes.bool.isRequired,
	content: PropTypes.object
}

MenuItem.defaultProps = {
	expandable: false
}

export default MenuItem
