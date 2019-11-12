import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { BASE_URL } from '../../config/config'
// import * as actions from '../../actions/'

class RightSidebarAuth extends Component {


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
                            <h2 className="l-h-1">
                                Welcome <br />
                                <span>Chandan Wadhwa</span>
                            </h2>
                            <button className="btn btn-rounded right-sidebar-logout-button">Logout</button>
                        </div>
                        <div className="m-t-20">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="user-stats-right-boxes">
                                        <div className="user-stat-right-box">
                                            <div className="stat-icon">
                                                <img src="images/icons/icon-box.png" alt="Mappes" />
                                            </div>
                                            <div className="stat-detail-big">64</div>
                                            <div className="stat-title">Listed Products</div>
                                        </div>
                                        <div className="user-stat-right-box">
                                            <div className="stat-icon">
                                                <img src="images/icons/icon-thumbs-up.png" alt="Mappes" />
                                            </div>
                                            <div className="stat-detail-big">24</div>
                                            <div className="stat-title">Connections in Network</div>
                                        </div>
                                        <div className="user-stat-right-box">
                                            <div className="stat-icon">
                                                <img src="images/icons/icon-globe.png" alt="Mappes" />
                                            </div>
                                            <div className="stat-detail-big">18</div>
                                            <div className="stat-title">Connected products</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

function mapStateToProps({ auth }) {
    return { auth };
}
export default connect(mapStateToProps, {})(RightSidebarAuth);