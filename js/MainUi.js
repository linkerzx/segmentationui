import React, {Component} from 'react';
import {Header, Label, Menu, Icon, Grid, Container} from 'semantic-ui-react';
import SegmentList from './SegmentList';
import GeoFence from './Geofence';
//import HeatMap from './Heatmap';

class MainUi extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			current_page: "segments",
			current_content: <SegmentList/>
		};
	}
	menu(value) {
		this.setState({current_page: value});
		if(value == "Segments") { this.setState({current_content: <SegmentList/>});}
                else if(value == "Location") { this.setState({current_content: <GeoFence/>});}
		else if(value == "HeatMaps") { this.setState({current_content: <HeatMap/>});}
		else {this.setState({current_content: <div>Nothing</div>});}
	}
	render () {
		return (
			<div>
				<Grid columns={2} stackable>	
					<Grid.Row> 
						<Grid.Column width={3}>
							<Menu vertical>
								<Menu.Item onClick={()=> this.menu('Segments')}><Icon name="target"/>Segments</Menu.Item>
								<Menu.Item onClick={()=> this.menu('Location')}><Icon name="location arrow"/>Location</Menu.Item>
								<Menu.Item></Menu.Item>
	
							</Menu>
						</Grid.Column>
						<Grid.Column width={11} floated='left' > 
							<Container fluid> 
								<p></p>
								<Header> {this.state.current_page}</Header>
								{this.state.current_content}
							</Container>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		);
	}
};

export default MainUi;
