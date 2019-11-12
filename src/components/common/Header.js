import React, { Component } from 'react'
import {BASE_URL} from '../../config/config';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
// import RaisedButton from 'material-ui/RaisedButton';

class Header extends Component{

    renderHeader(){

        if(this.props.auth === null){
            return (
                <div>Loading</div>
            )
        }else if(!this.props.auth){
            return (
                <a href={`${BASE_URL}/auth/linkedin`} label="Defaukt" >
                Login
            </a>
            )
        }else{
            return (
                <a href={`${BASE_URL}/auth/logout`} label="Defaukt" >
                Logout
            </a>
            )
        }
    }

    render(){
        return (
            <div>
                Mappes
                <Link to={"/products"} >Product</Link>
                <Link to={"/add/product"}> Add Product</Link>
                {this.renderHeader()}
            </div>
        )
    }

}

function mapStateToProps({auth}){
    return {auth}
}

export default connect(mapStateToProps, {})(Header);