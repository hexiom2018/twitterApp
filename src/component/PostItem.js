import React,{Component} from 'react';
import {} from 'react-native';
import { View, Thumbnail ,} from 'native-base';
import PropTypes from 'prop-types';

export default class PostItem extends Component{
    render(){
        return (
            <View style={styles.container}>
               <Thumbnail  source={{url:this.props.url}}/>
               <View style={styles.bottomView}></View> 
            </View>
        )
    }
}


Post.prototypes = {
    url:PropTypes.string.isRequired,

} 
const styles = StyleSheet.create({
    container:{

    },
    bottomView:{
        
    },
})

