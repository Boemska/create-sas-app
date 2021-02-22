import React from 'react';
import {Button, Page, BackButton, Toolbar, Navigator, Icon, ProgressCircular} from 'react-onsenui'
import {connect} from 'react-redux'
import {
  fetchRootFolders,
  fetchFolderChildren,
  leaveCurrentFolder,
  fetchFolderChildrenByUri
} from './metadataTreeActions'
import {getRequestsList} from '../../common/utils'
import './metadataTree.scss'
import AppTabbar from "../AppTabbar/AppTabbar";

class MetadataTree extends React.Component {

  constructor(props) {
    super(props);
    this.loadPage = this.loadPage.bind(this);
    this.name = 'metadataTree'
  }

  componentDidMount = () => {
    this.props.fetchRootFolders();
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

  renderToolbar = (route, navigator) => {
    const backButton = route.hasBackButton
      ? <BackButton onClick={this.handleLeaveFolder.bind(this, navigator)}/>

    :<i className="zmdi zmdi-arrow-left backArrow" onClick={this.loadPage.bind(this, AppTabbar)}></i>
    // <Button  onClick={this.loadPage.bind(this, AppTabbar)}>Back</Button>;

    return (
      <Toolbar>
        <div className='left'>{backButton}</div>
        <div className={'center path'}>{route.title}</div>
      </Toolbar>
    );
  }

  handleLeaveFolder = (navigator) => {
    this.props.leaveCurrentFolder();
    navigator.popPage();
  }

  pushPage = (navigator, currentRoute, folderName, id, uri) => {
    let rootRoute = '/'
    let isRoot = false;
    if (currentRoute === rootRoute) {
      isRoot = true;
      currentRoute += folderName;
    } else {
      currentRoute += `/${folderName}`
    }
    navigator.pushPage({
        title: `${currentRoute}`,
        hasBackButton: true,
        id: id
      }
    )
    if (isRoot) {
      this.props.fetchFolderChildren(id);
    } else {
      this.props.fetchFolderChildrenByUri(uri);
    }
  }

  renderPage = (route, navigator) => {
    const {folders, requests} = this.props;
    const requestsStatus = requests ? getRequestsList(requests) : null;
    const currentFolderIndex = folders ? folders.length - 1 : null;

    return (
      <Page
        className={'pageWrapper'}
        key={route.title} renderToolbar={this.renderToolbar.bind(this, route, navigator)}>
        {requestsStatus && !requestsStatus.loading ?
          folders[currentFolderIndex] && folders[currentFolderIndex].map((folder, index) =>
            <div key={index}>
              <Button
                className={'folderBtn'}
                onClick={this.pushPage.bind(this, navigator, route.title, folder.name, folder.id, folder.uri)}>
                <Icon
                  className={'icon-m'}
                  icon='folder'/>
                {folder.name}
              </Button>
            </div>
          )
          :
          <ProgressCircular indeterminate />
        }
      </Page>
    );
  }

  render() {
    return (
      <Navigator
        swipeable
        renderPage={this.renderPage}
        initialRoute={{
          title: '/',
          hasBackButton: false
        }}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchRootFolders: () => fetchRootFolders(dispatch),
    fetchFolderChildren: (folderId) => fetchFolderChildren(dispatch, folderId),
    leaveCurrentFolder: () => leaveCurrentFolder(dispatch),
    fetchFolderChildrenByUri: (uri) => fetchFolderChildrenByUri(dispatch, uri)
  }
}

function mapStateToProps(store) {
  return {
    folders: store.metadataTree.folders,
    requests: store.adapter.requests,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MetadataTree);