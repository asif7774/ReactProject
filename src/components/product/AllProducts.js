import React, { Component } from 'react';
import * as actions from '../../actions/'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class AllProducts extends Component {

    constructor(){
        super()
        this.state = {
            rawInput : ""
        }
    }

    componentDidMount() {
        this.props.getAllProducts();
    }

    handleDelete(id){
        this.props.deleteProduct(id,()=>{
            this.props.getAllProducts();
        });
    }
    handleFollow(id,name){
        console.log(id);
        this.props.followProduct(id,name,()=>{
            this.props.getAllProducts();
        });
    }
    update(e){
        // console.log("firing");
        // console.log(e.target.value);
        this.setState({
            rawInput : e.target.value
        })
    }
    handleStreamAddition(type, parentProductId,childProductId){
        console.log("type", type);
        console.log("Parent Product", parentProductId)
        // let child = this.refs[childProductId];
        // let child = this.textInput;
        console.log("Child Product", this.state.rawInput);
        this.props.addStream(type,parentProductId,this.state.rawInput);
    }

    handleAddSupplier(type,id){
        this.props.addSupplier(id,type);
    }

    renderProducts() {
        return this.props.product.Items.map((product, index) => {
            return (
                <div key={index}>
                    <span>{product.name}</span>
                    <button><Link to={`/product/${product.id}`}>View</Link></button>
                    <button>Update</button>
                    <button onClick={this.handleFollow.bind(this,product.id,product.name)}>Follow</button>
                    <button onClick={this.handleDelete.bind(this,product.id)}>Delete</button>
                    <input type="text" onChange={this.update.bind(this)} placeholder="enter raw material"></input>
                    <button onClick={this.handleStreamAddition.bind(this,"ADD_RAW",product.id,"rawInput")}>Add Raw Material </button>
                    <input type="text"  onChange={this.update.bind(this)} placeholder="enter application product"></input>
                    <button onClick={this.handleStreamAddition.bind(this,"ADD_APPLICATION",product.id,"rawInput")}>Add Application </button>

                    <button onClick={this.handleAddSupplier.bind(this,"DISTRIBUTOR",product.id)}>Add Distributor </button>
                    <button onClick={this.handleAddSupplier.bind(this,"MANUFACTURER",product.id)}>Add Manufacturer </button>
                    <br />
                    <br />
                </div>
            )
        })
    }

    render() {
        return (
            <div>
                {this.props.product.Items  && this.renderProducts()}
            </div>
        );
    }
}

function mapStateToProps({ product }) {
    return { product };
}

export default connect(mapStateToProps, actions)(AllProducts);
