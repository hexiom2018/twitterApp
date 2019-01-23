import React, { Component } from "react";
import {
  Image,
  ImageBackground,
  WebView,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StyleSheet

} from "react-native";
import {
  Container,
  Icon,
  Header,
  Body,
  Left,
  Right,
  Title
} from "native-base";
import { MapView } from "expo";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { DrawerActions } from "react-navigation";
import { loadPostsAction } from "../actions/PostsActions";
import MapStyle from "../utils/MapStyle";
import { Constants, Location, Permissions } from 'expo';
import { Marker } from 'react-native-maps';

class GoogleMapScreen extends Component {
  state = {
    extraData: false,
    where: { lat: null, lng: null },
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
    console.log("function run ")
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    console.log("permission not granted ")

    }
    
    let location = await Location.getCurrentPositionAsync({});
    console.log("permission  granted ")

    this.setState({
      location,
      where: { lat: location.coords.latitude, lng: location.coords.longitude },
      get: true
    });
    console.log("location===>>>>",location)

};
//uzair


  static navigationOptions = {
    drawerLabel: "GoogleMap",
    header: null
  };

  render() {
    const { ClinicName, Certificates, OpenTime, CloseTIme, Since, where, UID, get } = this.state
    console.log('****', UID, ClinicName, Since, OpenTime, CloseTIme, Certificates, where);
    return (
      
        <View>
             <Header style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
         <TouchableOpacity style={{ height: '100%', width: 40, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => {
              this.props.navigation.dispatch(DrawerActions.toggleDrawer());
            }}
          >
            <Icon style={[{ color: 'white', }]} name='menu' onPress={() => { this.props.navigation.dispatch(DrawerActions.toggleDrawer()); }} />
          </TouchableOpacity>
          <View style={{ height: "100%", justifyContent: 'center', alignItems: 'center', minWidth: 40 }}>
            <Title style={[{ color: 'white', textAlign: 'center', fontSize: 23 }]}>Google Map</Title>
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
        <View>

            <View style={styles.container}>

                {get === true &&
                    this.MapComponent()
                }
            </View>
            
        </View>
        </View>

    );
}
// uzair
MapComponent() {
    const { coordinate_lat, coordinate_lng, positionx, positiony, coordinate, where, location, get } = this.state
    console.log('cordinates***', where);
    return (
      
        <MapView
            // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            region={{
                latitude: where.lat,
                longitude: where.lng,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            }}
        >
            <MapView.Marker
                draggable
                coordinate={{
                    latitude: where.lat,
                    longitude: where.lng,
                }}
                onDragEnd={e => this.setState({
                    where: { lat: e.nativeEvent.coordinate.latitude, lng: e.nativeEvent.coordinate.longitude }
                })}
            />

        </MapView>
    )
}

//uzair


//   render() {
//     let postsList = [];
//     const { coordinate_lat, coordinate_lng, positionx, positiony, coordinate, where, location, get } = this.state
//     this.props.posts.forEach(value => {
//       postsList.push(value);
//     });

//     return (
//       <Container>
//         <Header style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
//           <TouchableOpacity style={{ height: '100%', width: 40, alignItems: 'center', justifyContent: 'center' }}
//             onPress={() => {
//               this.props.navigation.dispatch(DrawerActions.toggleDrawer());
//             }}
//           >
//             <Icon style={[{ color: 'white', }]} name='menu' onPress={() => { this.props.navigation.dispatch(DrawerActions.toggleDrawer()); }} />
//           </TouchableOpacity>
//           <View style={{ height: "100%", justifyContent: 'center', alignItems: 'center', minWidth: 40 }}>
//             <Title style={[{ color: 'white', textAlign: 'center', fontSize: 23 }]}>Google Map</Title>
//           </View>
//           <TouchableOpacity style={{ height: '100%', width: 40, alignItems: 'center', justifyContent: 'center' }}
//             onPress={() => {
//               this.props.navigation.navigate('SearchPosts');
//             }}
//           >
//             <Icon
//               style={[{ color: 'white' }]}
//               name="search"
//               onPress={() => {
//                 this.props.navigation.navigate('SearchPosts');
//               }}
//             />
//           </TouchableOpacity>
//         </Header>
//         <MapView
//           style={{ flex: 1 }}
//           customMapStyle={MapStyle}
//           initialRegion={{
//             latitude: where.lat,
//             longitude: where.lng,
//             latitudeDelta: 0.015,
//             longitudeDelta: 0.0121,
//           }}
//         >
//           {postsList.map((item, index) => {
//             console.log("loading items", item);
//             return (
//               <MapView.Marker
//                 style={{ width: 40, height: 53 }}
//                 anchor={{ x: 0.2, y: 0.5 }}
//                 key={index}
//                 coordinate={{ latitude: item.lat, longitude: item.lng }}
//                 title={item.title}
//                 pinColor="#b90009"
//                 tracksViewChanges={true}
//               >
//                { Platform.OS === "ios" && <ImageBackground source={require("../../assets/map-marker.png")} resizeMode="contain" style={{ height: "100%", width: "100%" }}>

//                 </ImageBackground>}
//                 <MapView.Callout
//                   onPress={() => {
//                     console.log("marker pressed");
//                     this.props.navigation.navigate("PostDetails", {
//                       post: item
//                     });
//                   }}
//                 >
//                   <View style={{ width: 120, minHeight: 30, flexWrap: "wrap" }}>
//                     <Text style={{ color: "rgb(115, 114, 119)", fontSize: 16, fontWeight: "bold", marginBottom: 5, }}>{item.title}</Text>
//                     <Text style={{ color: "rgb(115, 114, 119)", fontSize: 13, textAlign: "justify", }}>{item.description}</Text>
//                     <Text style={{ color: "#BDBEBF", fontSize: 10, textAlign: "right", textDecorationLine: 'underline' }}>Read More</Text>
//                   </View>
//                 </MapView.Callout>
//               </MapView.Marker>
//             );
//           })}
//         </MapView>
//       </Container>

//     );
//   }
}


const styles = StyleSheet.create({
  container: {
      ...StyleSheet.absoluteFillObject,
      height: 750,
      width: 400,
      // justifyContent: 'flex-end',
      // alignItems: 'center',
  },
  map: {
      ...StyleSheet.absoluteFillObject,
  },
  buton: {
      alignItems: 'center',
      backgroundColor: '#2980b9',
      justifyContent: 'space-around',
      // width: 80,
      height: 40
      // justifyContent: 'space-between',
  },
  ButtonText: {
      fontWeight: 'bold',
      color: "#ffff",
      // alignItems:'center'
      fontSize: 20
  },

});
const mapStateToProps = state => {
  return {
    posts: state.posts.posts
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ loadPostsAction }, dispatch);
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GoogleMapScreen);
