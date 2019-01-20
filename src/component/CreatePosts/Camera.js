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
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, Permissions, Video } from 'expo';


export default class CameraExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uri: null,
            permissionsGranted: false,
            bcolor: 'red',
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
                                <Camera ref={ref => this.camera = ref} style={{ flex: 1 }} ><Text>8</Text></Camera>
                        }
                    </View>
                    {
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


                    }
                </View>)
        }
    }
}

const styles = StyleSheet.create({
    opacity1: {
        left: 150,
        width: 70,
        height: 70,
        borderWidth: 10,
        borderRadius: 70,
        borderColor: 'red',
        backgroundColor: 'blue',
    },
    opacity2: {
        left: 150,
        width: 70,
        height: 70,
        borderWidth: 10,
        borderRadius: 70,
        borderColor: 'grey',
        backgroundColor: 'white',
    },
    view: {
        // flex: 0.1,

        textAlign: 'center',
        justifyContent: 'center'
    }
})