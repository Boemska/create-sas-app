import React from 'react';
import {Page} from 'react-onsenui'
import './projectProperties.scss'
import NavBar from '../../components/navBar/navBar'

class ProjectProperties extends React.Component {

	constructor(props) {
		super(props);
		this.name = 'projectProperties'
	}

	popPage = (page,navigator) => {
		navigator.popPage();
	}


	render() {
		const {project,navigator} = this.props;
		return (
			<Page key={'projectProperties'} renderToolbar={()=> <NavBar title={project.name} navigator={navigator} backButton={true}/>}>
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