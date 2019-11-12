import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import * as actions from '../actions'

class AddCompany extends Component {

    renderField(field) {
        let { meta } = field;
        const className = `form-group ${meta.touched && meta.error ? 'has-danger' : ''}`;
        return (
            <div className={className}>
                <label>{field.label}</label>
                <input className="form-control"
                    type="text"
                    {...field.input}
                />
                <div className="text-help">
                    {meta.touched ? meta.error : ''}
                </div>
            </div>
        )
    }

    onSubmit(values) {
        console.log(values);
        this.props.addCompany(values);
    }

    render() {
        const { handleSubmit } = this.props;
        return (
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                <Field 
                    label="Name"
                    name="name"
                    component={this.renderField}
                />
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        )
    }

}

export default reduxForm({
    form: 'AddCompanyForm'
})(connect(null, actions)(AddCompany));