import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Table, Search, Label, List, Button, Dropdown, Icon, Grid, Header, Divider, Modal, Input } from 'semantic-ui-react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify';
import { BASE_URL } from '../../../config/config'
// import { connect } from 'react-redux';
// import * as actions from '../../../actions/'
import ProductSupplierCount from './ProductSupplierCount'

const resultRenderer = (result) => <Label key={result._source.id} content={result._source.name} />

export default class RawMaterial extends Component {

    constructor(props) {
        super(props);
        this.state = {
            raws: [],
            newProducts: [],
            modalOpen: false,
            addRawButtonLoading: false,
            resultsRendered: 4,
            showLoadMore: true,
            condition: false,
            description: ""
        }

    }
    notify = () => {
        toast.success("Successfully added raw materials !", {
            autoClose: 3000,
        });
    }
    handleMoreClick() {
        this.setState({
            resultsRendered: this.state.resultsRendered + 5,
            showLoadMore: (this.state.resultsRendered + 5 >= this.props.raw.Items.length) ? false : true
        })
    }
    componentWillMount() {
        this.resetComponent();
    }
    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => this.setState({ modalOpen: false })

    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

    handleResultSelect = (e, { result }) => {
        let newRaw = this.state.raws
        newRaw.push({
            id: result._source.id,
            name: result._source.name
        })
        this.setState({
            raws: newRaw,
            value: "",
            description: ""
        })
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ value })
        if (value.length > 4) {
            this.setState({ isLoading: true })
            axios.get(`${BASE_URL}/api/v1/product/search/${value}`, { withCredentials: true })
                .then(response => {
                    console.log(response.data);
                    this.setState({
                        isLoading: false,
                        results: response.data
                    })
                })
        }

    }

    addRawMaterials() {
        this.setState({
            addRawButtonLoading: true
        })
        Promise
            .all(this.state.newProducts.map(newProduct => axios.post(`${BASE_URL}/api/v1/product/id`,
                { name: newProduct.name, desc: newProduct.description },
                { withCredentials: true })))
            .then(responses => {
                console.log("product created", responses)
                let raws = this.state.raws.concat(responses.map(response => response.data))
                return Promise.all(raws.map(raw => {
                    let data = {
                        raw_id: raw.id,
                        raw: raw.name,
                        application_id: this.props.info.Item.id,
                        application: this.props.info.Item.name
                    }
                    return axios.post(`${BASE_URL}/api/v1/product/rawMaterial`, data, { withCredentials: true })
                }))
            })
            .then(() => {
                this.setState({
                    addRawButtonLoading: false,
                    raws: [],
                    newProducts: [],
                    modalOpen: false
                })
                console.log("fetch product data again")
                this.props.getData(this.props.info.Item.id)
            })
            .catch(err => {
                console.log("failed to add raw materials:", err);
                this.setState({ err: err, modalOpen: false });
                this.props.getData(this.props.info.Item.id)
            });
    }
    removeItem(id, name) {
        if (id) {
            this.setState({
                raws: this.state.raws.filter(e => e.id !== id)
            })
        }
        else {
            this.setState({
                newProducts: this.state.newProducts.filter(e => e.name !== name)
            })
        }
    }
    renderRawMaterials() {
        let endMaterials = this.state.raws.concat(this.state.newProducts);
        return endMaterials.map((raw, index) => {
            return (
                <List.Item key={index}>
                    <List.Content floated='right'>
                        <Button icon onClick={this.removeItem.bind(this, raw.id, raw.name)} color={'red'}>
                            <Icon name='delete' />
                        </Button>
                    </List.Content>
                    <List.Content style={{ fontSize: '19px', color: '#979499' }}>
                        {raw.name}
                    </List.Content>
                </List.Item>
            )
        })
    }
    handleClick() {
        this.setState({
            condition: !this.state.condition
        });
    }
    renderRawMaterial() {
        return this.props.raw.Items.map((raw, index) => {
            if (index <= this.state.resultsRendered) {
                return (
                    <Table.Row key={index}>
                        {/* <Table.Cell className="toggle-cell-icon"><i onClick={ this.handleClick.bind(this) }  */}
                        {/* className= { this.state.condition ? "mappes-icon icon-star toggle-star" : "mappes-icon icon-star-o toggle-star" }></i></Table.Cell> */}
                        <Table.Cell><Link to={`/product/${raw.rawMaterial}`}>{raw.rawMaterial_title}</Link></Table.Cell>
                        <Table.Cell textAlign="center"><ProductSupplierCount id={raw.rawMaterial} /></Table.Cell>
                    </Table.Row>
                )
            } else {
                return (
                    <Table.Row key={index} style={{ display: "none" }}>
                        <Table.Cell></Table.Cell>
                        <Table.Cell></Table.Cell>
                    </Table.Row>
                )
            }
        });
    }

    handleAddProduct = e => {
        let products = this.state.newProducts;
        products.push({ name: this.state.value, description: this.state.description });
        this.setState({
            newProducts: products,
            value: "",
            description: ""
        });
    }

    render() {
        const { isLoading, value, results, description } = this.state

        return (
            <Grid id="raw_materials" padded>
                <Grid.Row className="background-white extra-padding-sides">
                    <Grid.Column width={16}>
                        <ToastContainer />
                    </Grid.Column>
                    <Grid.Column width={16}>
                        <Grid>
                            <Grid.Column floated='left' width={13}>
                                <Header className="table-heading pD-b-10">Raw Materials & Equipment</Header>
                            </Grid.Column>
                            <Grid.Column textAlign='right' floated='right' width={3}>
                                {this.props.auth &&
                                    <Dropdown className="padding-top-15" trigger={<Icon className="color-light-blue" size='large' name={'ellipsis horizontal'} />}>
                                        <Dropdown.Menu direction='right' style={{ borderRadius: "10px" }}>
                                            <Modal open={this.state.modalOpen} onClose={this.handleClose} size={'large'} trigger={<Dropdown.Item onClick={this.handleOpen} className="dropDownThreeDots" text='Add Product' />}>
                                                <Modal.Header>Add Raw Materials and/or equipments</Modal.Header>
                                                <Modal.Content>
                                                    <Modal.Description>
                                                        <Grid>
                                                            <Grid.Column width={2}>
                                                            </Grid.Column>
                                                            <Grid.Column width={12}>
                                                                <Grid>
                                                                    <Grid.Column width={7}>
                                                                        <Search
                                                                            fluid
                                                                            loading={isLoading}
                                                                            onResultSelect={this.handleResultSelect}
                                                                            onSearchChange={this.handleSearchChange}
                                                                            results={results}
                                                                            value={value}
                                                                            resultRenderer={resultRenderer}
                                                                        /></Grid.Column>
                                                                    <Grid.Column width={7}>
                                                                        <Input placeholder='Desription' fluid value={description} onChange={e => this.setState({ description: e.target.value })} />
                                                                    </Grid.Column>
                                                                    <Grid.Column width={2}>
                                                                        <Button icon primary onClick={this.handleAddProduct}>
                                                                            <Icon name="add" />
                                                                        </Button>
                                                                    </Grid.Column>
                                                                </Grid>
                                                                <List style={{ paddingTop: '20px' }} animated divided verticalAlign='middle'>
                                                                    {this.renderRawMaterials()}
                                                                </List>
                                                            </Grid.Column>
                                                            <Grid.Column width={2}>
                                                            </Grid.Column>
                                                        </Grid>

                                                        <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                                                            <Button loading={this.state.addRawButtonLoading} primary animated className="background-light-blue" onClick={this.addRawMaterials.bind(this)} >
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

                                                        {/* <button onClick={this.addRawMaterials.bind(this)}>Done</button> */}
                                                    </Modal.Description>
                                                </Modal.Content>
                                            </Modal>
                                            {/* <Dropdown.Item className="dropDownThreeDots" text='Remove Raw Material' /> */}
                                            {/* <Divider /> */}
                                            {/* <Dropdown.Item style={{ marginTop: "5px", marginBottom: "5px" }} className="dropDownThreeDots" text='Feedback' /> */}
                                        </Dropdown.Menu>
                                    </Dropdown>}
                            </Grid.Column>
                        </Grid>
                    </Grid.Column>
                    <Grid.Column width={16}>
                        <Divider className="tableDivider" />
                    </Grid.Column>
                    <Grid.Column width={16}>
                        <Table padded basic='very' striped unstackable>
                            <Table.Header>
                                <Table.Row>
                                    {/* <Table.HeaderCell className="toggle-cell-icon"></Table.HeaderCell> */}
                                    <Table.HeaderCell className="color-light-blue" >Product Name</Table.HeaderCell>
                                    <Table.HeaderCell className="color-light-blue" textAlign="center">Number of Suppliers</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.props.raw && this.renderRawMaterial()}
                            </Table.Body>
                        </Table>
                        {this.props.raw && this.props.raw.Items && this.props.raw.Items.length > this.state.resultsRendered &&
                            <span className="color-light-blue cursor-pointer" onClick={this.handleMoreClick.bind(this)} >Load More</span>
                        }
                        {/* <Button onClick={this.handleMoreClick.bind(this)} >More</Button> */}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

}
