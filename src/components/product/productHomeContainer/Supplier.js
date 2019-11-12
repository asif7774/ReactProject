import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Dropdown, Modal, Button, Label, List, Search, Icon, Grid, Header, Divider } from 'semantic-ui-react'
import axios from 'axios'
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../config/config'
import SupplierCountry from './SupplierCountry'
// import { Field, reduxForm } from 'redux-form';
// import { connect } from 'react-redux';
// import * as actions from '../../../actions/'

const resultRenderer = (result) => <Label key={result._source.id} content={result._source.name} />


export default class Supplier extends Component {

    constructor(props) {
        super(props);
        this.state = {
            raws: [],
            modalOpen: false,
            addRawButtonLoading: false,
            resultsRendered: 4,
            showLoadMore: true,
            condition: false
        }

    }
    notify = () => {
        toast.success("Successfully added suppliers !", {
            autoClose: 3000,
        });
    }
    componentWillMount() {
        this.resetComponent();
    }
    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => this.setState({ modalOpen: false })

    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

    handleResultSelect = (e, { result }) => {
        this.setState({ value: result._source.name })
        let newRaw = this.state.raws
        newRaw.push({
            id: result._source.id,
            name: result._source.name
        })
        this.setState({
            raws: newRaw,
            value: ""
        })
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ value })
        this.setState({ isLoading: true })
        axios.get(`${BASE_URL}/api/v1/company/search/${value}`, { withCredentials: true })
            .then(response => {
                console.log(response.data);
                this.setState({
                    isLoading: false,
                    results: response.data
                })
            })

    }

    addRawMaterials() {
        this.setState({
            addRawButtonLoading: true
        })
        for (let i = 0; i < this.state.raws.length; i++) {
            let data = {
                company_id: this.state.raws[i].id,
                company_name: this.state.raws[i].name,
                product_id: this.props.info.Item.id,
                product_name: this.props.info.Item.name
            }
            axios.post(`${BASE_URL}/api/v1/product/supplier`, data, { withCredentials: true })
        }
        let that = this;
        setTimeout(function () {
            that.setState({
                addRawButtonLoading: false,
                raws: [],
                modalOpen: false
            })
            that.notify();
            window.location.reload();
        }, 3000);

    }
    removeItem(id) {

        this.setState({
            raws: this.state.raws.filter(e => e.id !== id)
        })
    }
    renderRawMaterials() {
        return this.state.raws.map((raw, index) => {
            return (
                <List.Item key={raw.id}>
                    <List.Content floated='right'>
                        <Button icon onClick={this.removeItem.bind(this, raw.id)} color={'red'}>

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
    handleMoreClick() {
        this.setState({
            resultsRendered: this.state.resultsRendered + 5,
            showLoadMore : (this.state.resultsRendered+5 >= this.props.supplier.length) ? false : true
        })
    }
    handleClick() {
        this.setState({
            condition: !this.state.condition
        });
    }
    renderSupplier() {
        return this.props.supplier.map((supplier, index) => {
            if (index <= this.state.resultsRendered) {
                return (
                    <Table.Row key={index}>
                        {/* <Table.Cell className="toggle-cell-icon">
                            <Button basic color='blue' size='mini' icon onClick={ this.handleClick.bind(this) } className= { this.state.condition ? "active" : "" }>
                                <i className="mappes-icon icon-plus"></i>
                            </Button>
                        </Table.Cell> */}
                        <Table.Cell><Link to={`/company/${supplier.company_id}`}>{supplier.company_name}</Link></Table.Cell>
                        <Table.Cell><SupplierCountry compId={supplier.company_id} /></Table.Cell>
                        <Table.Cell textAlign="center" style={{ color: "#797979" }}>{supplier.contacts}</Table.Cell>
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
        })
    }
    

    render() {
        const { isLoading, value, results } = this.state
        console.log(this.props.supplier);
        return (
            <Grid id="abc" padded>
                <Grid.Row className="background-white extra-padding-sides">
                    <Grid.Column width={16}>
                        <Grid>
                            <Grid.Column floated='left' width={13}>
                                <Header as={'h4'} className="table-heading pD-b-10" >Suppliers</Header>
                            </Grid.Column>
                            <Grid.Column  textAlign='right' floated='right' width={3}>
                                {this.props.auth &&
                                    <Dropdown className="padding-top-15" trigger={<Icon className="color-light-blue" size='large' name={'ellipsis horizontal'} />}>
                                        <Dropdown.Menu direction='right' style={{ borderRadius: "10px" }}>
                                        <Modal open={this.state.modalOpen} onClose={this.handleClose} size={'large'} trigger={<Dropdown.Item onClick={this.handleOpen} className="dropDownThreeDots" text='Add Suppliers' />}>
                                        <Modal.Header>Add Suppliers to the product</Modal.Header>
                                            <Modal.Content>
                                                <Modal.Description>
                                                    <Grid>
                                                        <Grid.Column width={4}>
                                                        </Grid.Column>
                                                        <Grid.Column width={8}>

                                                            <Search
                                                                fluid
                                                                loading={isLoading}
                                                                onResultSelect={this.handleResultSelect}
                                                                onSearchChange={this.handleSearchChange}
                                                                results={results}
                                                                value={value}
                                                                resultRenderer={resultRenderer}

                                                            />
                                                            <List style={{ paddingTop: '20px' }} animated divided verticalAlign='middle'>
                                                                {this.renderRawMaterials()}
                                                            </List>
                                                        </Grid.Column>
                                                        <Grid.Column width={4}>
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
                                        {/* <Dropdown.Item className="dropDownThreeDots" text='Remove Suppliers' /> */}
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
                                    <Table.HeaderCell className="color-light-blue">Company Name</Table.HeaderCell>
                                    <Table.HeaderCell className="color-light-blue">Country</Table.HeaderCell>
                                    <Table.HeaderCell className="color-light-blue" textAlign="center">Listed Contacts</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {this.props.supplier && this.renderSupplier()}
                            </Table.Body>
                        </Table>
                        {this.props.supplier && this.props.supplier.length > this.state.resultsRendered &&
                        <span className="color-light-blue cursor-pointer" onClick={this.handleMoreClick.bind(this)} >Load More</span>
                        }
                    </Grid.Column>                  
                </Grid.Row>
            </Grid>
        )
    }

}
