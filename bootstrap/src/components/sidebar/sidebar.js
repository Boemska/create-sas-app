import React from 'react'
import './sidebar.scss'
import MenuItem from '../menuItem/menuItem'

class Sidebar extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			active: ''
		}
		this.menuOpen = this.menuOpen.bind(this)
		this.toggleMenu = this.toggleMenu.bind(this)
		this.setActive = this.setActive.bind(this)
	}

	toggleMenu() {
		this.setState({open: !this.state.open})
	}

	menuOpen() {
		if (!this.state.open) {
			this.setState({
				open: true
			})
		}
	}

	setActive(active) {
		this.setState({
			active
		})
	}

// example content functions
	boxContent2 = () => {
		const isOpen = this.state.open
		return <div style={{width: '100%'}}>
			<MenuItem
				title={'Expanded 3'}
				id={'item8'}
				isOpen={isOpen}
				icon={<i className={`fas fa-address-book`}/>}
				sideBarOpen={this.menuOpen}
				setActive={this.setActive}
				active={this.state.active}
			/>
			<MenuItem
				title={'Expanded 4'}
				id={'item9'}
				isOpen={isOpen}
				icon={<i className={`fas fa-address-book`}/>}
				sideBarOpen={this.menuOpen}
				setActive={this.setActive}
				active={this.state.active}
			/>
		</div>
	}

	boxContent1 = () => {
		const isOpen = this.state.open
		return <div style={{width: '100%'}}>
			<MenuItem
				title={'Expanded 1'}
				id={'item6'}
				isOpen={isOpen}
				icon={<i className={`fas fa-address-book`}/>}
				sideBarOpen={this.menuOpen}
				setActive={this.setActive}
				active={this.state.active}/>
			<MenuItem
				expandable
				content={this.boxContent2()}
				title={'Expanded 2'}
				id={'item7'}
				isOpen={isOpen}
				icon={<i className={`fas fa-address-book`}/>}
				sideBarOpen={this.menuOpen}
			/>
		</div>
	}


	render() {
		const open = this.state.open ? 'open' : 'closed'
		return <div className={`sidebar ${open}`}>
			<div className={'toggleIconContainer'}>
				<i title={'Toggle Sidebar'} className={`toggleIcon fas fa-chevron-right ${this.state.open ? 'arrowLeft' : ''}`}
					 onClick={this.toggleMenu}/>
			</div>
			<div className={`itemsContainer ${open}`}>
				<MenuItem
					expandable
					content={this.boxContent1()}
					id={'item1'}
					title={'React'}
					isOpen={this.state.open}
					icon={<i className={`fas fa-atom`}/>}
					sideBarOpen={this.menuOpen}
				/>
				<MenuItem
					expandable
					id={'item1'}
					title={'Ad'}
					isOpen={this.state.open}
					icon={<i className={`fas fa-ad`}/>}
					sideBarOpen={this.menuOpen}
				/>
				<MenuItem
					id={'item2'}
					title={'Adjust'}
					isOpen={this.state.open}
					icon={<i className={`fas fa-adjust`}/>}
					sideBarOpen={this.menuOpen}
				/>
				<MenuItem
					expandable
					id={'item3'}
					title={'Address Book'}
					content={this.boxContent1()}
					isOpen={this.state.open}
					icon={<i className={`fas fa-address-book`}/>}
					sideBarOpen={this.menuOpen}
				/>
				<MenuItem
					expandable
					id={'item4'}
					title={'Align Center'}
					isOpen={this.state.open}
					icon={<i className={`fas fa-align-center`}/>}
					sideBarOpen={this.menuOpen}
				/>
			</div>
		</div>
	}
}


export default Sidebar

