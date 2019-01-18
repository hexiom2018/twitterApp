import React,{Component} from 'react';
import {View,WebView,SafeAreaView} from 'react-native';
import {Container,Content,Form,Item,Input,Button, Text} from 'native-base';

export default class PrivacyPolicy extends Component{
    state={
        name:'',
        email:'',
        description:''
    }

    submit = ()=>{
        if (this.state.name.length <= 0 ){
            alert("please type your name")
            return 
        }else if(this.state.email.length <= 0 || !this.state.email.search('@')){
            alert("please type correct email")
            return 
        }else if (this.state.description.length <= 0){
            alert("please type description")
        return
        }
        
    }

    render(){
        return (
          <SafeAreaView style={{flex:1,}}>
          <Container>
              
                  <Form>
                      <Item fixedLabel placeholderLabel='name'>
                      <Input  value={this.state.name} onChangeText={(text)=>{this.setState({name:text})}} />
                      </Item>
                      <Item fixedLabel placeholderLabel='email'>
                      <Input  value={this.state.email} onChangeText={(text)=>{this.setState({email:text})}}/>
                      </Item>
                      <Item fixedLabel placeholderLabel='description'>
                      <Input value={this.state.description} onChangeText={(text)=>{this.setState({description:text})}}/>
                      </Item>
                  </Form>
              
              <Button><Text>Submit</Text></Button>
          </Container>
          </SafeAreaView>
        )
    }
}