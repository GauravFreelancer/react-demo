import { Grid, Paper, TextField, Button, Box } from '@material-ui/core';
import React, { Component } from 'react'
import classes from './ManageUser.module.css';

const emailValidator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const mobileNumberValidator = /^(\+\d{1,3}[- ]?)?\d{10}$/;

export default class ManageUser extends Component {
    state = {
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        address: "",
        firstNameError: "",
        lastNameError: "",
        emailAddressError: "",
        mobileNumberError: "",
        addressError: ""
    };

    componentDidMount(){
        console.log(this.props.match);
        if(this.props.match.params.userId){
           
            fetch('http://localhost:8080/manage-user/'+ this.props.match.params.userId,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(result => {
                return result.json();
            }).then(data => {
                const user = data.data;
                console.log(data);
                this.setState({
                    firstName: user.FirstName,
                    lastName: user.LastName,
                    email: user.Email,
                    mobile: user.MobileNumber,
                    address: user.Address
                })
            })
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target;
    
        this.setState({
          [name]: value
        });
        return;
    }
    
    handleBlur = (event) => {
        const { name } = event.target;

        this.validateField(name);
        return;
    }

    validateField = (name) => {
        let isValid = false;
    
        if (name === "firstName") isValid = this.validateFirstName();
        else if (name === "lastName") isValid = this.validateLastName();
        else if (name === "email") isValid = this.validateEmailAddress();
        else if (name === "mobile") isValid = this.validateMobileNumber();
        return isValid;
    }

    validateFirstName = () => {
        let firstNameError = "";
        const value = this.state.firstName;
        if (value.trim() === "") {
            firstNameError = "First Name is required";
        }

        this.setState({
          firstNameError
        });
        return firstNameError === "";
    }
    
    validateLastName = () => {
        let lastNameError = "";
        const value = this.state.lastName;
        if (value.trim() === "") {
            lastNameError = "Last Name is required";
        }

        this.setState({
        lastNameError
        });
        return lastNameError === "";
    }

    validateEmailAddress = () => {
        let emailAddressError = "";
        const value = this.state.email;
        if (value.trim === "") {
            emailAddressError = "Email Address is required";
        }    
        else if (!emailValidator.test(value)){
            emailAddressError = "Email is not valid";
        }

        this.setState({
            emailAddressError
        });
        return emailAddressError === "";
    }

    validateMobileNumber = () => {
        let mobileNumberError = "";
        const value = this.state.mobile;
        if (value.trim === "") {
            mobileNumberError = "Mobile number is required";
        }    
        else if (!mobileNumberValidator.test(value)){
            mobileNumberError = "Mobile number is not valid";
        }

        this.setState({
            mobileNumberError
        });
        return mobileNumberError === "";
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let formFields = [
          "firstName",
          "lastName",
          "email",
          "mobile"
        ];
        let isValid = true;
        formFields.forEach(field => {
          isValid = this.validateField(field) && isValid;
        });
        console.log(isValid);
        if(isValid){
            fetch('http://localhost:8080/manage-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    FirstName: this.state.firstName,
                    LastName: this.state.lastName,
                    MobileNumber: this.state.mobile,
                    Email: this.state.email,
                    Address: this.state.address
                })
            }).then(result=> {
               return result.json();
            })
            .then(result => {
                if(result.success){
                    this.props.history.push({pathname:'/'})
                }
            })
        }
      }


    render() {
        return (
            <Grid>
                <Paper elevation={20} className={classes.Paper}>
                    <Grid align='center'>
                        <h2>Manage User</h2>
                    </Grid>
                    <form onSubmit={this.handleSubmit}>
                        <TextField 
                            fullWidth 
                            label='First Name' 
                            name="firstName"
                            value={this.state.firstName}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            autoComplete="off"
                            error={this.state.firstNameError.length > 0}
                            helperText={this.state.firstNameError}/>
                        <TextField 
                            fullWidth 
                            label='Last Name'
                            name='lastName'
                            value={this.state.lastName}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            autoComplete="off"
                            error={this.state.lastNameError.length > 0}
                            helperText={this.state.lastNameError}/>
                        <TextField 
                            fullWidth 
                            label='Email'
                            name='email'
                            value={this.state.email}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            autoComplete="off"
                            error={this.state.emailAddressError.length > 0}
                            helperText={this.state.emailAddressError}/>
                        <TextField 
                            fullWidth 
                            label='Phone Number'
                            type="number"
                            name='mobile'
                            value={this.state.mobile}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            autoComplete="off"
                            error={this.state.mobileNumberError.length > 0}
                            helperText={this.state.mobileNumberError}/>
                        <TextField 
                            fullWidth 
                            label='Address'
                            name='address'
                            value={this.state.address}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            autoComplete="off"
                            error={this.state.addressError.length > 0}
                            helperText={this.state.addressError}/>
                        <Box display="flex" justifyContent="center" p={2}>
                            <Button type='submit' variant='contained' color='primary'>{this.props.match.params.userId ? "Update" : "Save"}</Button>
                        </Box>    
                    </form>
                </Paper>
            </Grid>
        )
    }
}
