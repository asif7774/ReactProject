import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/'
import { Icon, Form, Grid, Button, Dropdown, Modal, Popup } from 'semantic-ui-react'
import axios from 'axios'
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../config/config'

class Info extends Component {


    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            addRawButtonLoading: false
        }

    }
    componentDidMount() {

        if (!this.props.user.followedProducts) {
            this.props.getFollowedProducts();
        }
    }
    notify = () => {
        toast.success("Successfully added company !", {
            autoClose: 3000,
        });
    }
    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => this.setState({ modalOpen: false })

    OpenUpdateProduct = () => {
        this.setState({
            modalProductOpen: true,
            updateProductName: this.props.info.Item.name,
            updateProductDescription: this.props.info.Item.description
        });
    }

    handleFollow(id, name) {
        console.log(id);
        this.props.followProduct(id, name, () => {
            window.location.reload();
        });
    }
    handleUnfollow(id, name) {
        console.log(id);
        this.props.unfollowProduct(id, name, () => {
            window.location.reload();
        });
    }
    renderFollow() {
        if (this.props.user && this.props.user.followedProducts) {
            for (let i = 0; i < this.props.user.followedProducts.Items.length; i++) {
                if (this.props.user.followedProducts.Items[i].product_id === this.props.info.Item.id) {
                    return (
                        <Popup
                            trigger={
                                <Button onClick={this.handleUnfollow.bind(this, this.props.info.Item.id, this.props.info.Item.name)} className=" follow-btn background-light-blue" primary size={'mini'} animated>
                                    <Button.Content visible>Following</Button.Content>
                                    <Button.Content hidden>
                                        <Icon name='plus' />
                                    </Button.Content>
                                </Button>
                            }
                            inverted
                            content='Follow Product'
                            position='top center'
                        />
                    )
                }
            }
            return (
                <Button onClick={this.handleFollow.bind(this, this.props.info.Item.id, this.props.info.Item.name)} className=" follow-btn background-light-blue" primary size={'mini'} animated>
                    <Button.Content visible>Follow</Button.Content>
                    <Button.Content hidden>
                        <Icon name='plus' />
                    </Button.Content>
                </Button>
            )
        }
    }

    addCompany() {
        this.setState({
            addRawButtonLoading: true
        })
        // console.log(this.refs.name.value);
        // console.log(this.refs.url.value);
        // console.log(this.refs.desc.value);
        // console.log(this.refs.address.value);
        // console.log(this.refs.country.value);
        let data = {
            name: this.refs.name.value,
            address: this.refs.address.value,
            url: this.refs.url.value,
            desc: this.refs.desc.value,
            country: this.refs.country.value
        }
        axios.post(`${BASE_URL}/api/v1/company`, data, { withCredentials: true })
        let that = this;
        setTimeout(function () {
            that.setState({
                addRawButtonLoading: false,
                modalOpen: false
            })
            that.notify();
        }, 3000);

    }

    updateProduct() {
        this.setState({
            addRawButtonLoading: true
        })
        let data = {
            name: this.state.updateProductName,
            description: this.state.updateProductDescription
        }
        axios.put(`${BASE_URL}/api/v1/product/${this.props.info.Item.id}`, data, { withCredentials: true }).then(response => {
            if (response.status == 200) {
                toast.success("Product updated!", {
                    autoClose: 3000,
                });
                this.setState({ addRawButtonLoading: false, modalProductOpen: false });
                this.props.reload();
            } else {
                toast.error("Failed to update product", {
                    autoClose: 3000,
                });
            }
        }).catch(err => {
            toast.error("Failed to update product", {
                autoClose: 3000,
            });
        });
    }

    render() {
        return (
            <Grid padded>
                <Grid.Row className="extra-padding-sides">
                    <Grid padded className="full-width">
                        <Grid.Column width={13}>
                            <span className="color-light-green product-name">{this.props.info.Item && this.props.info.Item.name} {/*({this.props.info.Item && this.props.info.Item.followers} Connection)*/}</span>
                            {this.renderFollow()}
                        </Grid.Column>
                        <Grid.Column floated='right' width={3} textAlign="right">
                            <Dropdown trigger={<Icon size='large' name={'ellipsis horizontal'} />}>
                                <Dropdown.Menu direction='right' style={{ borderRadius: "10px" }}>

                                    <Modal open={this.state.modalOpen} onClose={this.handleClose} size={'large'} trigger={<Dropdown.Item onClick={this.handleOpen} className="dropDownThreeDots" text='Create Company' />}>
                                        <Modal.Header>Create Company</Modal.Header>
                                        <Modal.Content>
                                            <Modal.Description>
                                                <Form>
                                                    <Form.Field>
                                                        <label>Name</label>
                                                        <input placeholder='Name' ref="name" />
                                                    </Form.Field>
                                                    <Form.Field>
                                                        <label>Address</label>
                                                        <input placeholder='address' ref="address" />
                                                    </Form.Field>
                                                    <Form.Field>
                                                        <label>Url</label>
                                                        <input placeholder='url' ref="url" />
                                                    </Form.Field>
                                                    <Form.Field>
                                                        <label>Country</label>
                                                        <input placeholder='country' ref="country" />
                                                    </Form.Field>
                                                    <Form.Field>
                                                        <label>Description</label>
                                                        <input placeholder='description' ref="desc" />
                                                    </Form.Field>
                                                </Form>

                                                <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                                                    <Button loading={this.state.addRawButtonLoading} primary animated className="background-light-blue" onClick={this.addCompany.bind(this)}  >
                                                        <Button.Content visible>Submit</Button.Content>
                                                        <Button.Content hidden>
                                                            <Icon name='right arrow' />
                                                        </Button.Content>
                                                    </Button>
                                                    <Button animated color='red' onClick={this.handleClose} >
                                                        <Button.Content visible>Cancel</Button.Content>
                                                        <Button.Content hidden>
                                                            <Icon name='delete' />
                                                        </Button.Content>
                                                    </Button>
                                                </div>

                                            </Modal.Description>
                                        </Modal.Content>
                                    </Modal>
                                    <Modal open={this.state.modalProductOpen} onClose={this.handleProductClose} size={'large'} trigger={<Dropdown.Item className="dropDownThreeDots" text='Edit Product' onClick={this.OpenUpdateProduct} />}>
                                        <Modal.Header>Edit Product</Modal.Header>
                                        <Modal.Content>
                                            <Modal.Description>
                                                <Form>
                                                    <Form.Field>
                                                        <label>Name</label>
                                                        <input value={this.state.updateProductName} onChange={e => this.setState({ updateProductName: e.target.value })} />
                                                    </Form.Field>
                                                    <Form.Field>
                                                        <label>Description</label>
                                                        <input value={this.state.updateProductDescription} onChange={e => this.setState({ updateProductDescription: e.target.value })} />
                                                    </Form.Field>
                                                </Form>

                                                <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                                                    <Button loading={this.state.addRawButtonLoading} primary animated className="background-light-blue" onClick={this.updateProduct.bind(this)}  >
                                                        <Button.Content visible>Submit</Button.Content>
                                                        <Button.Content hidden>
                                                            <Icon name='right arrow' />
                                                        </Button.Content>
                                                    </Button>
                                                    <Button animated color='red' onClick={() => { this.setState({ modalProductOpen: false }) }} >
                                                        <Button.Content visible>Cancel</Button.Content>
                                                        <Button.Content hidden>
                                                            <Icon name='delete' />
                                                        </Button.Content>
                                                    </Button>
                                                </div>

                                            </Modal.Description>
                                        </Modal.Content>
                                    </Modal>
                                    {/* <Divider /> */}
                                    {/* <Dropdown.Item style={{ marginTop: "5px", marginBottom: "5px" }} className="dropDownThreeDots" text='Report Abuse' /> */}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Grid.Column>
                    </Grid>
                </Grid.Row>
            </Grid>

        )
    }

}

function mapStateToProps({ user }) {
    return { user };
}
export default connect(mapStateToProps, actions)(Info)