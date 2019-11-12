import React, { Component } from 'react';
import axios from 'axios'
import { BASE_URL } from '../../../config/config'


export default class SupplierCountry extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: ""
        }

    }

    renderCountry(compId) {
        axios.get(`${BASE_URL}/api/v1/company/${compId}`, { withCredentials: true })
            .then(res => {
                // console.log(res.data.Item.country);
                this.setState({
                    name: res.data.Item.country
                })
            })
    }

    componentWillMount() {
        // console.log("WILL MOUNT IS CALLED");
        this.renderCountry(this.props.compId)


    }
    componentWillReceiveProps(nextProps){
        // console.log("UPDATING COMPONENT", nextProps);
        if(nextProps.compId !== this.props.compId){
            // console.log("RENDER IS CALLED", nextProps);
            this.renderCountry(nextProps.compId);
        }
    }
    

    render() {

        return (
            <span style={{ color: "#797979" }}>{this.state.name}</span>
        )
    }

}
