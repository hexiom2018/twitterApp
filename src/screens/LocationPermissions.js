// import React, { Component } from 'react';
// import Expo from 'expo';
// import { View } from 'native-base';

// export default class LoactionPermissions extends Component {
//   async componentDidMount() {
//     try {
//       this.grantLocationPermssions();
//     } catch (error) {}
//   }

//   async grantLocationPermssions() {
//     const { status } = await Expo.Permissions.getAsync(Expo.Permissions.LOCATION);
//     console.log('location status', status);
//     if (status !== 'granted') {
//       const { status } = await Expo.Permissions.askAsync(Expo.Permissions.LOCATION);
//       if (status === 'granted') {
//           if(this.props.onSuccess){
//               this.props.onSuccess();
//           }
//       } else {
//         alert('cannot show photos on the map');
//       }
//     }else{
//         if(this.props.onSuccess){
//             this.props.onSuccess();
//         }
//     }
//   }
//   render() {
//     return <View style={[{ width: 0, height: 0 }]} />;
//   }
// }
