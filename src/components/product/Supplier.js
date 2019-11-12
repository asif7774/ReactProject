import React, { Component } from 'react';
import * as actions from '../../actions'
import { connect } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../../config/config'

class Supplier extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productName: null,
            userName: null
        }
    }

    componentDidMount() {
        axios.get(`${BASE_URL}/api/v1/user/${this.props.user_id}`, { withCredentials: true })
            .then(res =>{
                // console.log(res.data.Item.name);
                this.setState({
                    userName: res.data.Item.name
                })
            })
            .catch(err =>{
                console.log(err);
            })
    }

    render() {
        // console.log(this.props);
        return (
            <div>
                <div>User :- {this.state.userName} </div>
                <div>Type:- {this.props.type}</div>
            </div>
        );
    }
}


export default connect(null, actions)(Supplier);
