import React, { Component } from "react";
import {
  Image,
  FlatList,
  Share,
  TouchableOpacity,
  Animated,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from "react-native";
import {
  Container,
  Header,
  Left,
  Icon,
  Body,
  Right,
  View,
  Input,
  Content,
  Text,
  List,
  ListItem,
  Thumbnail,
  Title,
  Button
} from "native-base";
import { reduxForm } from "redux-form";
import { bindActionCreators } from "redux";
import moment from "moment";
import Expo from "expo";
import { connect } from "react-redux";
import {
  addCommentAction,
  dislikePostAction,
  likePostAction,
  likeCommentAction,
  dislikeCommentAction,
  getPostCommentsAction,
  mountCurrentPost,
  unmountCurrentPost,
  sharePostAction
} from "../actions/PostsActions";
import PostActions from "../component/PostActions";

const { height } = Dimensions.get("screen")

class PostDetailsScreen extends Component {
  constructor() {
    super();
    this.state = {
      location: "",
      date: undefined,
      likePost: false,
      animation: new Animated.Value(),
      animationInput: new Animated.Value(),
      androidImageHeight: new Animated.Value(),
      descriptionExpanded: false,
    };

    this.comment = {};
    this.keyboardHeight = 0;
  }
  static navigationOptions = {
    header: null
  };

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  _keyboardDidHide = () => {
    // this.chaneState(e.endCoordinates.height)

    if (Platform.OS === "android") {
      this.state.androidImageHeight.setValue(50); //Step 3
      Animated.spring(
        //Step 4
        this.state.androidImageHeight,
        {
          toValue: height * 0.3
        }
      ).start(() => {
      });
    }
    else {
      this.state.animationInput.setValue(this.keyboardHeight); //Step 3
      Animated.spring(
        //Step 4
        this.state.animationInput,
        {
          toValue: 0
        }
      ).start(() => {
      });
    }


  }

  _keyboardDidShow = (e) => {
    switch (Platform.OS) {
      case "android":
        this.state.androidImageHeight.setValue(height * 0.3); //Step 3
        Animated.spring(
          //Step 4
          this.state.androidImageHeight,
          {
            toValue: 50
          }
        ).start(() => {
          this.state.descriptionExpanded && this.toggoleDescription()
        });
        break;
      case "ios":
        this.keyboardHeight = e.endCoordinates.height;
        this.state.animationInput.setValue(0); //Step 3
        Animated.spring(
          //Step 4
          this.state.animationInput,
          {
            toValue: this.keyboardHeight
          }
        ).start(() => {
        });
        break;
    }

    // this.chaneState(0)
  }

  // chaneState(keyboardHeight) {
  //   this.setState({ keyboardHeight })
  // }

  async componentDidMount() {

    this.state.animation.setValue(70);
    this.state.animationInput.setValue(0);
    this.state.androidImageHeight.setValue(height * 0.3);

    const { post } = this.props.navigation.state.params;
    try {
      await this.props.getPostCommentsAction(post.postId);
      const location = await Expo.Location.reverseGeocodeAsync({
        latitude: post.lat,
        longitude: post.lng
      });
      this.setState({
        location: location[0],
        date: moment(post.date).format("LL")
      });
    } catch (error) {
      console.error(error);
    }


    this.props.mountCurrentPost(post, post.postId, this.props.userInfo.userId);
  }

  componentWillUnmount() {
    this.props.unmountCurrentPost();
  }

  toggoleDescription = () => {
    if (!this.state.descriptionExpanded) {
      this.state.animation.setValue(70); //Step 3
      Animated.spring(
        //Step 4
        this.state.animation,
        {
          toValue: 180
        }
      ).start(() => {
      });
      this.setState({ descriptionExpanded: true });
    } else {
      this.state.animation.setValue(180); //Step 3
      Animated.spring(
        //Step 4
        this.state.animation,
        {
          toValue: 70
        }
      ).start(() => {
      });
      this.setState({ descriptionExpanded: false });
    }
  };
  onLikePress = async () => {
    if (this.state.likePost) {
      try {
        const { postId } = this.props.navigation.state.params.post;
        const userId = this.props.userInfo.userId;
        await this.props.dislikePostAction(postId, userId);
        this.setState({ likePost: !this.state.likePost });
      } catch (error) { }
    } else {
      //like the post
      try {
        const { postId } = this.props.navigation.state.params.post;
        const userId = this.props.userInfo.userId;
        await this.props.likePostAction(postId, userId);
        this.setState({ likePost: !this.state.likePost });
      } catch (error) { }
    }
  };

  likeComment = async item => {
    const { postId } = this.props.navigation.state.params.post;
    const { commentId } = item;
    const userId = this.props.userInfo.userId;
    await this.props.likeCommentAction(postId, commentId, userId);
  };
  dislikeComment = async item => {
    const { postId } = this.props.navigation.state.params.post;
    const { commentId } = item;
    const userId = this.props.userInfo.userId;
    await this.props.dislikeCommentAction(postId, commentId, userId);
  };
  onChangeTextComment = text => {
    this.setState({ newComment: text });
  };
  onSubmitComment = async () => {
    if (this.state.newComment.length === 0) {
      alert("please type your comment");
      return;
    }
    const { post } = this.props.navigation.state.params;
    const { newComment } = this.state;
    const { userId } = this.props.userInfo;
    try {
      await this.props.addCommentAction(post.postId, userId, newComment);
      this.setState({ newComment: "" });
    } catch (error) {
      alert("error while submit your comment!");
    }
  };

  onSharePressed = async () => {
    const { post } = this.props.navigation.state.params;
    const reult = await Share.share({
      message: post.description,
      url: post.mediaUri,
      title: "Digit Mania"
    });
    this.props.sharePostAction(post.postId, this.props.userInfo.userId);
  };

  commentImagePicker = async () => {
    try {
      const result = await Expo.ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        allowsEditing: false
      });
    } catch (error) {
      alert("Cannot open galary");
    }
  };
  _keyExtractor = (item, index) => index.toString();

  safelyHumanizeDate(date) {
   
    if (!date) {
      return "";
    }

    // return moment.duration(moment(new Date(date))).humanize();
    return moment(new Date(date)).fromNow();    
  }
  render() {
    const { post } = this.props.navigation.state.params;
    // console.log(post);

    const { postLikesCount, postSharesCount } = this.props.currentPost;
    return (
      <Container style={[{ flex: 1, backgroundColor: "#f9f9f9" }]}>
        <Header style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity style={{ height: '100%', width: 40, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => {
              this.props.navigation.pop();
            }}
          >
            <Icon
              style={[{ color: "white" }]}
              name="arrow-back"
              onPress={() => {
                this.props.navigation.pop();
              }}
            />
          </TouchableOpacity>
          <View style={{ height: "100%", justifyContent: 'center', alignItems: 'center', minWidth: 40 }}>
            <Title style={[{ color: 'white', textAlign: 'center', fontSize: 23 }]}>{post.title}</Title>
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
        <View style={{ flex: 1, justifyContent: "space-evenly" }}>
          <Animated.View style={[{
            width: "98%",
            height: Platform.OS === "ios" ? "35%" : this.state.androidImageHeight,// "35%",
            borderRadius: 5, marginTop: 5, overflow: 'hidden', alignSelf: 'center'
          }]}>
            {post.type === "image" && (
              <Image
                style={[{ width: "100%", height: "100%" }]}
                source={{ uri: post.mediaUri }}
              />
            )}

            {(post.type === "video" || post.type !== "image") && (
              <Expo.Video
                style={[{ width: "100%", height: "100%" }]}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay
                source={{ uri: post.mediaUri }}
              />
            )}

            <PostActions
              style={[
                {
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  width: "100%"
                }
              ]}
              likeCount={postLikesCount}
              sharesCount={postSharesCount}
              commentsCount={this.props.comments.get(post.postId).length}
              active={this.props.currentPost.postLikedByUser}
              onSharePressed={this.onSharePressed}
              onLikePressed={this.onLikePress}
            />
          </Animated.View>
          <View
            style={[
              { flexDirection: "row", alignItems: "center", height: "5%", justifyContent: 'space-between', paddingHorizontal: 12, width: '98%' }
            ]}
          >
            <View
              style={{ alignContent: "space-around", flexDirection: "row", alignItems: 'center' }}
            >
              <Icon
                style={[{ color: "rgb(115, 114, 119)", fontSize: 18 }]}
                type="FontAwesome"
                name="clock-o"
              />
              <Text style={[{ color: "rgb(115, 114, 119)", fontSize: 12, marginLeft: 4, }]}>
                {this.state.date}
              </Text>
            </View>
            <View
              style={{ alignContent: "space-around", flexDirection: "row", alignItems: 'center' }}
            >
              <Icon
                style={[{ color: "rgb(115, 114, 119)", fontSize: 18 }]}
                type="FontAwesome"
                name="map-marker"
              />
              <Text
                style={[
                  {
                    color: "rgb(115, 114, 119)",
                    fontSize: 12,
                    marginLeft: 4,
                  }
                ]}
              >
                {`${this.state.location.city}`}
              </Text>
            </View>
          </View>
          <View>
            <View
              style={[
                {
                  backgroundColor: "white",
                  // width:"98%",
                  padding: 10,
                  marginVertical: 4,
                  marginHorizontal: "2%",
                  shadowOpacity: 0.75,
                  borderRadius: 3,
                  shadowRadius: 5,
                  shadowColor: "#BDBEBF",
                  shadowOffset: { height: 0, width: 0 }
                }
              ]}
            >
              <Animated.View style={{ height: this.state.animation }}>
                <Text style={[{ color: "rgb(115, 114, 119)", fontWeight: "bold", marginLeft: 5 }]}>Description</Text>
                <Text style={[{ color: "rgb(115, 114, 119)" }]}>{post.description}</Text>
              </Animated.View>
            </View>
            <Button
              iconRight
              style={[
                {
                  position: "absolute",
                  bottom: -10,
                  alignSelf: "center",
                  height: 30,
                  paddingHorizontal: 15,
                  backgroundColor: "#4517FF"
                }
              ]}
              onPress={this.toggoleDescription}
            >
              <Text
                style={[{ textDecorationLine: "underline", color: "white", fontSize: 13 }]}
              >
                {this.state.descriptionExpanded ? "Less" : "More"}
              </Text>
              <Icon
                style={[{ color: "white", fontSize: 13 }]}
                type="FontAwesome"
                name={
                  this.state.descriptionExpanded ? "arrow-up" : "arrow-down"
                }
                color={"white"}
              />
            </Button>
          </View>
          <View style={[{ flex: 1, marginTop: 20, width: "98%", alignSelf: "center" }]}>
            <Text style={{ color: "rgb(115, 114, 119)", fontSize: 20, marginLeft: 5 }}>Comments</Text>
            <FlatList
              contentContainerStyle={{ padding: "2%", paddingTop: "2%" }}
              data={this.props.comments.get(post.postId)}
              keyExtractor={this._keyExtractor}
              renderItem={({ index, item }) => {
                return (
                  <View

                    style={[
                      {
                        width: '100%',
                        flexDirection: "row",
                        height: 50,
                        borderBottomWidth: 1,
                        borderBottomColor: "rgb(115, 114, 119)",
                        alignItems: "center",
                        justifyContent: 'space-between'
                      }
                    ]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', height: "100%" }}>
                      <Thumbnail
                        avatar
                        style={{ height: 46, width: 46, borderRadius: 23 }}
                        source={
                          item.photo
                            ? { uri: item.userPhoto }
                            : require("../../assets/avatar2.png")
                        }
                      />
                      <View style={[{ marginLeft: 6, height: "90%", justifyContent: "space-around", marginRight:6 }]}>
                        <Text style={[{ color: "#3d538d", fontWeight: "bold" }]}>
                          {item.name || ""}
                        </Text>
                        <Text style={[{ color: "rgb(115, 114, 119)" , width: 180}]}>
                          {item.comment}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={[{ flexDirection: "row", height: '100%', justifyContent: 'space-between', alignItems: "flex-start" }]}
                      onPress={() => {
                        this.likeComment(item);
                      }}
                    >
                      <Icon
                        style={[
                          {
                            fontSize: 16,
                            color: "green",
                            marginRight: 5
                          }
                        ]}
                        ios="ios-thumbs-up"
                        android="md-thumbs-up"
                      />
                      <Text
                        style={[
                          { color: "blue", marginTop: 5, fontSize: 15, textDecorationLine: "underline" }
                        ]}
                      >
                        {item.likesCount}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[{ flexDirection: "row", height: "100%", justifyContent: 'space-between', alignItems: "flex-start" }]}
                      onPress={() => {
                        this.dislikeComment(item);
                      }}
                    >
                      <Icon
                        style={[{
                          fontSize: 16,
                          color: "red",
                          marginRight: 5
                        }]}
                        ios="ios-thumbs-down"
                        android="md-thumbs-down"
                      />
                      <Text
                        style={[
                          {
                            color: "blue",
                            textDecorationLine: "underline",
                            marginTop: 5,
                            fontSize: 15,
                          }
                        ]}
                      >
                        {item.dislikesCount}
                      </Text>
                    </TouchableOpacity>
                    <View style={[{ justifyContent: "space-around", height: '100%', paddingTop: 6 }]}>
                      <TouchableOpacity
                        style={[{ alignSelf: "center", marginLeft: 4 }]}
                        onPress={() => { this.setState({ newComment: `@${item.name || ""}  ` }, () => this.comment.wrappedInstance.focus()) }}
                      >
                        <Text
                          style={[
                            { color: "blue", fontSize: 16, textDecorationLine: "underline" }
                          ]}
                        >
                          Reply
                        </Text>
                      </TouchableOpacity>
                      <Text style={[{ color: "#BDBEBF", fontSize: 10}]}>
                        {this.safelyHumanizeDate(item.date)}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
          </View>
          <View style={{ height: 56, width: "100%" }} />
          <Animated.View
            style={[
              {
                flexDirection: "row",
                width: "100%",
                height: 56,
                backgroundColor: "#f9f9f9",
                borderColor: "#f9f9f9",
                alignItems: 'center',
                borderWidth: 3,
                paddingHorizontal: 8,
                position: "absolute",
                bottom: Platform.OS === "ios" ? this.state.animationInput : 0
              }
            ]}
          >
            <TouchableOpacity onPress={this.commentImagePicker}>
              <Icon
                name="image"
                type="FontAwesome"
                style={[{ fontSize: 48, height: "100%", color: "rgb(115, 114, 119)", marginRight: 10 }]}
              />
            </TouchableOpacity>
            <Input
              ref={(input) => { this.comment = input; }}
              placeholderTextColor="#BDBEBF"
              placeholder="Write your comment here"
              style={[{ padding: 5, color: "rgb(115, 114, 119)" }]}
              // onFocus={() => { setTimeout(() => { this.state.descriptionExpanded && this.toggoleDescription() }, 100) }}
              onChangeText={this.onChangeTextComment}
              value={this.state.newComment}
            />
            <TouchableOpacity
              onPress={this.onSubmitComment}
              style={{ backgroundColor: '#4517FF', alignItems: "center", justifyContent: 'center', height: 50, width: 50, borderRadius: 25, overflow: "hidden" }}
            >
              <Icon
                name="send"
                style={{ fontSize: Platform.OS === "ios" ? 48 : 26, color: "#FFF" }}
                onPress={this.onSubmitComment}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Container >
    );
  }
}

const mapStateToProps = state => ({
  userInfo: state.userInfo,
  comments: state.posts.comments,
  currentPost: state.currentPost
});
const mapActionsToProps = dispatch =>
  bindActionCreators(
    {
      addCommentAction,
      likePostAction,
      dislikePostAction,
      likeCommentAction,
      dislikeCommentAction,
      getPostCommentsAction,
      mountCurrentPost,
      unmountCurrentPost,
      sharePostAction
    },
    dispatch
  );
export default connect(
  mapStateToProps,
  mapActionsToProps
)(PostDetailsScreen);
