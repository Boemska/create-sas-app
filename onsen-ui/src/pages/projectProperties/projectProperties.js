import React from 'react';
import {Page, BackButton, Toolbar } from 'react-onsenui'
import ProjectList from '../projectList/projectList'
import './projectProperties.scss'

class ProjectProperties extends React.Component {

	constructor(props) {
		super(props);
		this.name = 'projectProperties'
	}

	renderToolbar = () => {
		const {project} = this.props;
		return (
			<Toolbar>
				<div className='left'>
					<BackButton
						className={'displayed'}
						onClick={this.popPage.bind(this,ProjectList)}></BackButton>
				</div>
				<div className={'center'}>{project.name}</div>
			</Toolbar>
		);
	}

	popPage = (page) => {
		this.props.navigator.resetPage({component: page, props: {key: 'projectList'}}, {animation: 'fade'});
	}


	render() {
		const {project} = this.props;
		return (
			<Page key={'projectProperties'} renderToolbar={this.renderToolbar.bind(this)}>
				<div>
					<p className={'project-property-name'}>Folder Location</p>
					<p className={'project-property'}>{project.parentFolderUri}</p>
				</div>
				<div>
					<p className={'project-property-name'}>Created by</p>
					<p className={'project-property'}>{project.createdBy}</p>
				</div>
				<div>
					<p className={'project-property-name'}>Project file URI</p>
					<p className={'project-property'}>{project.uri}</p>
				</div>
			</Page>
		);
	}
}



export default ProjectProperties;