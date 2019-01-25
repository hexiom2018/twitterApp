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
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Camera, Permissions, Video } from 'expo';
import { Icon } from 'react-native-elements'
import video from '../../../assets/video.png'

export default class CameraExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uri: null,
            permissionsGranted: false,
            bcolor: 'red',
            type: Camera.Constants.Type.back,
            cameraIsRecording: false
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
            if (this.camera) {
                this.camera.stopRecording();
                this.setState({ cameraIsRecording: false })
            }
        }, 15000)


    }

    goBack() {
        const { back } = this.props

        back()
    }

    done() {
        const { uri } = this.state
        const { VideoUri } = this.props
        VideoUri(uri)
        // console.log(uri, 'uri herere')
    }

    render() {
        const { uri, cameraIsRecording, permissionsGranted, bcolor } = this.state;
        if (!this.state.permissionsGranted) {
            return <View><Text>Camera permissions not granted</Text></View>
        } else {
            return (
                <View style={{ flex: 1 }}>
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
                                // style={{ width: 350, height: 350 }}
                                />
                                :
                                <Camera ref={ref => this.camera = ref} style={{ flex: 1 }} ></Camera>
                        }
                    </View>
                    {
                        uri ?
                            <View style={styles.btn}>
                                <TouchableOpacity onPress={() => this.goBack()} style={styles.opacity3}>
                                    {/* <Text>Back</Text> */}
                                    <Icon name='arrow-back' />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.opacity3} onPress={() => { this.setState({ uri: '' }) }}>
                                    {/* <Text>Retake</Text> */}
                                    <Icon name='loop' />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.done()} style={styles.opacity3} >
                                    {/* <Text>Done</Text> */}
                                    <Icon name='done' />
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={styles.btn}>
                                <TouchableOpacity onPress={() => this.goBack()} style={styles.opacity2}>
                                    <Icon name='arrow-back' />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.opacity2} onPress={() => {
                                    if (cameraIsRecording) {
                                        if (this.camera) {
                                            this.camera.stopRecording();
                                            this.setState({ cameraIsRecording: false })
                                        }
                                    }
                                    else {
                                        this.setState({ cameraIsRecording: true })
                                        this.takeFilm();
                                    }
                                }}>
                                    {
                                        this.state.cameraIsRecording ?
                                            // <Text>Stop</Text>
                                            <Icon name='videocam-off' />
                                            :
                                            // <Text>Start</Text>
                                            <Icon name='videocam' />
                                        // <Image source={{uri:video}}/>
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({
                                    type: this.state.type === Camera.Constants.Type.back
                                        ? Camera.Constants.Type.front
                                        : Camera.Constants.Type.back,
                                })} style={styles.opacity2}>
                                    <Icon name='flip-to-front' />
                                </TouchableOpacity>
                            </View>
                        //camera-front  camera-rear","camera-roll"  "videocam","videocam-off"


                    }
                </View>)
        }
    }
}

const styles = StyleSheet.create({
    opacity1: {
        // left: 0,
        width: 70,
        height: 70,
        borderWidth: 10,
        borderRadius: 70,
        borderColor: 'red',
        backgroundColor: 'blue',
        textAlign: 'center',
        justifyContent: 'center'
    },
    opacity2: {
        // left: 0,
        width: 70,
        height: 50,
        // borderWidth: 10,
        borderRadius: 70,
        borderColor: 'white',
        backgroundColor: 'white',
        textAlign: 'center',
        justifyContent: 'center'
    },

    opacity3: {
        // left: 170,
        width: 70,
        height: 50,
        // borderWidth: 10,
        // borderRadius: 70,
        // borderColor: 'grey',
        borderRadius: 70,
        borderColor: 'white',
        backgroundColor: 'white',
        textAlign: 'center',
        justifyContent: 'center'

    },
    View: {
        flex: 0.1,
        textAlign: 'center',
        justifyContent: 'center'
    },
    btn: {
        // flex: 1,
        flexDirection: 'row',
        // textAlign: 'center',
        justifyContent: 'space-evenly',
        left: 0
    }
})