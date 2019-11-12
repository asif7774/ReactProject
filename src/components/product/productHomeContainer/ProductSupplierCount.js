import React, { Component } from 'react';
import axios from 'axios'
import { BASE_URL } from '../../../config/config'


export default class ProductSupplierCount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            count: ''
        }

    }

    renderProductSupplier(id) {
        axios.get(`${BASE_URL}/api/v1/product/supplier/${id}`, { withCredentials: true })
            .then(res => {
                // console.log(res.data.Items.length);
                this.setState({
                    count: res.data.length
                })
            })
    }

    componentWillMount() {

        this.renderProductSupplier(this.props.id);

    }
    componentWillReceiveProps(nextProps){
        if(nextProps.id !== this.props.id){
            this.renderProductSupplier(nextProps.id);
        }
    }

    render() {

        return (
            <span style={{ color: "#797979" }}>{this.state.count}</span>
        )
    }

}
