import React from 'react';
import {
	Page,
	List,
	ListItem
} from 'react-onsenui'
import AppTabbar from '../AppTabbar/AppTabbar'
import MyList from '../MyList/MyList'
import MyActionSheet from '../../pages/actionSheet/actionSheet'
import FormInput from '../formInput/formInput'
import AlertDialogs from '../alertDialogs/alertDialogs'
import RangeSlider from '../rangeSlider/rangeSlider'
import ModalTest from '../modal/modal'
import MetadataTree from '../metadataTree/metadataTree'
import ProjectList from '../../pages/projectList/projectList'
import './leftSplitter.scss'

export class LeftSplitter extends React.PureComponent {
	constructor(props) {
		super(props);
		this.loadPage = this.loadPage.bind(this);
	}

	closeSplitter = () => {
		this.props.isOpenLeftSplitter(false)
	}

	loadPage(page) {
		this.closeSplitter();
		const currentPage = this.props.navigator.pages.slice(- 1)[0];
		let new_page;
		if (page.WrappedComponent) { //if component is wrapped (connect(...)(ComponentName))
			new_page = new page.WrappedComponent();
		} else {
			new_page = new page();
		}
		const page_name = new_page.name
		if (currentPage.key !== page_name) {
			this.props.navigator.resetPage({component: page, props: {key: page_name}}, {animation: 'fade'});
		}
	}

	render() {
		return (
			<Page>
				<List>
					<ListItem key={'appTabbar'} onClick={this.loadPage.bind(this, AppTabbar)} tappable>
						Home
					</ListItem>
					<ListItem key={'myList'} onClick={this.loadPage.bind(this, MyList)} tappable>
						My List
					</ListItem>
					<ListItem key={'actionSheet'} onClick={this.loadPage.bind(this, MyActionSheet)} tappable>
						My Action Sheet
					</ListItem>
					<ListItem key={'formInput'} onClick={this.loadPage.bind(this, FormInput)} tappable>
						Form Input
					</ListItem>
					<ListItem key={'alertDialogs'} onClick={this.loadPage.bind(this, AlertDialogs)} tappable>
						Alert Dialogs
					</ListItem>
					<ListItem key={'rangeSlider'} onClick={this.loadPage.bind(this, RangeSlider)} tappable>
						Range Slider
					</ListItem>
					<ListItem key={'modalTest'} onClick={this.loadPage.bind(this, ModalTest)} tappable>
						Modal
					</ListItem>
					<ListItem key={'metadataTree'} onClick={this.loadPage.bind(this, MetadataTree)} tappable>
						Metadata tree
					</ListItem>
					<ListItem key={'projectList'} onClick={this.loadPage.bind(this,ProjectList)} tappable>
						ProjectList
					</ListItem>
				</List>
			</Page>
		)
	}
}

export default LeftSplitter;

