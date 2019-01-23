// import React from 'react';
// import { Text, View, TouchableOpacity } from 'react-native';
// import { Camera, Permissions } from 'expo';

// export default class CameraExample extends React.Component {
//     state = {
//         hasCameraPermission: null,
//         type: Camera.Constants.Type.back,
//     };

//     async componentWillMount() {
//         const { status } = await Permissions.askAsync(Permissions.CAMERA);
//         this.setState({ hasCameraPermission: status === 'granted' });
//     }

//     startVideo = async () => {
//         if (!this.camera) return;
//         try {
//             console.log('Runnnn')
//             const data = await this.camera.recordAsync();
//             console.log('data', data);
//         } catch (error) {
//             throw error;
//         }
//     }

//     render() {
//         const { hasCameraPermission } = this.state;
//         if (hasCameraPermission === null) {
//             return <View />;
//         } else if (hasCameraPermission === false) {
//             return <Text>No access to camera</Text>;
//         } else {
//             return (
//                 <View style={{ flex: 1 }}>
//                     <Camera style={{ flex: 1 }} type={this.state.type}>
//                         <View
//                             style={{
//                                 flex: 1,
//                                 backgroundColor: 'transparent',
//                                 flexDirection: 'row',
//                             }}>
//                             <TouchableOpacity
//                                 style={{
//                                     flex: 0.1,
//                                     alignSelf: 'flex-end',
//                                     alignItems: 'center',
//                                 }}
//                                 onPress={() => {
//                                     this.setState({
//                                         type: this.state.type === Camera.Constants.Type.back
//                                             ? Camera.Constants.Type.front
//                                             : Camera.Constants.Type.back,
//                                     });
//                                 }}>
//                                 <Text
//                                     style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
//                                     {' '}Flip{' '}
//                                 </Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity
//                                 style={{
//                                     flex: 0.3,
//                                     alignSelf: 'flex-end',
//                                     alignItems: 'center',
//                                 }}
//                                 onPress={this.startVideo.bind(this)}>
//                                 <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>[START]</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </Camera>
//                 </View>
//             );
//         }
//     }
// }

import React from 'react';
import {Container, Picker, H1, Form, Item, CheckBox, Label, Input, Button, Text, Content, Icon, Textarea, Left, Body, Header, Right, Title ,  View, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, Permissions, Video } from 'expo';
import Modal from "react-native-modal";
import { Bar } from 'react-native-progress';



export default class CameraExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uri: null,
            permissionsGranted: false,
            bcolor: 'red',
            cameraIsRecording: false,
            type: Camera.Constants.Type.back,
        }
        this.camera = undefined
        this.takeFilm = this.takeFilm.bind(this)
    }

    async componentWillMount() {
        let cameraResponse = await Permissions.askAsync(Permissions.CAMERA)
        if (cameraResponse.status == 'granted') {
            let audioResponse = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
            if (audioResponse.status == 'granted') {
                this.setState({ permissionsGranted: true });
            }
        }
    }

    takeFilm() {
        const { cameraIsRecording } = this.state;
        console.log('aaaaaaaa')
        let self = this;
        if (this.camera) {
            this.camera.recordAsync()
                .then(data =>
                    self.setState({ uri: data.uri, bcolor: 'green' },
                        () => {
                            console.log('Data', data)
                        }
                    )
                )
        }
        setTimeout(() => {
            this.setState({ cameraIsRecording: false })
            this.camera.stopRecording();
        }, 15000)
    }

    render() {
        const { uri, cameraIsRecording, permissionsGranted, bcolor } = this.state;
        if (!this.state.permissionsGranted) {
            return <View><Text>Camera permissions not granted</Text></View>
        } else {
            return (
              
                <View style={{ flex: 1 }}>
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
                </Container >

                    <View style={{ flex: 1 }}>
                        {
                            uri ?
                                <Video
                                    source={{ uri: uri }}
                                    rate={1.0}
                                    volume={1.0}
                                    isMuted={false}
                                    resizeMode="cover"
                                    shouldPlay
                                    isLooping
                                    style={{ flex: 1 }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            backgroundColor: 'transparent',
                                            flexDirection: 'row',
                                        }}>
                                        <TouchableOpacity
                                            style={{
                                                flex: 0.1,
                                                alignSelf: 'flex-end',
                                                alignItems: 'center',
                                            }}
                                            onPress={() => { this.setState({ uri: null }) }}
                                        >
                                            <Text>Retake</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Video>
                                :
                                <Camera ref={ref => this.camera = ref} style={{ flex: 1 }} type={this.state.type} >
                                    <View
                                        style={{
                                            flex: 1,
                                            backgroundColor: 'transparent',
                                            flexDirection: 'row',
                                        }}>
                                        <TouchableOpacity
                                            style={{
                                                flex: 0.1,
                                                alignSelf: 'flex-end',
                                                alignItems: 'center',
                                                left: 10
                                            }}
                                            onPress={() => {
                                                this.setState({
                                                    type: this.state.type === Camera.Constants.Type.back
                                                        ? Camera.Constants.Type.front
                                                        : Camera.Constants.Type.back,
                                                });
                                            }}>
                                            <Text
                                                style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                                                {' '}Flip{' '}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={cameraIsRecording ? styles.opacity1 : styles.opacity2}
                                            onPress={() => {
                                                if (cameraIsRecording) {
                                                    this.setState({ cameraIsRecording: false })
                                                    this.camera.stopRecording();
                                                }
                                                else {
                                                    this.setState({ cameraIsRecording: true })
                                                    this.takeFilm();
                                                }
                                            }}>
                                                    <Text></Text>
                                            {/* {
                                                this.state.cameraIsRecording ?
                                                    <Text>Stop</Text>
                                                    :
                                                    <Text>Start</Text>
                                            } */}
                                        </TouchableOpacity>
                                    </View>
                                </Camera>
                        }
                        {/* </View> */}
                        {/* {
                            uri ?
                                <View style={styles.view}>
                                    <TouchableOpacity style={styles.opacity2} onPress={() => { this.setState({ uri: null }) }}>
                                        <Text>Retake</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={styles.view}>
                                    <TouchableOpacity style={bcolor === 'green' ? styles.opacity1 : styles.opacity2} onPress={() => {
                                        if (cameraIsRecording) {
                                            this.setState({ cameraIsRecording: false })
                                            this.camera.stopRecording();
                                        }
                                        else {
                                            this.setState({ cameraIsRecording: true })
                                            this.takeFilm();
                                        }
                                    }}>
                                        {
                                            this.state.cameraIsRecording ?
                                                <Text>Stop</Text>
                                                :
                                                <Text>Start</Text>
                                        }
                                    </TouchableOpacity>
                                </View>


                        } */}
                    </View>

                </View>)
        }
    }
}

const styles = StyleSheet.create({
    opacity1: {

        // flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',

        left: 110,
        width: 70,
        height: 70,
        borderWidth: 10,
        borderRadius: 100,
        borderColor: 'grey',
        backgroundColor: 'red',
    },
    opacity2: {

        // flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',


        left: 110,
        width: 70,
        height: 70,
        borderWidth: 10,
        borderRadius: 100,
        borderColor: 'grey',
        backgroundColor: 'white',
    },
    view: {
        flex: 0.1,

        textAlign: 'center',
        justifyContent: 'center',
        // position: 'absolute',
        // bottom: 5,
        // zIndex: 100,

    }
})
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
export default connect(mapStateToProps, mapDispatchToProps)(camera)