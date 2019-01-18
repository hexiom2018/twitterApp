import React from 'react';
import { } from 'react-native';
import { Button, Text } from 'native-base';
import { connect } from 'react-redux'
import { submit } from 'redux-form'
const SubmitButton = ({ dispatch }) => {
    debugger
    return (
        <Button block onPress={() => dispatch(submit('registration'))//click(dispatch, submit)
        } >
            <Text style={{color:"#000"}}>Register</Text>
        </Button>
    )
}

export default connect()(SubmitButton)