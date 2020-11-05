import React from 'react';
import {
	Page,
	List,
	ListItem
} from 'react-onsenui'
import MyList from '../MyList/MyList'
import MyActionSheet from '../../pages/actionSheet/actionSheet'
import FormInput from '../formInput/formInput'
import AlertDialogs from '../alertDialogs/alertDialogs'
import RangeSlider from '../rangeSlider/rangeSlider'
import ModalTest from '../modal/modal'
import MetadataTree from '../metadataTree/metadataTree'
import ProjectList from '../../pages/projectList/projectList'
import './leftSplitter.scss'
import {setLeftSplitter} from "../../pages/home/homeActions";
import {connect} from "react-redux";

export class LeftSplitter extends React.PureComponent {
	constructor(props) {
		super(props);
		this.loadPage = this.loadPage.bind(this);
	}

	closeSplitter = () => {
		this.props.setLeftSplitter(false);
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
		if(!(page_name==='projectList' && currentPage.key===null)) {
			if (currentPage.key !== page_name) {
				this.props.navigator.resetPage({component: page, props: {key: page_name}}, {animation: 'slide'});
			}
		}
	}

	onPush = (component, key) => {
    this.props.navigator.pushPage({component: component, props: {key: key}}, {animation: "fade"})
    this.props.setLeftSplitter(false);
  }

	render() {
		return (
			<Page>
				<List>
					<ListItem key={'myList'} onClick={() => this.onPush(MyList, 'myList')}  tappable>
						My List
					</ListItem>
					<ListItem key={'actionSheet'} onClick={() => this.onPush(MyActionSheet, 'actionSheet')} tappable>
						My Action Sheet
					</ListItem>
					<ListItem key={'formInput'} onClick={() => this.onPush(FormInput, 'formInput')} tappable>
						Form Input
					</ListItem>
					<ListItem key={'alertDialogs'} onClick={() => this.onPush(AlertDialogs, 'alertDialogs')} tappable>
						Alert Dialogs
					</ListItem>
					<ListItem key={'rangeSlider'} onClick={() => this.onPush(RangeSlider, 'rangeSlider')} tappable>
						Range Slider
					</ListItem>
					<ListItem key={'modalTest'} onClick={() => this.onPush(ModalTest, 'modalTest')} tappable>
						Modal
					</ListItem>
					<ListItem key={'metadataTree'} onClick={this.loadPage.bind(this, MetadataTree)} tappable>
						Metadata tree
					</ListItem>
					<ListItem key={'projectList'} onClick={this.loadPage.bind(this, ProjectList)}  tappable>
						ProjectList
					</ListItem>
				</List>
			</Page>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setLeftSplitter: isOpenLeftSplitter => setLeftSplitter(dispatch, isOpenLeftSplitter)
	}
}

export default connect(null, mapDispatchToProps)(LeftSplitter);

