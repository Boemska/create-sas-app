import React from 'react'
import {connect} from "react-redux";
import './loading-indicator.scss'

class LoadingIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      loading: false,
      callsListToogle: false
    }
    this.toogleDropDown = this.toogleDropDown.bind(this)
  }

  componentDidMount() {
    this.getRequestsList(this.props)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
   if (this.props.requests !== nextProps.requests) {
    this.getRequestsList(nextProps)
   }
  }

  getRequestsList (props) {
    const requests = Array.from(props.requests.values()).reverse()

    let loading = false;
    for (let file of requests) {
      if (file.running) {
        loading = true;
        break;
      }
    }

    this.loading = loading;
    this.setState({
      loading,
      requests
    })
  }

  toogleDropDown() {
    this.setState({
      callsListToogle: !this.state.callsListToogle
    })
  }


  render() {
    return (
      <div className={'loadingIndicator'}>
        <div className={'pulseLoader'} onClick={this.toogleDropDown} title={'Toggle notification bar'}>
          { this.state.loading  && <div className={'mainSpinner'}>
						<i className={'fas fa-circle-notch fa-spin'} />
					</div>}

          { !this.state.loading && this.state.requests.length > 0 && !this.state.requests[0].successful && <div className={'status fail'}>
            <i className="fas fa-2x fa-exclamation-triangle" />
          </div> }

          { !this.state.loading && this.state.requests.length > 0 && this.state.requests[0].successful && <div className={'status success'}>
            <i className={'far fa-check-circle fa-2x'}/>
          </div>}

        </div>
        { this.state.callsListToogle &&
         this.state.requests.length > 0 && <div className={'dropDownList'}>
          <div style={{position: 'relative'}}>
            <div className={'arrowUp'}></div>
          </div>

          { this.state.requests.map((request, index) =>
            <div className={'item'} key={index}>{request.program}
              {!request.running && request.successful && <i className={'far fa-check-circle text-success align-self-center'}/>}
              {!request.running && !request.successful && <i className={'fas fa-times-circle text-danger align-self-center'}/>}
              {request.running && <div><i className={'fas fa-spinner fa-spin fa-fw text-primary'}/></div>}
            </div>)
          }
        </div>
        }
      </div>
    )
  }
}

function mapStateToProps(store) {
  return {
    requests: store.adapter.requests
  }
}

export default (connect(mapStateToProps)(LoadingIndicator))

