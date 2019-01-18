import React, { Component } from 'react';
import { FlatList, ImageBackground, TouchableOpacity, SafeAreaView } from 'react-native';
import {
  Container,
  Text,
  List,
  Icon,
  ListItem,
  Thumbnail,
  View,
  Header,
  Body,
  Left,
  Right,
  Title,
} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DrawerActions } from 'react-navigation';
import LocationPermissions from './LocationPermissions';
import {
  loadPostsAction,
  postsNewerThanIdAction,
  postsSinceIdAction,
  subscribeToPostsAction,
  unsbuscribeFromPostsAction,
} from '../actions/PostsActions';

class HomePostsScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Posts',
    header: null,
  };
  state = {
    refreshing: false,
    permissionReady: false,
  };

  async componentDidMount() {
    this.props.loadPostsAction();
    this.props.subscribeToPostsAction();
  }

  componentWillUnmount() {
    this.props.unsbuscribeFromPostsAction();
  }

  _loadNewerPosts = async () => {
    this.props.loadPostsAction();
  };
  _loadOlderPosts = async () => {
    this.props.postsSinceIdAction();
  };

  _keyExtractor = (item, index) => index;

  permissionSuccess = () => {
    this.setState({ permissionReady: true })
  }
  render() {
    const { refreshing } = this.state;
    let postsList = [];

    this.props.posts.forEach(value => {
      postsList.push(value);
    });

    if (!this.state.permissionReady) {
      return (<LocationPermissions onSuccess={this.permissionSuccess} />)
    }

    return (

      <Container style={[{ flex: 1, justifyContent: 'space-evenly', backgroundColor: '#f9f9f9', }]}>
        <Header style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity style={{ height: '100%', width: 40, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => {
              this.props.navigation.dispatch(DrawerActions.toggleDrawer());
            }}
          >
            <Icon
              style={[{ color: 'white' }]}
              name="menu"
              onPress={() => {
                this.props.navigation.dispatch(DrawerActions.toggleDrawer());
              }}
            />
          </TouchableOpacity>
          <View style={{ height: "100%", justifyContent: 'center', alignItems: 'center', minWidth: 40 }}>
            <Title style={[{ color: 'white', textAlign: 'center', fontSize: 23 }]}>Posts</Title>
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
        <FlatList
          contentContainerStyle={[{ margin: 5 }]}
          onEndReachedThreshold={this._loadOlderPosts}
          onRefresh={() => {
            this._loadNewerPosts();
          }}
          refreshing={refreshing}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={[
                  {
                    borderRadius: 5,
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1,
                    overflow: 'hidden',
                    width: '48%',
                    height: 175,
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    marginHorizontal: 2,
                    marginVertical: 2,
                  },
                ]}
                onPress={() => {
                  this.props.navigation.navigate('PostDetails', { post: item });
                }}>
                <ImageBackground
                  style={[{ width: '100%', height: 200 }]}
                  resizeMethod="resize"
                  resizeMode="cover"
                  source={{ uri: item.mediaUri }}>
                  <View
                    style={[
                      {
                        minHeight: 48,
                        width: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        position: 'absolute',
                        bottom: 0,
                      },
                    ]}>
                    <View style={{
                      width: '100%',
                      minHeight: 30,
                      paddingLeft: 4,
                      paddingTop: 4,
                      flexWrap:'wrap'
                    }}>
                      <Text style={[{ flex: 0, fontSize: 12, fontWeight:'bold', flexGrow: 1 }]}>{item.title}</Text>
                    </View>
                    <View style={{ position: 'absolute', bottom: 0, right: 0, minWidth: 45, height: 18 }}>
                      <Text
                        style={[
                          {
                            fontSize: 12,
                            textAlignVertical: 'bottom'
                          },
                        ]}>
                        more...
                    </Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          }}
          keyExtractor={this._keyExtractor}
          data={postsList}
          numColumns={2}
        />
      </Container>

    );
  }
}

const mapStateToProps = state => {
  return {
    posts: state.posts.posts,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      loadPostsAction,
      postsNewerThanIdAction,
      postsSinceIdAction,
      subscribeToPostsAction,
      unsbuscribeFromPostsAction,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePostsScreen);
