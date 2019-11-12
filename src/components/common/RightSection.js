import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import * as actions from '../../actions/'
import { Label, List, Icon, Grid, Divider, Responsive } from 'semantic-ui-react'
import './style.css';
class RightSection extends Component {

    componentWillMount() {
        this.props.getRecommendedProducts();
    }
    followProducts(id,name) {
        this.props.followProduct(id, name, () => {
            this.props.getRecommendedProducts();
            this.props.getFollowedProducts() 
        });
        // alert("nuohoi")
    }
    renderRecommended() {
        if (this.props.product.recommended) {
            return this.props.product.recommended.slice(0, 5).map((item, index) => {
                return (

                    <List.Item key={index} className="rightBarList">
                        <List.Content floated='right' onClick={() => this.followProducts(item.id,item.product)}>
                            <Icon name={'add'} className="icon-mappes-plus icon-mappes" />
                        </List.Content>
                        <List.Content>
                            <Link to={`/product/${item.id}`} className="a rightBarListItem">
                                {item.product}
                            </Link>
                        </List.Content>
                    </List.Item>
                )
            })
        }
    }

    render() {
        return (
                <div className="column right-content" >    
                    <Grid.Column className="right-content slim-scroll" >
                        <Responsive minWidth={768}>      
                            <Label className="background-light-blue color-white" >
                                Recommended
                                        </Label>
                            based on your network.
                                        <List selection verticalAlign='middle'>

                                {this.renderRecommended()}
                            </List>
                        </Responsive>
                        <Divider section />
                        <List horizontal link className="right-side-footer">         
                            {/* <List.Item as='a'>Terms &amp; Conditions</List.Item>        */}
                            <List.Item as='a' href="/aboutus">About Us</List.Item>
                            <List.Item as='a' href="/contact">Contact Us</List.Item>
                            {/* <List.Item as='a'/>Privacy Policy</List.Item> */}
                            {/* <List.Item as='a'>FAQ</List.Item>  */}
                        </List>
                    </Grid.Column>
                </div>
        )
    }
}
function mapStateToProps({ product }) {
    return { product }
}

export default connect(mapStateToProps, actions)(RightSection);