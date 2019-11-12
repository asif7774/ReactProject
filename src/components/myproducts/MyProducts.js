import React, { Component } from 'react';
import * as actions from '../../actions/';
import { connect } from 'react-redux';
import { Grid, Container, Responsive, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

// import Footer from '../common/Footer';
import Navbar from '../common/Navbar';
// import Preloader from '../common/Preloader';
import LeftSidebar from '../common/LeftSidebar';
// import RightSidebar from '../common/RightSidebar';
import RightSection from '../common/RightSection';



class MyProducts extends Component {
    renderFollowedProducts() {

        if (this.props.user && this.props.user.followedProducts && this.props.user.followedProducts.Items
            && this.props.user.followedProducts.Items.length > 0) {
            return this.props.user.followedProducts.Items.map((item, index) => {
                return (
                    <List.Item key={index}>
                        <List.Content>
                            <List.Description>
                                <Link to={`/product/${item.product_id}`}>
                                    {item.product_name}
                                </Link>
                            </List.Description>
                        </List.Content>
                    </List.Item>
                );
            });
        } else {
            return (
                <div>
                    <h4>You are not following any products</h4>
                </div>
            );
        }
    }

    componentWillMount() {
        this.props.getFollowedProducts();
    }

    render() {
        return (
            this.props.auth &&
            <Navbar {...this.props}>
                <div className="primary-background">
                    <Container className="body-background palm-nudge-sides">
                        <Grid padded stackable>
                            <Responsive as={Grid.Column} className="left-content" minWidth={768}>
                                <LeftSidebar />
                            </Responsive>

                            <div className="white-box">
                                <h4 className=" m-b-20">My followed products</h4>

                                <div className="row b-t">
                                    <div className="col-md-12 p-0">
                                        <div className="list-group mappes-products">
                                            {this.renderFollowedProducts()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <RightSection />
                        </Grid>
                    </Container>
                </div>
            </Navbar>
        );
    }
}

function mapStateToProps({ auth, user }) {
    return { auth, user };
}

export default connect(mapStateToProps, actions)(MyProducts);
