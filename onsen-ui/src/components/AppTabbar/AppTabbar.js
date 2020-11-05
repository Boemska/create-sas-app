import React from 'react';
import Home from '../../pages/home/home'
import Settings from '../../pages/settings/settings'
import {Page, Tabbar, Tab, Toolbar, ToolbarButton, Icon} from 'react-onsenui';
import {connect} from 'react-redux'
import LoadingIndicator from "../loading-indicator/loading-indicator";
import {setSplitter, updateTabbarIndex, setLeftSplitter} from '../../pages/home/homeActions'

class AppTabbar extends React.Component {
  constructor(props) {
    super(props)
    this.name = 'appTabbar' //this name is mandatory for navigator to work
  }

  onSwipe = (index) => {
    this.props.updateTabbarIndex(parseInt(index.activeIndex))
  }

  renderTabs = () => {
    return [
      {
        title: 'Home',
        content: <Home key="home" navigator={this.props.navigator}/>,
        tab: <Tab key="home" icon="md-home"/>
      },
      {
        title: 'Settings',
        content: <Settings key="settings" navigator={this.props.navigator}/>,
        tab: <Tab key="settings" icon="md-settings"/>
      }
    ];
  }

  setShowUserInfoSplitter = (isOpen, isUserSplitter) => {
    if(isUserSplitter==='userSplitter'){
      this.props.setSplitter(isOpen);
    }else{
       this.props.setLeftSplitter(isOpen);
    }
  }

  renderToolbar = () => {
    const title = this.renderTabs()[this.props.index].title
    return (
      <Toolbar>
        <div className="left">
          <ToolbarButton onClick={() => this.setShowUserInfoSplitter(!this.props.isOpenLeftSplitter,'leftSplitter')}>
            <Icon icon='md-menu'/>
          </ToolbarButton>
        </div>
        <div className={'center'}>{title}</div>
        <div className='right'>
          <LoadingIndicator handleIconClick={() => this.setShowUserInfoSplitter(!this.props.isSplitterOpen,'userSplitter')}/>
        </div>
      </Toolbar>
    )
  }

  render() {
    return (
      <Page renderToolbar={this.renderToolbar}>
        <Tabbar
          onPostChange={this.onSwipe}
          swipeable={true}
          visible={!this.props.shouldLogin}
          position='auto'
          index={0}
          renderTabs={this.renderTabs}/>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    shouldLogin: state.login.shouldLogin,
    index: state.home.tabbarIndex,
    isSplitterOpen: state.home.isSplitterOpen,
    isOpenLeftSplitter: state.home.isOpenLeftSplitter
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateTabbarIndex: index => updateTabbarIndex(dispatch, index),
    setSplitter: isOpen => setSplitter(dispatch, isOpen),
    setLeftSplitter: isOpen => setLeftSplitter(dispatch, isOpen)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppTabbar);
