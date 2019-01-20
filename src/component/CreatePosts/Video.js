// import React, { Component } from 'react';
// import { StyleSheet, Text, View, Button, Image } from 'react-native';
// import MediaPicker from "react-native-mediapicker"

// class Video extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {

//         }
//         this.whenClicked = this.whenClicked.bind(this);
//     }

//     whenClicked(items) {
//         console.log('Itemsssss', items)
//     }

//     render() {
//         return (
//             <MediaPicker
//                 callback={items => this.whenClicked(items)}
//                 groupTypes="SavedPhotos"
//                 assetType="Photos"
//                 maximum={1}
//                 imagesPerRow={3}
//                 imageMargin={5}
//                 showLoading={true}
//                 backgroundColor="black"
//                 // selectedMarker={
//                     // <Image
//                     //     style={[styles.checkIcon, { width: 25, height: 25, right: this.props.imageMargin + 5 },]}
//                     //     source={require('./checkmark.png')}
//                     // />
//                 // } 
//                 />
//         )
//     }

// }

// export default Video
import React from 'react';
import { Button, Image, View, Platform } from 'react-native';
import { ImagePicker, DocumentPicker, Video, Constants, Location, Permissions } from 'expo';

export default class ImagePickerExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            location: null,
            errorMessage: null,
        }

    }

    componentDidMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
        } else {
            console.log('Run***********')
            this._getLocationAsync();
        }
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        console.log("Run_getLocationAsync", status)
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync();
        console.log('location', location)
        this.setState({ location });
    };

    render() {
        let { image, location } = this.state;
        console.log('Location', location)

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Button
                    title="Pick an image from camera roll"
                    onPress={this._pickImage}
                />
                {image &&
                    <Video
                        // source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                        source={{ uri: image }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="cover"
                        shouldPlay
                        isLooping
                        style={{ width: 300, height: 300 }}
                    />
                    // <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
                }
            </View>
        );
    }

    _pickImage = async () => {
        let result = await DocumentPicker.getDocumentAsync({ type: 'video/*' })
        // let result = await ImagePicker.launchImageLibraryAsync({
        //   allowsEditing: true,
        //   aspect: [4, 3],

        // });

        console.log(result);

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };
}