// import actionTypes from '../constant/constant'
import { Location, Permissions } from 'expo';
import { View, TouchableOpacity, Platform, Image, SafeAreaView, Dimensions, Alert } from 'react-native';


export async function GetUserLocation() {
    return dispatch => {
        return new Promise(function (resolve, reject) {
            console.log('chala bhai action')
            let { status } = Permissions.askAsync(Permissions.LOCATION);
            if (status !== 'granted') {
                this.setState({
                    errorMessage: 'Permission to access location was denied',
                });
                Alert.alert(
                    'Alert',
                    'Permission to access location was denied',
                    { cancelable: false }
                )
            }

            let location = Location.getCurrentPositionAsync({});
            // this.setState({ location });
            console.log(location, 'your location coords from action')
            // this.props.change('lat', location.latitude);
            // this.props.change('lng', location.longitude);
            // this.props.change('date', moment.now());
        })
    }
}
