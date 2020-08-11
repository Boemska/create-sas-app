import React, {Component} from 'react';
import {PrimaryButton as Button} from '@fluentui/react';
import {withRouter} from 'react-router'

class Page404 extends Component {
	render() {
		return (
			<div className="app flex-row align-items-center">
				<div className="justify-content-center ms-Grid-row">
					<div className={'ms-Grid-col ms-sm12  ms-lg4'}>
						<div className="clearfix">
							<h1 className="float-left display-3 mr-4">404</h1>
							<h4 className="pt-3">Oops! You're lost.</h4>
							<p className="text-muted float-left">The page you are looking for was not found.</p>
							<Button color="info" onClick={() => {
								this.props.history.push('/')
							}}>Get back on the right path</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(Page404);
