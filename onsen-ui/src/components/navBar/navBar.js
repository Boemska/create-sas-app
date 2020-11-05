import React from 'react';
import {withRouter} from 'react-router'
import {
	Toolbar,
	BackButton, Icon
} from 'react-onsenui';
import {openAndEditProjectDialog} from '../projectDialog/projectDialogActions'
import {openDeleteConformationDialog} from '../conformationDialog/conformationDialogActions'
import {connect} from 'react-redux'
import './navBar.scss'
import {PROJECT_EXTENTION} from '../addProject/addProjectActions'
import {updateFile,saveChanges} from '../../pages/projectProperties/projectPropertiesActions'
import ProjectList from '../../pages/projectList/projectList'
import AppTabbar from '../AppTabbar/AppTabbar'


class NavBar extends React.Component {

	constructor(props) {
    super(props);
    this.loadPage = this.loadPage.bind(this);
    this.name = 'navBar'
  }

	handleDelete = (uri, navigator) => {
		this.props.openDeleteConformationDialog("Process is irreversible, are you sure you want to delete project?", uri, navigator);
	}

	submit = () => {
		const forBlob = JSON.stringify(this.props.projectContent);
		let blob = new Blob([forBlob], {type: "octet/stream"});
		let fileName = this.props.projectContent.name

		// append extension to the file if there is no one
		if (!fileName.endsWith(PROJECT_EXTENTION)) {
			fileName += PROJECT_EXTENTION
		}
		const dataObj = {
			file: [blob, fileName]
		}
		const res = this.props.updateFile(this.props.projectMetadata.uri, dataObj, this.props.projectContent.lastModified);
		res.then(result => {
			let newResult=result.headers['last-modified'] || result.headers.get('Last-Modified')
			this.props.saveChanges(newResult)
		}).catch(e => {
			if (e.status === 412) {
				console.log("Someone has already made changes to this file after last save");
			}
			console.log("SAVE ERROR: ", e)
		})
	}

	loadPage(page) {
    const currentPage = this.props.navigator.pages.slice(-1)[0];
    let new_page;
    if (page.WrappedComponent) { //if component is wrapped (connect(...)(ComponentName))
      new_page = new page.WrappedComponent();
    } else {
      new_page = new page();
    }
    const page_name = new_page.name
    if (!(page_name === 'projectList' && currentPage.key === null)) {
      if (currentPage.key !== page_name) {
        this.props.navigator.resetPage({component: page, props: {key: page_name}}, {animation: 'fade'});
      }
    }
  }

	render() {

		const {title, navigator, backButton, hasIcon} = this.props;
		return (
			<Toolbar>
				<div className='left'>
					{backButton ? <BackButton onClick={() =>{
						if(navigator.pages.length>1) {
							navigator.popPage()
						}else {
							navigator.resetPage({component: ProjectList, props: {key: 'projectList'}}, {animation: 'fade'});
						}
					}}>Back</BackButton> : <i className="zmdi zmdi-arrow-left backArrow" onClick={this.loadPage.bind(this, AppTabbar)}></i>}
				</div>
				<div className='center'>
					{title}
				</div>
				<div className='right'>
					{
						hasIcon &&
						<div
							className={'edit-icon'}
							onClick={() => {
								this.props.openAndEditProjectDialog('Edit project');
							}}>
							<Icon icon='edit' className={'icon-m'}/>
						</div>
					}
					{
						hasIcon &&
						<div
							onClick={() => {
								this.handleDelete(this.props.projectMetadata.uri, navigator);
							}}>
							<Icon icon='trash'/>
						</div>
					}
					{
						(localStorage.getItem("save") === "true") && !hasIcon &&
						<div
							className={'save-icon'}
							onClick={() => {
								if (this.props.save) this.submit()
							}}>
							<Icon icon='save'/>
						</div>
					}
				</div>
			</Toolbar>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return {
		openAndEditProjectDialog: (title) => openAndEditProjectDialog(dispatch, title),
		openDeleteConformationDialog: (message, uri, navigator) => openDeleteConformationDialog(dispatch, message, uri, navigator),
		updateFile:(uri, blob, lastModified)=>updateFile(dispatch, uri, blob, lastModified),
		saveChanges:(result)=>saveChanges(dispatch,result)

	}
}

function mapStateToProps(store) {
	return {
		projects: store.projectList.projects,
		requests: store.adapter.requests,
		projectMetadata: store.project.projectMetadata,
		projectContent: store.project.projectContent,
		save: store.project.save,
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));