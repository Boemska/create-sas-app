import React, {useEffect, useState} from 'react'
import {SideNav, SideNavItems, SideNavLink} from 'carbon-components-react'
import './leftPanel.scss';
import {
	Home16,
	Application16,
	Edit32,
	Restart32,
	Folder32
} from '@carbon/icons-react';
import {useHistory} from 'react-router-dom'
import {useSelector} from 'react-redux';
import Save from '../save/save'
import constants from '../../config/constants';


const logs = ['/applicationLogs', '/errorLogs', '/failedRequests', '/debugLogs'];

export const LeftPanel = (props) => {
	const history = useHistory();
	const [showActions, setShowActions] = useState(false);
	const { projectMetadata} = useSelector(state => state.project)
	const projectUri = projectMetadata && projectMetadata.uri.split('/').pop()

	const resizeHandle = () => {
		// At this width carbon hides its navigation bar
		if (window.window.innerWidth < 1056) {
			setShowActions(true);
		}
		else {
			setShowActions(false);
		}
	}

	const routing = () => {
		if (logs.includes(history.location.pathname)) {
			history.replace('/')
		}
		else {
			history.push('/')
		}

	}

	useEffect(() => {
		resizeHandle();
		window.addEventListener('resize', resizeHandle)
		return () => {
			window.removeEventListener('resize', resizeHandle)
		}
  }, [])

	return (
		<SideNav isFixedNav aria-label="Side navigation" expanded={props.toglePanel}>
			<SideNavItems className={'sideItems'}>
				{
					showActions ? <SideNavItems className={'sideActions'}>
							<SideNavLink onClick={props.newProject} title="Add new project">
								<Edit32/>
							</SideNavLink>
							<SideNavLink>
								<Restart32/>
							</SideNavLink>
							<SideNavLink onClick={() => history.push('/projectList')} title="View project list">
								<Folder32/>
							</SideNavLink>
							<SideNavLink>
                {/* TODO: This Save is a custom made component which has the color white for the header, it will not be seen properly in the left panel when a project is dirty and ready for save */}
								<Save color={'#525252'}/>
							</SideNavLink>
						</SideNavItems>


						: null
				}
				<SideNavLink onClick={routing} renderIcon={Home16}>Home</SideNavLink>
			{constants.VIYA ?<SideNavLink renderIcon={Application16} onClick={() => history.push('/project/'+projectUri)}>Project
					properties</SideNavLink> : null}



			</SideNavItems>
		</SideNav>
	)
}



