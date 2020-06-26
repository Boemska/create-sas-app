import React from 'react';

import {
  Navigator
} from 'react-onsenui';

import ProjectList from './projectList';

const renderPage = (route, navigator) => {
  return <route.component key={route.key} navigator={navigator}/>
}

const ProjectWrapper = () => (
  <Navigator
    renderPage={renderPage}
    initialRoute={{component: ProjectList, key: 'projectList'}}
  />
);

export default ProjectWrapper;