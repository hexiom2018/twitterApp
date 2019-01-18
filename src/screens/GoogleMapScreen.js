import React, { Component } from "react";
import {
  Image,
  ImageBackground,
  WebView,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform
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
class GoogleMapScreen extends Component {
  state = {
    extraData: false
  };

  static navigationOptions = {
    drawerLabel: "GoogleMap",
    header: null
  };

  render() {
    let postsList = [];

    this.props.posts.forEach(value => {
      postsList.push(value);
    });

    return (
      <Container>
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
        <MapView
          style={{ flex: 1 }}
          customMapStyle={MapStyle}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        >
          {postsList.map((item, index) => {
            console.log("loading items", item);
            return (
              <MapView.Marker
                style={{ width: 40, height: 53 }}
                anchor={{ x: 0.2, y: 0.5 }}
                key={index}
                coordinate={{ latitude: item.lat, longitude: item.lng }}
                title={item.title}
                pinColor="#b90009"
                tracksViewChanges={true}
              >
               { Platform.OS === "ios" && <ImageBackground source={require("../../assets/map-marker.png")} resizeMode="contain" style={{ height: "100%", width: "100%" }}>

                </ImageBackground>}
                <MapView.Callout
                  onPress={() => {
                    console.log("marker pressed");
                    this.props.navigation.navigate("PostDetails", {
                      post: item
                    });
                  }}
                >
                  <View style={{ width: 120, minHeight: 30, flexWrap: "wrap" }}>
                    <Text style={{ color: "rgb(115, 114, 119)", fontSize: 16, fontWeight: "bold", marginBottom: 5, }}>{item.title}</Text>
                    <Text style={{ color: "rgb(115, 114, 119)", fontSize: 13, textAlign: "justify", }}>{item.description}</Text>
                    <Text style={{ color: "#BDBEBF", fontSize: 10, textAlign: "right", textDecorationLine: 'underline' }}>Read More</Text>
                  </View>
                </MapView.Callout>
              </MapView.Marker>
            );
          })}
        </MapView>
      </Container>

    );
  }
}

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
