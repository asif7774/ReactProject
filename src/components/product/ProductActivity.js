import React, { Component } from 'react';
import * as actions from '../../actions'
import { connect } from 'react-redux'
// import axios from 'axios'
// import { BASE_URL } from '../../config/config'
import { Feed, Icon, Grid, Segment } from 'semantic-ui-react'
import Navbar from '../common/Navbar'
import LeftSidebar from '../common/LeftSidebar'
import RightSection from '../common/RightSection'
import Follow from '../activityFeed/Follow';
import AddStatus from '../activityFeed/AddStatus'
import AddYoutube from '../activityFeed/AddYoutube'
// import Create from '../activityFeed/Create'
import AddRaw from '../activityFeed/AddRaw'
import AddApplication from '../activityFeed/AddApplication'
class Activity extends Component {
    renderFeed() {

        return this.props.product.activity.Items.map((item, index) => {
            console.log(item)
            if (item.type === 'FOLLOW') {
                return <Follow item={item} key={index} />
            } if (item.type === 'ADD_RAW') {
                return <AddRaw item={item} key={index} />
            } if (item.type === 'ADD_APPLICATION') {
                return <AddApplication item={item} key={index} />
            } if (item.type === 'ADD_STATUS') {
                return <AddStatus item={item} key={index} />
            } if (item.type === 'ADD_YOUTUBE') {
                return <AddYoutube item={item} key={index} />
            } else {
                return <Follow item={item} key={index} />
            }
        })
    }
    render() {
        return (
            <Navbar>
                <Segment className="body-background" basic>
                    <Grid stackable={true}>
                        <LeftSidebar />
                        <Grid.Column width={10} style={{ 'border': '1px solid rgba(0,0,0,0.3)' }}>

                            <Grid style={{ fontSize: '20px' }}>
                                <Grid.Column width={1} className="background-light-green" >
                                    <Icon color={'white'} name='arrow left' />
                                </Grid.Column>
                                <Grid.Column width={14} className="color-light-green" >
                                    Optical Fibre's feed
                                </Grid.Column>
                                <Grid.Column width={1}>
                                    <Icon name='external share ' />
                                </Grid.Column>
                            </Grid>

                            <Grid className="background-white">

                                <Feed style={{ width: '100%', paddingTop: '30px' }} fluid size={'large'}>

                                    {this.props.product.activity && this.renderFeed()}

                                </Feed>
                            </Grid>
                        </Grid.Column>
                        <RightSection />
                    </Grid>
                </Segment>
            </Navbar>
        );
    }
}
function mapStateToProps({ singleProduct, auth }) {
    return { product: singleProduct, auth };
}


export default connect(mapStateToProps, actions)(Activity);
