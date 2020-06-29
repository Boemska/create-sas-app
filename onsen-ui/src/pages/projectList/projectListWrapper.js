import React from 'react';

import {
  Navigator
} from 'react-onsenui';
import {Switch} from 'react-router'

import ProjectList from './projectList';

const renderPage = (route, navigator) => {
  return <route.component key={route.key} navigator={navigator}/>
}

const ProjectWrapper = () => (
  <Switch>
  <Navigator
    renderPage={renderPage}
    initialRoute={{component: ProjectList, key: 'projectList'}}
  />
  </Switch>
);

export default ProjectWrapper;