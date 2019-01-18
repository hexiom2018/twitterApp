import React, { Component } from 'react';
import { ImageBackground, TouchableOpacity, View, FlatList } from 'react-native';
import {
    Container, Header, Left, Body, Right, Icon,
    Input, Content, Text, Item, Button, Title,
} from 'native-base';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { searchPostsByTitleAction } from '../actions/PostsActions';
class SearchPostsScreen extends Component {
    static navigationOptions = {
        header: null,
    }
    state = {
        search: '',
        posts: []
    }

    _keyExtractor = (item, index) => item.key;
    submitSearch = () => {
        const { search } = this.state
        this.props.searchPostsByTitleAction(search)
    }

    render() {


        return (
            <Container>
                <Header style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }} searchBar>
                    <TouchableOpacity style={{ height: '100%', width: "10%", alignItems: 'center', justifyContent: 'center' }}
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
                    <View style={{ height: "100%", justifyContent: 'center', alignItems: 'center', width: "80%" }}>
                        <Item>
                            <Icon style={{ color: '#dd0005' }} name="ios-search" />
                            <Input style={[{ color: '#dd0005' }]} placeholder="Search" placeholderTextColor='#dd0005' onChangeText={(text) => { this.setState({ search: text }) }} />
                        </Item>
                    </View>
                    <TouchableOpacity style={{ height: '100%', width: "10%", alignItems: 'center', justifyContent: 'center' }}
                        onPress={this.submitSearch}
                    >
                        <Icon
                            style={[{ color: 'white' }]}
                            name="ios-search"
                            onPress={this.submitSearch}
                        />
                    </TouchableOpacity>
                </Header>
                <Content>
                    <FlatList
                        contentContainerStyle={[{ margin: 5 }]}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity style={[{ borderRadius: 5, borderColor: 'rgba(52, 52, 52, 0.1)', borderWidth: 1, overflow: 'hidden', width: '48%', height: 200, alignItems: 'flex-end', justifyContent: 'flex-end', marginHorizontal: 2, marginVertical: 2, }]} onPress={() => { this.props.navigation.navigate('PostDetails', { post: item }) }}>
                                    <ImageBackground style={[{ width: '100%', height: 200, }]} resizeMode='cover' source={{ uri: item.mediaUri }}>
                                        <View style={[{ height: 48, width: '100%', backgroundColor: 'rgba(52, 52, 52, 0.5)', position: 'absolute', bottom: 0, left: 0, }]}>
                                            <Text style={[{ fontSize: 12 }]}>{item.title}</Text>
                                            <Text style={[{ fontSize: 12, position: 'absolute', bottom: 0, right: 0, }]}>more...</Text>
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            )

                        }}
                        keyExtractor={this._keyExtractor}
                        data={this.props.searchPosts.posts}
                        numColumns={2}
                    />
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    searchPosts: state.searchPosts
})
const mapActionsToProps = (dispatch) => (bindActionCreators({ searchPostsByTitleAction }, dispatch))
export default connect(mapStateToProps, mapActionsToProps)(SearchPostsScreen)