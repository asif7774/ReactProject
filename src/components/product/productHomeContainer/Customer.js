import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Table, Grid, Header, Divider } from 'semantic-ui-react'
import SupplierCountry from './SupplierCountry'

// import axios from 'axios'
// import { toast, ToastContainer } from 'react-toastify';
// import ProductSupplierCount from './ProductSupplierCount'
// import { BASE_URL } from '../../../config/config'
// import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import * as actions from '../../../actions/'
// const resultRenderer = (result) => <Label key={result._source.id} content={result._source.name} />

class Customer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            resultsRendered: 4,
            showLoadMore: true
        }

    }

    renderCustomer() {
        return this.props.customer.potentialCustomer.map((customer, index) => {
            if (index <= this.state.resultsRendered) {
                return (
                    <Table.Row key={index}>
                        <Table.Cell><Link to={`/company/${customer.company_id}`}>{customer.company_name}</Link></Table.Cell>
                        <Table.Cell><SupplierCountry compId={customer.company_id} /></Table.Cell>
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

    handleMoreClick() {
        if (this.props.auth) {
            this.setState({
                resultsRendered: this.state.resultsRendered + 5,
                showLoadMore: (this.state.resultsRendered + 5 >= this.props.customer.potentialCustomer.length) ? false : true
            })
        } else {
            this.props.showLoginModal();
        }
    }




    render() {
        // const { isLoading, value, results } = this.state
        return (
            <Grid id="customer" padded>
                <Grid.Row className="background-white extra-padding-sides">
                    <Grid.Column width={16}>
                        {/* <ToastContainer /> */}
                    </Grid.Column>
                    <Grid.Column width={16}>
                        <Grid>
                            <Grid.Column floated='left' width={13}>
                                <Header className="table-heading pD-b-10">Potential Customers</Header>
                            </Grid.Column>
                            <Grid.Column textAlign='right' floated='right' width={3}>

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
                                    <Table.HeaderCell className="color-light-blue" >Company Name</Table.HeaderCell>
                                    <Table.HeaderCell className="color-light-blue">Country</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {this.props.customer && this.renderCustomer()}
                            </Table.Body>
                        </Table>
                        {this.props.customer && this.props.customer.potentialCustomer.length > this.state.resultsRendered &&
                            <span style={{ "cursor": "pointer" }} className="color-light-blue" onClick={this.handleMoreClick.bind(this)} >Load More</span>
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        )
    }

}
function mapStateToProps({ auth }) {
    return { auth };
}
export default connect(mapStateToProps, actions)(Customer);
