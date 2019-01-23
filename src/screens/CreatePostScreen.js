import React, { Component } from 'react';
import { View, TouchableOpacity, Platform, Image, SafeAreaView, Dimensions, Alert, ScrollView, StyleSheet } from 'react-native';
import { Container, Picker, H1, Form, Item, CheckBox, Label, Input, Button, Text, Content, Icon, Textarea, Left, Body, Header, Right, Title } from 'native-base';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import Expo, { Video, ImagePicker, Location, Permissions, Constants } from 'expo';
// import moment from 'moment';
import CameraExample from '../component/CreatePosts/Camera'
import { DrawerActions } from 'react-navigation';
import { bindActionCreators } from 'redux';
import { GetUserLocation } from '../actions/getLocationAction'
import { Bar } from 'react-native-progress';
import VideoPlayer from '@expo/videoplayer';
import { createPostAction } from '../actions/PostsActions';
import Modal from "react-native-modal";
import { __await } from 'tslib';
import { Ionicons } from '@expo/vector-icons';
const { width } = Dimensions.get("screen")

const validate = (values) => {

    let error = {}


    return error;
}




const MediaPicker = ({ input: { onChange, value, ...inputProps }, ...restProps, onPress }) => (
    <Item style={[{ marginLeft: 0, marginVertical: 4, borderRadius: 5 }]} >

        <View style={{ width: '100%', height: 128, backgroundColor: '#FFF', borderRadius: 3 }} >
            <TouchableOpacity style={{ height: "96%", width: "98%", margin: "1%", borderColor: 'rgb(78, 78, 79)', borderWidth: 1, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', borderRadius: 5, }} onPress={() => { onPress(onChange) }}>
                <Icon name='ios-camera' style={{ fontSize: 48, color: 'rgb(78, 78, 79)' }} />
                <Text style={{ color: 'rgb(78, 78, 79)' }}>Add Photo</Text>
            </TouchableOpacity>
        </View>
    </Item>
)

const VideoPicker = ({ input: { onChange, value, ...inputProps }, ...restProps, onPress }) => (
    <Item style={[{ marginLeft: 0, marginVertical: 4, borderRadius: 5 }]} >

        <View style={{ width: '100%', height: 128, backgroundColor: '#FFF', borderRadius: 3 }} >
            <TouchableOpacity style={{ height: "96%", width: "98%", margin: "1%", borderColor: 'rgb(78, 78, 79)', borderWidth: 1, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', borderRadius: 5, }} onPress={() => { onPress(onChange) }}>
                <Icon name='ios-camera' style={{ fontSize: 48, color: 'rgb(78, 78, 79)' }} />
                <Text style={{ color: 'rgb(78, 78, 79)' }}>Add Video</Text>
            </TouchableOpacity>
        </View>
    </Item>
)

const InputText = ({ input, label }) => (
    <Item style={[{ padding: 5, backgroundColor: 'white', marginVertical: 4, borderRadius: 5, borderWidth: 3, borderColor: '#FFFEF6', }]} inlineLabel>
        <Input placeholderTextColor='#BDBEBF' style={{ color: '#737277', }} {...input} placeholder={label} />
    </Item>
)


const InputTextArea = ({ input, label }) => (<Item style={[{ justifyContent: "center", backgroundColor: 'white', borderRadius: 5, borderWidth: 3, borderColor: '#FFFEF6', }]} stackedLabel>

    <Textarea {...input} rowSpan={5} style={[{ width: '100%', color: '#737277', }]} placeholder={label} placeholderTextColor='#BDBEBF' />
</Item>)


const renderPicker = ({ input: { onChange, value, ...inputProps }, children, ...pickerProps }) => (
    <Item picker style={[{ justifyContent: "center", padding: 5, backgroundColor: 'white', marginVertical: 4, borderRadius: 5, borderWidth: 3, borderColor: '#FFFEF6', }]}>

        <Picker
            selectedValue={value}
            onValueChange={v => {
                onChange(v)
            }}
            itemTextStyle={{ color: "rgb(78, 78, 79)" }}
            headerTitleStyle={{ color: "#fff" }}
            textStyle={{ color: "rgb(78, 78, 79)" }}
            headerBackButtonTextStyle={{ color: "#fff" }}
            {...inputProps}
            {...pickerProps}
        >
            {children}
        </Picker>
    </Item>
);


const renderCheckbox = ({ input: { onChange, value }, label }) => (
    <Item style={[{ marginLeft: 0, padding: 5, backgroundColor: 'white', marginVertical: 4, borderRadius: 5, borderWidth: 3, borderColor: '#FFFEF6', }]}>
        <CheckBox checked={Boolean(value)} color='green' onPress={() => onChange(!value)} />
        <Text style={{ color: 'rgb(78, 78, 79)', marginLeft: 15, }}>{label}</Text>
    </Item>


)


submit = (values, dispatch, props) => {

    try {
        console.log('submit vlues', values)
        createPostAction({ ...values }, dispatch)
        //props.navigation.goBack()  
    } catch (error) {
        console.error(error)
    }



}
const styles = StyleSheet.create({
    container: {
        paddingTop: 150,
        minHeight: 1000,
    },
    paragraph: {
        marginHorizontal: 15,
        marginTop: 30,
        fontSize: 18,
        color: '#34495e',
    },
    LaunchLib: {
        flex: 1,
        // backgroundColor: 'yellow',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 15

    }
});
class CreatePostScreen extends Component {
    state = {
        country: 'usa',
        city: 'usa',
        cancelled: undefined, type: undefined, uri: undefined,
        UploadingModalVisibile: false,
        title: null,
        des: null,
        userImage: true,
        userVideo: true,
        selectedImage: null,
        selectedVideo: null,
        where: { lat: null, lng: null },
        result: null,
        land: false,
        country:'',
        city:'',
    };
    static navigationOptions = {
        drawerLabel: 'Create Post',
        header: null,
    }
    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        // you would probably do something to verify that permissions
        // are actually granted, but I'm skipping that for brevity
    };

    useLibraryHandler = async () => {
        await this.askPermissionsAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64: false,
            mediaTypes: 'All'
        });
        console.log(result, 'result here from librarry')
        if (result.uri) {
            if (result.type === 'image') {
                const { change } = this.props
                change('mediaPicker', result)
                this.setState({ selectedImage: result, userVideo: false, userImage: true, mediaPicker: result });
            } else {
                if (result.duration <= 15000) {
                    const { change } = this.props
                    change('mediaPicker', result)
                    this.setState({ selectedVideo: result, userImage: false, userVideo: true, mediaPicker: result });
                } else {
                    Alert.alert(
                        'Alert',
                        'Video must be less than or equal to 15 sec',
                        [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ],
                        { cancelable: false }
                    )
                }
            }
        }
    };

    useCameraHandler = async () => {
        await this.askPermissionsAsync();
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64: false,
        });
        // console.log(result,'picture ka result')
        this.setState({ selectedImage: result, userVideo: false, mediaPicker: result });
    };


    //uzair
    componentDidMount() {
        // this.setState({ UID: this.props.UID })
        if (!Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
            console.log("not ios ")
        } else {
            this._getLocationAsync();
        }

    }
    _getLocationAsync = async () => {


        let location = await Location.getCurrentPositionAsync({});
        let address = Promise.resolve(Expo.Location.reverseGeocodeAsync(location.coords));
        const that = this
        address.then(function (value) {
            let array = value.map(name => {
                
                 return(
                    that.setState({country:name.country,
                    city:name.city
                    }),
                     console.log(name.country)
                 )

                
            })
        });

        this.setState({
            location,
            where: { lat: location.coords.latitude, lng: location.coords.longitude },
            get: true
        });
        console.log("location===>>>>", location)

    };

    //uzair

    // _getLocationAsync = async () => {
    //     // const { status } = await Expo.Permissions.getAsync(Expo.Permissions.LOCATION);

    //     let { status } = await Permissions.askAsync(Permissions.LOCATION);
    //     if (status !== 'granted') {
    //         this.setState({
    //             errorMessage: 'Permission to access location was denied',
    //         });
    //         Alert.alert(
    //             'Alert',
    //             'Permission to access location was denied',
    //             { cancelable: false }
    //         )
    //     }

    //     let location = await Location.getCurrentPositionAsync({});
    //     this.setState({ location });
    //     console.log(location, 'your location coords')
    //     this.props.change('lat', location.coords.latitude);
    //     this.props.change('lng', location.coords.longitude);
    //     this.props.change('date', moment.now());
    // };

    // componentDidMount() {

    // if (Platform.OS === 'android' && !Constants.isDevice) {
    //     this.setState({
    //         errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
    //     });
    // } else {
    //     this._getLocationAsync();
    //     const { GetUserLocation } = this.props.actions
    //     console.log(this.props, 'props here')
    //     // GetUserLocation()

    // }



    // if (status !== 'granted') {
    //     const { status } = await Expo.Permissions.askAsync(Expo.Permissions.LOCATION)
    //     if (status !== 'granted') {
    //         alert("cannot show photos on the map");
    //     }
    // }

    // try {
    //     const location = Expo.Location.getCurrentPositionAsync();
    //     const { coords } = await location
    //     console.log(coords,'cooordes heree')
    //     // lat and long of default USA San Francisco
    //     coords.latitude = 37.773972;
    //     coords.longitude = -122.431297;

    //     this.props.change('lat', coords.latitude);
    //     this.props.change('lng', coords.longitude);
    //     this.props.change('date', moment.now());
    //     console.log('coords', coords)
    // } catch (error) {
    //     console.error(error)
    //     alert("cannot find your location ")
    // }


    // }

    async  mediaPicker(onChange) {
        try {
            await Permissions.askAsync(Permissions.CAMERA);
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                base64: false,
                mediaTypes: 'All'
            });
            // const result = await Expo.ImagePicker.launchImageLibraryAsync({ allowsEditing: true, mediaTypes: 'All', })
            const { cancelled, type, uri } = result
            onChange({ type, uri })
            console.log(result, 'result ha i=dhar')

        } catch (error) {
            console.error(error)
        }

    }

    showSelectedImage = (mediaPicker) => {
        if (mediaPicker) {
            if (mediaPicker.uri) {
                console.log(mediaPicker.uri, 'selected image uri');
                return true
            }

        }
        return false
    }


    showSelectedVideo = (mediaPicker) => {
        if (mediaPicker) {
            if (mediaPicker.uri && mediaPicker.type && mediaPicker.type == 'video') {
                console.log(mediaPicker.uri, 'selected image uri');

                return true
            }
        }
        return false
    }

    submitPost() {
        const { handleSubmit } = this.props;
        const { mediaPicker } = this.state

        if (!mediaPicker.uri) {
            alert("Please select an image to post")
        } else {
            if (this.state.title && this.state.des) {
                handleSubmit()
            } else {
                alert("Please fill all required field to post")
            }
        }
    }

    render() {

        const { handleSubmit, pristine, reset, submitting, change } = this.props;
        const { selectedImage, selectedVideo, land, userImage, userVideo,country,city } = this.state
        if (this.props.postUploaded) {
            setTimeout(() => {
                this.props.navigation.goBack()
                //    this.props.resetForm()
                this.props.dispatch({ type: 'CREATE_POST_DISMISSED' })
            }, 5)
        }
        if (this.props.createPostError) {
            alert('error', this.props.createPostError)
            this.props.navigation.goBack()
            this.props.dispatch({ type: 'CREATE_POST_DISMISSED' })
        }

        return (

            <Container style={[{ flex: 1, backgroundColor: '#f9f9f9' }]}>
                <Modal isVisible={this.props.progressState === 'running'}  >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        <H1>Uploading Post</H1>
                        <Bar width={300} progress={this.props.progress * 0.01} unfilledColor='white' borderWidth={3} borderColor='#F5F0DD' color='#E2D7B7' indeterminate={false} />
                    </View>
                </Modal>
                <Header style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity style={{ height: '100%', width: 40, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => {
                            this.props.navigation.dispatch(DrawerActions.toggleDrawer());
                        }}
                    >
                        <Icon style={[{ color: 'white', }]} name='menu' onPress={() => { this.props.navigation.dispatch(DrawerActions.toggleDrawer()); }} />
                    </TouchableOpacity>
                    <View style={{ height: "100%", justifyContent: 'center', alignItems: 'center', minWidth: 40 }}>
                        <Title style={[{ color: 'white', textAlign: 'center', fontSize: 23 }]}>Create Post</Title>
                    </View>
                    <TouchableOpacity style={{ height: '100%', width: 40, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => {
                            this.props.navigation.navigate('SearchPosts');
                        }}
                    >
                        <Icon
                            style={[{ color: 'white' }]}
                            name="search"
                            onPress={() => {
                                this.props.navigation.navigate('SearchPosts');
                            }}
                        />
                    </TouchableOpacity>
                </Header>

                <Content style={{ flex: 1, paddingHorizontal: 4, }} contentContainerStyle={{ justifyContent: 'space-evenly', alignItems: 'center', padding: 0, }}>
                    <View style={{ flex: 1 }}>
                        <Form style={{ padding: 0, marginLeft: 0, }}>
                            {
                                !userImage &&
                                <View
                                    style={{ marginTop: 10, flex: 1, flexDirection: 'row', backgroundColor: 'red', justifyContent: 'center', paddingVertical: 10 }}
                                >
                                    <View style={{ flexGrow: 1, paddingLeft: 20 }}>
                                        <Text>Remove</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ userImage: true, userVideo: true, selectedImage: null, selectedVideo: null })}
                                    >
                                        <View style={{ paddingRight: 20 }}>
                                            <Text>X</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }
                            {
                                !userVideo &&
                                <View
                                    style={{ marginTop: 10, flex: 1, flexDirection: 'row', backgroundColor: 'red', justifyContent: 'center', paddingVertical: 10 }}
                                >
                                    <View style={{ flexGrow: 1, paddingLeft: 20 }}>
                                        <Text>Remove</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => this.setState({ userImage: true, userVideo: true, selectedImage: null, selectedVideo: null })}
                                    >
                                        <View style={{ paddingRight: 20 }}>
                                            <Text>X</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }
                            {
                                userImage ?
                                    selectedImage &&
                                        selectedImage.uri ?
                                        <Image
                                            source={{ uri: selectedImage.uri }}
                                            // fadeDuration={0}
                                            style={{ width: '100%', height: 150, marginTop: 20 }}
                                        />
                                        :
                                        (<Field
                                            name='mediaPicker'
                                            component={MediaPicker}
                                            label='mediaPicker'
                                            // onPress={this.mediaPicker}
                                            onPress={this.useCameraHandler}
                                        />)
                                    :
                                    null
                            }
                            {
                                userImage && userVideo &&
                                <View style={styles.LaunchLib}>
                                    <View>
                                        <Text style={{ fontSize: 24, color: 'black' }}>OR</Text>
                                    </View>
                                </View>
                            }
                            {
                                userVideo ?
                                    selectedVideo &&
                                        selectedVideo.uri ?
                                        <TouchableOpacity onPress={() => this.setState({ land: !land })}>
                                            <VideoPlayer
                                                videoProps={{
                                                    resizeMode: Video.RESIZE_MODE_CONTAIN,
                                                    source: {
                                                        uri: selectedVideo.uri,
                                                    },
                                                    shouldPlay: land,

                                                }}
                                                switchToLandscape={() => this.landScape()}
                                                isPortrait={true}
                                                playFromPositionMillis={0}
                                            />
                                        </TouchableOpacity>
                                        :
                                        (<Field
                                            name='mediaPicker'
                                            component={VideoPicker}
                                            label='videoPicker'
                                            onPress={this.mediaPicker}
                                        />)
                                    :
                                    null
                            }
                            {/* {this.showSelectedImage(this.props.mediaPicker) && (<Image style={[{ width: '100%', height: 128, }]} source={{ uri: this.props.mediaPicker.uri }} />)} */}
                            {/* {
                                !this.showSelectedVideo(this.props.mediaPicker) && (
                                    <Video style={[{ width: '100%', height: 128 }]} source={{ uri: this.props.mediaPicker.uri }}
                                        rate={1.0}
                                        volume={1.0}
                                        isMuted={false}
                                        resizeMode="cover"
                                        shouldPlay
                                        isLooping
                                    />
                                )} */}

                            <View style={styles.LaunchLib}>
                                <View>
                                    <Button
                                        onPress={this.useLibraryHandler}
                                    >
                                        <Text>
                                            <Image
                                                source={require('../../assets/gallery.png')}
                                                // fadeDuration={0}
                                                style={{ width: 60, height: 60, marginTop: 20 }}
                                            /> Choose from Gallery
                                            </Text>
                                    </Button>
                                </View>
                            </View>
                            {/* <Text style={styles.paragraph}>
                                {JSON.stringify(this.state.result)}
                            </Text> */}
                            <Field name='title' label='Title' onChange={(e, value) => this.setState({ title: value })} component={InputText} />
                            <Field name='detailsDescription' label='Detailed Description' onChange={(e, value) => this.setState({ des: value })} component={InputTextArea} />
                            <Field name='public' label='Public' component={renderCheckbox} onChange={(event, newValue, previousValue, name) => change('private', !Boolean(newValue))} />
                            <Field name='private' label='Private' component={renderCheckbox} onChange={(event, newValue, previousValue, name) => change('public', !Boolean(newValue))} />
                            <Field
                                name="country"
                                component={renderPicker}
                                iosHeader="Select country"
                                // style={{ width: width - 20 }}
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-dropdown-circle" style={{ color: "#4517FF", fontSize: 25 }} />}
                            >
                                <Picker.Item label={country} value={country} />
                            </Field>

                            <Field
                                name="city"
                                component={renderPicker}
                                iosHeader="Select city"
                                // style={{ width: width - 20 }}
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-dropdown-circle" style={{ color: "#4517FF", fontSize: 25 }} />}
                            >
                                <Picker.Item label={city} value={city} />
                            </Field>
                        </Form>
                    </View>
                    <View style={[{ height: 60 }]} />
                </Content>
                <Button block style={[{ backgroundColor: '#4517FF', position: 'absolute', bottom: 4, left: 8, right: 8 }]}
                    onPress={() => this.submitPost()}
                ><Text style={[{ color: 'white' }]}>POST</Text></Button>
            </Container>

        )
    }
}

const CreatePostForm = reduxForm({ form: 'createPost', onSubmit: submit, validate, initialValues: { country: 'USA', city: 'San Francisco, California', public: true } })(CreatePostScreen)
const selector = formValueSelector('createPost')
mapStateToProps = (state) => {
    return {
        mediaPicker: selector(state, 'mediaPicker'),
        postUploaded: state.createPost.postUploaded,
        createPostError: state.createPost.error,
        progress: state.createPost.progress,
        progressState: state.createPost.state
    }
}

function mapDispatchToProps(dispatch) {
    return ({
        actions: bindActionCreators({
            GetUserLocation
        }, dispatch)
    })
}
export default connect(mapStateToProps, mapDispatchToProps)(CreatePostForm)
