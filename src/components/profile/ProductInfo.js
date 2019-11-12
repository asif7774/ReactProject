import React, { Component } from 'react';
import * as actions from '../../actions/';
import { connect } from 'react-redux';
import { Grid, Form, Button, Divider, Search, Label } from 'semantic-ui-react';
import axios from 'axios';
import { BASE_URL } from '../../config/config';
import './Profile.css'

const resultRenderer = (result) => <Label key={result._source.id} content={result._source.name} />

class ProductInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            products: [],
            newProducts: [],
            productsFollowed: [],
            company: "",

            productNameInput: "",
            productDescInput: "",
            productId: undefined,
            
            productSuggestionLoading: false,
            productSuggestionResults: []
        };
    }

    addNewProduct = (name, desc) => {
        const data = {
            name,
            desc
        };

        return axios.post(`${BASE_URL}/api/v1/product/id`, data, { withCredentials: true });
    }

    followProduct = (productId, productName) => {
        const data = {
            productId,
            productName
        };

        return axios.post(`${BASE_URL}/api/v1/product/follow`, data, { withCredentials: true });
    }

    unfollowProduct = (productId, productName) => {
        const data = {
            productId,
            productName
        };

        return axios.post(`${BASE_URL}/api/v1/product/unfollow`, data, { withCredentials: true });
    }

    createProductToSupplierMapping = (productId, productName, companyId, companyName) => {
        const data = {
            product_id: productId,
            product_name: productName,
            company_id: companyId,
            company_name: companyName
        };

        return axios.post(`${BASE_URL}/api/v1/product/supplier`, data, { withCredentials: true });
    }

    updateProductDescription = (id, name, description) => {
        const data = {
            name,
            description
        }

        return axios.put(`${BASE_URL}/api/v1/product/${id}`, data, { withCredentials: true });
    }

    saveFollowedProductsData = () => {
        const {
            products,
            productsFollowed,
            newProducts,
            company
        } = this.state;

        // Tasks to follow/unfollow the existsing products
        const handleExistingProductsTasks = products.map((product, index) => {
            const {
                id,
                name
            } = product;

            if (productsFollowed[index]) {    
                return this.followProduct(id, name);
            } else {
                return this.unfollowProduct(id, name);
            }
        });

        // Tasks to add new product, map to company and follow
        const handleNewProductsTasks = newProducts.map((product, index) => {
            const {
                id,
                name,
                description
            } = product;

            const {
                companyId,
                companyName
            } = company;

            const productExistsInDb = typeof id !== 'undefined';

            if (productExistsInDb) {
                return this.updateProductDescription(id, name, description)
                    .then(() => {
                        const followAndMapToSupplierTasks = [
                            this.followProduct(id, name),
                            this.createProductToSupplierMapping(id, name, companyId, companyName)
                        ];

                        return Promise.all(followAndMapToSupplierTasks);
                    })
                    .catch(err => {
                        console.log(err);
                        alert("Something went wrong. Please try again.");
                    });
            } else {
                return this.addNewProduct(name, description)
                    .then(({ data }) => {
                        const newProductId = data.id;
    
                        const followAndMapToSupplierTasks = [
                            this.followProduct(newProductId, name),
                            this.createProductToSupplierMapping(newProductId, name, companyId, companyName)
                        ];
    
                        return Promise.all(followAndMapToSupplierTasks);
                    })
                    .catch(err => {
                        console.log(err);
                        alert("Something went wrong. Please try again.");    
                    });
            }

        });

        return Promise.all(handleExistingProductsTasks.concat(handleNewProductsTasks))
            .then(res => {
                this.props.history.push('/product/SkW9l-VnJRsG');
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong. Please try again.");
            });
    }

    handleProductNameChange = (e, { value }) => {
        this.setState({
            productNameInput: value,
            productSuggestionLoading: true
        });

        axios.get(`${BASE_URL}/api/v1/product/search/${value}`, { withCredentials: true })
            .then(response => {
                // console.log(response.data);

                this.setState({
                    productSuggestionLoading: false,
                    productSuggestionResults: response.data
                });
            })
            .catch(err => {
                console.log(err);

                this.setState({
                    productSuggestionLoading: false,
                    productSuggestionResults: []
                });
            });
    }

    handleProductSuggestionSelect = (e, { result }) => {
        this.setState({
            productNameInput: result._source.name,
            productDescInput: result._source.description,
            productId: result._source.id,
            productSuggestionLoading: false
        });
    }

    handleProductDescChange = e => {
        this.setState({
            productDescInput: e.target.value
        });
    }

    handleProductAddClick = e => {
        const {
            productNameInput,
            productDescInput,
            productId
        } = this.state;

        if (productNameInput.length !== 0 && productDescInput && productDescInput.length !== 0) {
            this.setState(function (prevState, props) {
                let {
                    newProducts
                } = prevState;

                newProducts = newProducts.concat({
                    name: productNameInput,
                    description: productDescInput,
                    id: productId
                });

                return {
                    newProducts,
                    productNameInput: "",
                    productDescInput: "",
                    productId: undefined
                };
            }, () => console.log("Added new product"));
        } else {
            alert("Form field(s) must not be empty!");
        }
    }

    handleProductRemoveClick = (e, index) => {
        this.setState(function (prevState, props) {
            let {
                newProducts
            } = prevState;

            delete newProducts[index];

            return {
                newProducts
            };
        }, () => console.log("Removed product"));
    }

    handleProductClick = index => {
        this.setState(function (prevState, props) {
            const {
                productsFollowed
            } = prevState;

            productsFollowed[index] = !productsFollowed[index];

            return {
                productsFollowed
            };
        }, () => console.log("Clicked on product"));
    }

    renderListOfNewProducts = () => {
        const {
            newProducts
        } = this.state;

        let productList = newProducts.map((product, index) => {
            return (
                <Form.Group widths={16} key={index}>
                    <Form.Field readOnly>
                        <Form.Input label="Product Name" placeholder="Product Name" value={product.name} />
                    </Form.Field>
                    <Form.Field className="d-flex valign-bottom" readOnly>
                        <Form.Input label="Product Description" placeholder="Product Description" value={product.description} />
                        {/* <Button circular className="circular-icon-btn mL-5" onClick={this.handleProductAddClick}><i className="icon-add-circular"></i></Button> */}
                        <Button circular className="circular-icon-btn" onClick={e => this.handleProductRemoveClick(e, index)}><i className="icon-remove-circular"></i></Button>
                    </Form.Field>
                </Form.Group>
            );
        });

        return productList;
    }

    renderListOfProducts = () => {
        const {
            products,
            productsFollowed
        } = this.state;

        let productList = products.map((product, index) => {
            return (
                <Grid.Column
                    key={index}
                    onClick={() => {
                        // this.handleProductClick(index)
                    }}
                >
                    <div className="product-icon-box">
                        {
                            productsFollowed[index]
                            ? <i className="icon-checked"></i>
                            : ""
                        }
                    </div>
                    <div className="product-heading-box">
                        {product.name}
                    </div>
                    <div className="product-discription-box">
                        {product.description}
                    </div>
                    {/* <div className="product-view-more">
                        <a>View More</a>
                    </div> */}
                </Grid.Column>
            );
        });

        return productList;
    }

    fetchCompanyAndProductsData = () => {
        let companyId;
        let companyName;

        axios.get(`${BASE_URL}/api/v1/user/profile/data`, { withCredentials: true })
            .then(res => {
                companyId = res.data.Item.company_id;
                companyName = res.data.Item.company;

                const tasks = [
                    axios.get(`${BASE_URL}/api/v1/company/${companyId}/products`, { withCredentials: true }),
                    axios.get(`${BASE_URL}/api/v1/user/Products/followed`, { withCredentials: true })
                ];

                return Promise.all(tasks);
            })
            .then(res => {
                const [ allProducts, followedProducts ] = res;

                const products = allProducts.data.Items;

                return Promise.all(
                    products.map(product => axios.get(`${BASE_URL}/api/v1/product/${product.product_id}`, { withCredentials: true })
                        .then(({ data }) => {
                            const productsDetails = data.Item;
                            
                            return {
                                ...productsDetails,
                                isFollowed: true
                                // isFollowed: followedProducts.data.Items.find(item => item.product_id === product.product_id) ? true : false
                            };
                        }))
                );
            })
            .then(productsDetails => {
                const productsFollowed = productsDetails.map(item => item.isFollowed);

                this.setState({
                    products: productsDetails,
                    productsFollowed,
                    company: {
                        companyId,
                        companyName
                    }
                }, () => {
                    console.log("Updated products list and company details.");
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.auth && nextProps && nextProps.auth) {
            this.getUserPicture(nextProps.auth);
        }
    }

    componentDidMount() {
        this.fetchCompanyAndProductsData();
    }

    render() {

        console.log(this.state);

        return (
            <Grid centered padded>
                <Grid.Row className="background-white extra-padding-sides">
                    <Grid.Column width={16} className="mT-10">
                        <h3 className="page-head12-h4 text-left">Products sold by your company</h3>
                    </Grid.Column>
                    <Grid.Column width={16} className="mT-10">
                        <Grid stackable columns={3} padded="vertically" divided="vertically">
                            <Grid.Row>
                                {this.renderListOfProducts()}
                                {/* <Grid.Column>
                                    <div className="product-icon-box">
                                        <i className="icon-checked"></i>
                                    </div>
                                    <div className="product-heading-box">
                                        Fiber Cable
                                    </div>
                                    <div className="product-discription-box">
                                    Lorem ipsum dolor sit amet, consector adipiscing elit, sed do eiusmod tempor incid.
                                    </div>
                                    <div className="product-view-more">
                                        <a>View More</a>
                                    </div>
                                </Grid.Column>
                                <Grid.Column>
                                    <div className="product-icon-box">
                                        <i className="icon-checked"></i>
                                    </div>
                                    <div className="product-heading-box">
                                        Fiber Cable
                                    </div>
                                    <div className="product-discription-box">
                                    Lorem ipsum dolor sit amet, consector adipiscing elit, sed do eiusmod tempor incid.
                                    </div>
                                    <div className="product-view-more">
                                        <a>View More</a>
                                    </div>
                                </Grid.Column>
                                <Grid.Column>
                                    <div className="product-icon-box">
                                        <i className="icon-checked"></i>
                                    </div>
                                    <div className="product-heading-box">
                                        Fiber Cable
                                    </div>
                                    <div className="product-discription-box">
                                    Lorem ipsum dolor sit amet, consector adipiscing elit, sed do eiusmod tempor incid.
                                    </div>
                                    <div className="product-view-more">
                                        <a>View More</a>
                                    </div>
                                </Grid.Column>  
                            </Grid.Row>
                            <Divider className="mT-20 mB-20 section" />
                            <Grid.Row>
                                <Grid.Column>
                                        <div className="product-icon-box">
                                            <i className="icon-checked"></i>
                                        </div>
                                        <div className="product-heading-box">
                                            <input type="text" placeholder="Add Title" />
                                        </div>
                                        <div className="product-discription-box">
                                            <textarea placeholder="Add description"/>
                                        </div>
                                        <div className="product-view-more">
                                            <a>View More</a>
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <div className="product-icon-box">
                                            <i className="icon-checked"></i>
                                        </div>
                                        <div className="product-heading-box">
                                            <input type="text" placeholder="Add Title" />
                                        </div>
                                        <div className="product-discription-box">
                                            <textarea placeholder="Add description"/>
                                        </div>
                                        <div className="product-view-more">
                                            <a>View More</a>
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <div className="product-icon-box">
                                            <i className="icon-checked"></i>
                                        </div>
                                        <div className="product-heading-box">
                                            <input type="text" placeholder="Add Title" />
                                        </div>
                                        <div className="product-discription-box">
                                            <textarea placeholder="Add description"/>
                                        </div>
                                        <div className="product-view-more">
                                            <a>View More</a>
                                        </div>
                                    </Grid.Column>*/}
                            </Grid.Row>
                            <Divider className="mT-20 mB-20 section" />
                        </Grid>
                    </Grid.Column>
                    <Grid.Column width={16} className="mT-10">
                        <h3 className="page-head12-h4 text-left">Please add the products you sell</h3>
                    </Grid.Column>

                    <Form stackable={'true'} className="custom-input-form custom-input-form-product">
                        <Form.Group widths={16}>
                            <Form.Field>
                                <Search
                                    fluid
                                    placeholder="Product Name"
                                    loading={this.state.isLoading}
                                    minCharacters={3}
                                    onResultSelect={this.handleProductSuggestionSelect}
                                    onSearchChange={this.handleProductNameChange}
                                    results={this.state.productSuggestionResults}
                                    value={this.state.productNameInput}
                                    resultRenderer={resultRenderer}
                                    className="searchWithScroll dark-input profile-company-search"
                                />
                            </Form.Field>
                            <Form.Field className="d-flex valign-bottom ">
                                <Form.Input label="Product Description" placeholder="Product Description" value={this.state.productDescInput} onChange={this.handleProductDescChange} />
                                <Button circular className="circular-icon-btn mL-5" onClick={this.handleProductAddClick}><i className="icon-add-circular"></i></Button>
                            </Form.Field>
                        </Form.Group>

                        {this.renderListOfNewProducts()}
                    </Form>
                    <Grid.Column width={16}>
                        <Divider className="mT-20 mB-20 section" />
                        <Button type='button' onClick={e => this.props.goBack()} floated='left' size='mini'>Back</Button>
                        <Button type='button' onClick={e => this.saveFollowedProductsData()} floated='right' size='mini' color='blue'>Save</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

function mapStateToProps({ auth, user }) {
    return { auth, user };
}

export default connect(mapStateToProps, actions)(ProductInfo);
