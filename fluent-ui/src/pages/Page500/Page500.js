import React, {Component} from 'react';

class Page500 extends Component {
	render() {
		return (
			<div className="app flex-row align-items-center">
					<div className="justify-content-center ms-Grid-row">
						<div className={'ms-Grid-col ms-sm12  ms-lg4'}>
								<span className="clearfix">
									<h1 className="float-left display-3 mr-4">500</h1>
									<h4 className="pt-3">Houston, we have a problem!</h4>
									<p className="text-muted float-left">The page you are looking for is temporarily unavailable.</p>
								</span>
						</div>
					</div>
			</div>
		);
	}
}

export default Page500;
