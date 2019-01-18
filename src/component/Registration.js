import React, { Component } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { View, Form, Item, Input, Button, Text, Label, H1, Content } from 'native-base';
import { Field, reduxForm } from 'redux-form';
import { withNavigation } from 'react-navigation';
import { createAccountWithEmail } from '../actions/EmailSignInAction';
import SubmitRegistration from './SubmitRegistration';
const FItem = ({ input, label, type, meta: { touched, error, warning }, ...rest }) => (
    <Item inlineLabel>
        <Label>{label}</Label>
        <Input selectionColor="#FFFFFF" {...input}  {...rest} />
        {(<Text>{error}</Text>)}
    </Item>
)

const renderPasswordInut = ({ input, label, type, meta: { touched, error, warning }, }) => (
    <Item inlineLabel>
        <Label>{label}</Label>
        <Input selectionColor="#FFFFFF" {...input} secureTextEntry={true} />
        {(<Text></Text>)}
    </Item>
)
const validate = values => {
    const error = {};
    error.email = '';
    error.name = '';
    let ema = values.email;
    let nm = values.name;
    let pass = values.password;
    let cofrmPass = values.confirmPassword;

    if (values.email === undefined) {
        ema = '';
    }
    if (values.name === undefined) {
        nm = '';
    }
    if (values.password === undefined) {
        pass = '';
    }
    if (values.confirmPassword === undefined) {
        cofrmPass = '';
    }

    if (!ema.includes('@') && ema !== '') {
        error.email = '@ not included';
    }
    if (nm.length > 20) {
        error.name = 'max 8 characters';
    }
    if (pass.length < 7) {
        error.passowrd = 'password is too short'
    }
    if (pass !== cofrmPass) {
        error.confirmPassword = "confirm password doesn't match "
    }
    console.log(error)
    console.log(values)
    return error;
};


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


const submitRegistration = async (values, dispatch, props) => {
    var { email, firstName, lastName, password, confirmPassword } = values;
    try {
        if (email && firstName && lastName && password && confirmPassword) {
            if (validateEmail(email)) {
                if (password === confirmPassword) {
                    if(password.length >= 6){
                        await createAccountWithEmail({ ...values }, dispatch)
                    } else {
                        throw "Password is too short, should be more than 5 charechters"
                    }
                } else {
                    throw "Password and confirmPassword should be same"
                }
            } else {
                throw "Please put valid email"
            }
        } else {
            throw "Please fill all required fields"
        }
        console.log(values)
    } catch (error) {
        alert(error)
        console.warn(error)
    }

}

class Registration extends Component {




    render() {

        const { handleSubmit, } = this.props
        return (
            <KeyboardAvoidingView style={{ width: '100%', height: '80%' }}>


                {/* <Form style={{}}> */}
                <View style={{ height: '100%', justifyContent: 'space-between' }}>
                    <Field name='firstName' component={FItem} label="First Name" />
                    <Field name='lastName' component={FItem} label="Last Name" />
                    <Field name='email' component={FItem} label="Email " keyboardType='email-address' />
                    <Field name='password' component={renderPasswordInut} label="Password" />
                    <Field name='confirmPassword' component={renderPasswordInut} label="Confirm Password" />
                </View>
                {/* </Form> */}
            </KeyboardAvoidingView>
        )
    }
}


export default reduxForm({ form: 'registration', validate, onSubmit: submitRegistration })(withNavigation(Registration))