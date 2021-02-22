import React from 'react'
import {
	Page,
	section,
	Range,
	ListTitle
} from 'react-onsenui';
import './rangeSlider.scss'
import CustomToolbar from "../customToolbar/customToolbar";

class RangeSlider extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 0
		}
		this.name = 'rangeSlider' //this name is mandatory for navigator to work
	}

	handleChange = (event) => {
		console.log(event.target.value);
		this.setState({value: event.target.value});
	}

	render() {
		return (
			<Page renderToolbar={()=><CustomToolbar title={'Rangle Slider'}/>}>
				<ListTitle>
					docs: <a href="https://onsen.io/v2/api/react/Range.html"> rangeSlider-docs-onsen</a>
				</ListTitle>
				<section style={{textAlign: 'center'}}>
					<p>
						<span>-50</span>
						<Range
							onChange={this.handleChange}
							value={Number(this.state.value)}
							min={-50}
							max={50}
						/>
						<span>+50</span>
					</p>
					<p>
						Value: {this.state.value}
					</p>
				</section>
			</Page>
		)
	}
}

export default RangeSlider;
