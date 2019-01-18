import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Container, View, Text, Button, Icon } from 'native-base';
import PropTypes from 'prop-types';
import Expo from 'expo';
const isToggoleIcon = (toggleIcon, value) => {
    if (toggleIcon) {
        return toggleIcon(value)
    }
}

const ActionView = ({ count = 0, iconName, buttonText, onPress, ...rest, }) => (
    <View {...rest} style={[{ margin: 2, paddingHorizontal: 5 },]} >
        <Text style={[{marginLeft: 4, color: 'blue', textDecorationLine: 'underline', fontSize: 12 }]}>{count}</Text>
        <TouchableOpacity onPress={onPress} style={[{ flexDirection: 'row' }]}>
            <Icon style={[{ marginRight: 4, color: '#161616', fontSize: 18, alignSelf: 'flex-end', }]} type='FontAwesome' color='#161616' name={iconName} /><Text style={[{ color: '#161616', }]}>{buttonText}</Text>
        </TouchableOpacity>
    </View>
)

ActionView.propTypes = {
    count: PropTypes.number,
    iconName: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    onPress: PropTypes.func,

}


export default class PostActions extends Component {

    render() {
        const { likeCount, commentsCount, sharesCount, onLikePressed, active, onCommentPressed, onSharePressed } = this.props
        const { style } = this.props
        return (

            <View style={[{ flexDirection: 'row', }, ...style]}>
                {/* <Expo.LinearGradient
                    colors={['transparent', '#fff',]}

                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: '100%',

                    }}
                /> */}
                <View style={{ position: "absolute", width: '100%', height: '100%' }}>
                    {([...Array(100)]).map((a, i) => <View key={i} style={{
                        width: '100%',
                        height: '1%',
                        backgroundColor: `rgba(255, 255, 255, ${i / 100})`
                    }} />)}
                </View>

                <ActionView active={true} iconName={active ? 'heart' : 'heart-o'} buttonText='Like' count={likeCount} onPress={onLikePressed} />
                <ActionView iconName='comment' buttonText='Comment' count={commentsCount} onPress={onCommentPressed} />
                <ActionView iconName='share' buttonText='Share' count={sharesCount} onPress={onSharePressed} />

            </View>
        )
    }
}

PostActions.propTypes = {
    likesCount: PropTypes.number,
    commentsCount: PropTypes.number,
    sharesCount: PropTypes.number,
    onLikePressed: PropTypes.func.isRequired,
    onSharePressed: PropTypes.func,
    active: PropTypes.bool,

}


