import React, { Component } from 'react';
import { connect } from 'react-redux';
import {BASE_URL} from '../../config/config'
// import * as actions from '../../actions/'

class RightSidebar extends Component {


    render() {
        return (
            <div className="right-sidebar">
                <div className="slimscrollright">
                    <div className="rpanel-title">
                        <div className="right-side-bar-logo">
                            <img src="images/right-sidebar-logo.png" alt="Mappes" width="120" />
                        </div>
                        <span><i className="ti-close right-side-toggle"></i></span>
                    </div>
                    <div className="r-panel-body">
                        <div className="m-t-20 m-b-30">
                            <h2 className="l-h-1">Signup to the fastest growing product centric platform of the world</h2>
                        </div>
                        <div className="m-t-20">
                            <div className="row">
                                <div className="col-md-12">
                                    <h4>Login using Email ID or <a className="a linkedin" href={`${BASE_URL}/auth/linkedin`}> <i className="fa fa-linkedin-square"></i></a></h4>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-xs-12">
                                    <form className="dark-form">
                                        <div className="form-group">
                                            <div className="input-group">
                                                <input type="text" className="form-control" id="exampleInputuname" placeholder="Username" /> </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="input-group">
                                                <input type="password" className="form-control" id="exampleInputpwd1" placeholder="Enter email" /> </div>
                                        </div>

                                        <div className="form-group">
                                            <div className="checkbox checkbox-success">
                                                <input id="checkbox1" type="checkbox" />
                                                <label htmlFor="checkbox1"> Remember me </label>
                                            </div>
                                            <button className="a text-smaller m-l-10">Forgot Password?</button>
                                        </div>

                                        <button type="submit" className="btn btn-success waves-effect waves-light m-r-10 t600 btn-rounded btn-sm">Login</button>
                                        <button type="submit" className="btn btn-info waves-effect waves-light t600 btn-rounded btn-sm pull-right">Signup</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

function mapStateToProps({auth}){
    return {auth};
}
export default connect(mapStateToProps, {})(RightSidebar);