import React from 'react';
import { BASE_URL } from '../../../config/config'
import axios from 'axios'

import { Dropdown, Button } from 'semantic-ui-react'

const options = [
    {
        key: 'private',
        text: 'private',
        value: 'private',
        content: 'private',
        icon: 'eye',
        description: 'Only you and tagged people can see and edit this post',
        //image: { avatar: true, src: 'https://media.licdn.com/dms/image/C4E04AQEQq64wR22osA/profile-originalphoto-shrink_900_1200/0?e=1555545600&v=beta&t=Ws7oEupND8eR70OlidSPeGzoR72yRpY329PR4_2NY0A' },
    },
    {
        key: 'public',
        text: 'public',
        value: 'public',
        content: 'public',
        icon: 'users',
        description: 'Anyone in your network can see this post',
        //image: { avatar: true, src: 'https://media.licdn.com/dms/image/C4E04AQEQq64wR22osA/profile-originalphoto-shrink_900_1200/0?e=1555545600&v=beta&t=Ws7oEupND8eR70OlidSPeGzoR72yRpY329PR4_2NY0A' },
    },
]

// const options1 = [
//     { key: 1, text: 'One', value: 1, image: { avatar: true, src: 'https://media.licdn.com/dms/image/C4E04AQEQq64wR22osA/profile-originalphoto-shrink_900_1200/0?e=1555545600&v=beta&t=Ws7oEupND8eR70OlidSPeGzoR72yRpY329PR4_2NY0A' } },
//     { key: 2, text: 'Two', value: 2, image: { avatar: true, src: 'https://media.licdn.com/dms/image/C4E04AQEQq64wR22osA/profile-originalphoto-shrink_900_1200/0?e=1555545600&v=beta&t=Ws7oEupND8eR70OlidSPeGzoR72yRpY329PR4_2NY0A' } },
//     { key: 3, text: 'Three', value: 3, image: { avatar: true, src: 'https://media.licdn.com/dms/image/C4E04AQEQq64wR22osA/profile-originalphoto-shrink_900_1200/0?e=1555545600&v=beta&t=Ws7oEupND8eR70OlidSPeGzoR72yRpY329PR4_2NY0A' } },
// ]

class PrivacyToolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tagginPopup: false,
            taggedUsers: [],
            taggedProducts: [],
            selectedProducts: [],
            privacy: "public"
        }
        // this.tagUser = this.tagUser.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.postStatus !== this.props.postStatus && newProps.postStatus === "created") {
            this.setState({ taggedProducts: [], selectedProducts: [] })
        }
    }

    // toggleTagginPopup = () => this.setState({ tagginPopup: !this.state.tagginPopup })
    // tagginPopupFalse = () => this.setState({ tagginPopup: false })

    // renderLabel = label => ({
    //     content: `${label.text}`,
    //     // image: `${label.image.src}`
    // })

    // tagUser(event, { value }) {
    //     this.setState({ taggedUsers: value })
    //     this.props.assemblePost("taggedUser", value);
    // }
    //handleResultSelect = (e, { result }) => {
    // console.log(result);
    // let taggedProducts = this.state.taggedProducts;
    // taggedProducts.push(result._source.name);
    // this.setState({ taggedProducts });
    // }

    handleProductSearchChange = (e) => {
        let value = e.target.value;
        if (value.length > 2) {
            this.setState({ productSearchLoading: true })
            axios.get(`${BASE_URL}/api/v1/product/search/${value}`, { withCredentials: true })
                .then(response => {
                    this.setState({
                        isLoading: false,
                        results: response.data,
                    })
                    if (response.data.length > 0) {
                        let values = response.data.map(item => {
                            return { key: item._id, text: item._source.name, value: item._source.id }
                        });
                        let { taggedProducts, selectedProducts } = this.state;
                        let filteredItems = taggedProducts.filter(item => { return selectedProducts.includes(item.value) });
                        taggedProducts = values.concat(filteredItems);
                        this.setState({ taggedProducts })
                    }
                })
        }
    }

    handleProductSelection = (e, { searchQuery, value }) => {
        this.setState({ selectedProducts: value })
        this.props.assemblePost("taggedProduct", value);
    }

    handlePrivacyChange=(e,{value})=>{
        this.setState({ privacy: value })
        this.props.assemblePost("visibility", value);
    }
    render() {
        return (
            <div className="privacy-toolbar" >
                <div className="privacy-option">
                    <Dropdown inline options={options} value={this.state.privacy} onChange={this.handlePrivacyChange} />
                </div>
                <div className="taggin-option">
                    {/* <div className="tag-people"> */}
                    {/* <div className="tag-btn">
                            <Popup
                                basic
                                trigger={<Button onClick={this.toggleTagginPopup} primary size='mini' className="btn-sm">Tag People</Button>}
                                flowing
                                hoverable
                                className="tagging-popup-wrapper"
                                open={this.tagginPopup}
                                hideOnScroll={false}
                                position='top right'
                            >
                                <div className="tagging-popup">
                                    <div className="head-point">
                                        <span>Invite to this post</span>
                                        <a onClick={this.toggleTagginPopup}><i className="icon-close"></i></a>
                                    </div>
                                    <Search
                                        fluid
                                        placeholder="Search here..."
                                        className="searchWithScroll dark-input landingSearchBar"
                                        loading={this.state.isLoading}
                                        onResultSelect={this.handleResultSelect}
                                        onSearchChange={this.handleSearchChange}
                                        results={this.state.results}
                                        value={this.state.value}
                                        resultRenderer={this.resultRenderer}
                                    />

                                    <Dropdown
                                        multiple
                                        selection
                                        fluid
                                        options={options1}
                                        placeholder='Choose an option'
                                        renderLabel={this.renderLabel}
                                        onChange={this.tagUser}
                                    />
                                    <TextArea rows={5} placeholder='Type here...' />
                                    <Button onClick={this.onClick} primary >Send Invitation</Button>
                                </div>
                            </Popup>
                        </div>
                        <div className="tagged-value">
                            {
                                this.state.taggedUsers.map(user =>
                                    <Label image>
                                        <img src='https://react.semantic-ui.com/images/avatar/small/ade.jpg' alt="" />
                                        <span>Adrienne</span>
                                        <Icon name='delete' />
                                    </Label>
                                    /* <Label image>
                                        <img src='https://react.semantic-ui.com/images/avatar/small/zoe.jpg' alt="" />
                                        <span>Zoe</span>
                                        <Icon name='delete' />
                                    </Label>
                                    <Label image>
                                        <img src='https://react.semantic-ui.com/images/avatar/small/nan.jpg' alt="" />
                                        <span>Anna</span>
                                        <Icon name='delete' />
                                    </Label>
                                    <Label image>
                                        <img src='https://react.semantic-ui.com/images/avatar/small/ade.jpg' alt="" />
                                        <span>Adrienne</span>
                                        <Icon name='delete' />
                                    </Label> 
                                // )
                            // }
                        </div> */}

                    {/* </div> */}
                    {/* <div className="border-b"></div> */}
                    <div className="tag-product">
                        <div className="tag-btn">
                            <Button primary size='mini' className="btn-sm">Tag Product</Button>
                        </div>
                        <Dropdown
                            multiple
                            search
                            selection
                            fluid
                            onSearchChange={this.handleProductSearchChange}
                            // onResultSelect={this.handleResultSelect}
                            options={this.state.taggedProducts}
                            placeholder='Search for products here....'
                            // loading={this.state.productSearchLoading}
                            compact={true}
                            className="inline-table"
                            value={this.state.selectedProducts}
                            onChange={this.handleProductSelection}
                            searchQuery={this.state.searchQuery}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default PrivacyToolbar;