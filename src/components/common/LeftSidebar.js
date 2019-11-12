import React, { Component } from 'react';
import * as actions from '../../actions/'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { BASE_URL } from '../../config/config'
import axios from 'axios';
import { Transition, List, Grid, Image, Button, Popup } from 'semantic-ui-react'

class LeftSidebar extends Component {

    state = {
        visible: false,
        visibleProducts: false,
        profilePic: ''
    }
    toggleVisibility = () => this.setState({ visible: !this.state.visible })
    toggleProductVisibility = () => this.setState({ visibleProducts: !this.state.visibleProducts })

    renderName() {
        if (this.props.auth) {
            return (
                // <div to={`/networkFeed/user/${this.props.auth.id}`}>
                <span className="hide-menu l-h-20">
                    <Link to={`/networkFeed/user/${this.props.auth.id}`}>
                        {this.props.auth.displayName.split(" ")[0]} {this.props.auth.displayName.split(" ")[1]}
                    </Link>
                    <span className="fa arrow"></span>
                </span>
                // </div>
            )
        } else {
            return (
                <span className="hide-menu">Loading...<span className="fa arrow"></span></span>
            );
        }
    }
    renderProfileImage() {
        if (this.state.profilePic) {
            return (
                <Image className="avatar-42" avatar src={this.state.profilePic} />
            )
        }
        else {
            return (
                <span className="user-initials">
                    {this.props.auth.displayName.split(" ")[0].substring(0, 1)}
                </span>)
        }

    }
    renderFollowedProducts() {
        if (this.props.user.followedProducts && this.props.user.followedProducts.Items.length > 0) {
            return this.props.user.followedProducts.Items.map((item, index) => {
                // console.log(item);
                return (
                    <List.Item key={index}>
                        <List.Content>
                            <Link to={`/product/${item.product_id}`} className="">
                                <span>{item.product_name}</span>
                                {/* <Label color={'blue'}>05</Label> */}
                            </Link>
                            {/* {item.product_name} */}
                        </List.Content>
                    </List.Item>
                )
            })
        } else {
            return (
                <div>
                    <h4>You are not following any products</h4>
                </div>
            );
        }
    }

    componentWillMount() {
        this.props.getFollowedProducts()
        this.props.fetchUser()
        if (this.props.auth) {
            this.getUserPicture(this.props.auth)
        }
    }
    componentWillReceiveProps(nextProps) {

        if (!this.props.auth && nextProps && nextProps.auth) {
            this.getUserPicture(nextProps.auth);
        }
    }
    getUserPicture(user) {
        if (user) {
            let id = user.id
            axios.get(`${BASE_URL}/api/v1/user/${id}`, { withCredentials: true })
                .then(response => {
                    // console.log(response.data.Item.image);
                    this.setState({
                        profilePic: response.data.Item.image
                    })
                }).catch(err => {
                    console.log(err);
                })
        }
    }
    render() {
        return (
            <Grid.Column className="left-content">
                {this.props.auth && <div className="left-sidebar">
                    <List selection verticalAlign='middle'>
                        <List.Item className="user-profile-element cursor-pointer">
                            {/* <List.Content floated='right'>
                                <List.Icon name='chevron right' className="list-arrow-small mT-10" verticalAlign='middle'></List.Icon>
                            </List.Content> */}
                            {this.renderProfileImage()}
                            <List.Content>
                                {this.renderName()}
                            </List.Content>
                        </List.Item>
                        {/* <List.Item className="user-profile-element" onClick={this.toggleVisibility}>
                            <List.Content floated='right'>
                                <List.Icon name='chevron right' className="list-arrow-small mT-10" verticalAlign='middle'></List.Icon>
                            </List.Content>
                            {this.renderProfileImage()}
                            <List.Content>
                                {this.renderName()}
                            </List.Content>
                        </List.Item>                        
                        <Transition visible={this.state.visible} animation={"fade"} duration={"500"}>
                            <div>
                                <List verticalAlign='middle' className="inner-list">
                                    <List.Item as={Link} to="/profile" className="inner-list-profile">
                                        <List.Icon name='setting' verticalAlign='middle'></List.Icon>
                                        <List.Content>
                                            My Business Card
                                        </List.Content>
                                    </List.Item>
                                    <List.Item className="inner-list-profile">
                                        <List.Icon name='power' verticalAlign='middle'></List.Icon>
                                        <List.Content>
                                            <a className="linkedin" href={`${BASE_URL}/auth/logout`}>
                                                Logout
                                            </a>
                                        </List.Content>
                                    </List.Item>
                                </List>
                            </div>
                        </Transition> */}
                        {/* <List.Item as="a" href='/networkFeed/global/noop'> */}
                        <List.Item>
                            <List.Icon name='list' verticalAlign='middle'></List.Icon>
                            <List.Content className="full-width">
                                {/* <div>Network Feed</div><small>(Coming soon)</small> */}
                                {/* <div>Network Feed</div> */}
                                    <Link to='/networkFeed/global'>Network Feed</Link>
                            </List.Content>
                        </List.Item>
                        <Popup inverted
                            trigger={<List.Item onClick={this.toggleProductVisibility}>
                                <List.Icon name='sitemap' verticalAlign='middle'></List.Icon>
                                <List.Content className="full-width">
                                    <div>Following</div>
                                </List.Content>
                                <List.Icon name='chevron right' className="list-arrow-small" verticalAlign='middle'></List.Icon>
                            </List.Item>
                            }
                            content='My Followed Products'
                            position='top center' />
                        <Transition visible={this.state.visibleProducts} animation={"fade"} duration={500}>
                            <div>
                                <List verticalAlign='middle' className="inner-list my-product-list slim-scroll">
                                    {this.props.user && this.props.user.followedProducts && this.renderFollowedProducts()}
                                </List>
                            </div>
                        </Transition>
                    </List>
                </div>}
                {this.props.auth === false &&
                    <div className="left-sidebar no-auth">
                        <Button as={Link} to='/?login=true' color='green'>
                            Login
                        </Button>
                    </div>
                }
            </Grid.Column>
        )
    }

}

function mapStateToProps({ auth, user }) {
    return { auth, user };
}

export default connect(mapStateToProps, actions)(LeftSidebar);
