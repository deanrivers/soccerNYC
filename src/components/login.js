import React, {useState,useEffect} from 'react'
import {View,Dimensions,StyleSheet,Text,TextInput,Button,TouchableOpacity,Image,Animated} from 'react-native'
import auth from '@react-native-firebase/auth';
import {colors} from '../styles/styles'
import {Actions, Reducer} from 'react-native-router-flux'
import logoImage from '../assets/icons/logo.png'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Login = () =>{

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
    const [email,updateEmail] = useState('')
    const [emailValid,updateEmailValid] = useState(true)
    const [password,updatePassword] = useState('')
    const [passwordValid,updatePasswordValid] = useState(true)
    const [loginButtonPressed,updateLoginButtonPressed] = useState(false)

    const [displaySignUpScreen,updateDisplaySignUpScreen] = useState(false)

    // Handle user state changes
    const onAuthStateChanged = user =>{
        setUser(user);
        if (initializing) setInitializing(false);
    }

    const onEmailChange = e =>{
        console.log('Email change ->',e)
        updateEmail(e.toLowerCase())
    }

    const onPasswordChange = e =>{
        console.log('Password change ->',e)
    }

    const loginPressed = () =>{

        updateLoginButtonPressed(true)

        //there must be an email and password value
        if(email == '' || email == ' ') updateEmailValid(false)
        else updateEmailValid(true)
        if(password == '' || password == ' ') updatePasswordValid(false)
        else updatePasswordValid(true)

        //if email and password have a value...try and sign in to firebase
        if(emailValid && passwordValid){
            auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log('User has signed in!');
                Actions.main()
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                    updateEmailValid(false)
                }
            
                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                    updateEmailValid(false)
                }
                //password
                if(error.code == 'auth/user-not-found'){
                    console.log('auth/user-not-found')
                    updatePasswordValid(false)
                }
                if(error.code == 'auth/wrong-password'){
                    console.log('auth/user-not-found')
                    updatePasswordValid(false)
                }
                alert(error.code)
                console.error(error);
            });
        } 

        
    }



    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        console.log('sub',subscriber)
        return subscriber; // unsubscribe on unmount
    }, [])

    useEffect(()=>{
        console.log('Listening to email and pw => ',email,password)
        if(email) updateEmailValid(true)
        else updateEmailValid(false)
        if(password) updatePasswordValid(true)
        else updatePasswordValid(false)
    },[email,password])



    //determine if the login button has been pressed at least once.
    // if not....the borders should not be red
    let emailInput = loginButtonPressed?<TextInput
                                            style={[styles.textFields,{borderColor:emailValid?colors.white:'red'}]}
                                            maxLength={40}
                                            onChangeText={(e)=>onEmailChange(e)}
                                            autoCapitaliz='none'
                                            value={email}
                                        />:<TextInput
                                        style={[styles.textFields,{borderColor:colors.white}]}
                                        maxLength={40}
                                        onChangeText={(e)=>onEmailChange(e)}
                                        autoCapitaliz='none'
                                        value={email}
                                    />

    let passwordInput = loginButtonPressed?<TextInput
                                                style={[styles.textFields,{borderColor:passwordValid?colors.white:'red'}]}
                                                maxLength={40}
                                                onChangeText={text=>updatePassword(text)}
                                                password={true}
                                                secureTextEntry={true}
                                            />:<TextInput
                                                style={[styles.textFields,{borderColor:colors.white}]}
                                                maxLength={40}
                                                onChangeText={text=>updatePassword(text)}
                                                password={true}
                                                secureTextEntry={true}
                                            />


    let emailLogin = 
    <View style={styles.emailLogin}>
        <View style={styles.logoContainer}>
            <Image style={{width:80,height:80}} source={logoImage}/>
            <Text
                style={{
                    fontWeight:'bold',
                    color:colors.white,
                    fontFamily:'DamascusLight',
                    paddingTop:'5%'
                }}
            >Soccer NYC</Text>
        </View>

        <View style={styles.textFieldsContainer}>
            <View>
                <Text
                    style={styles.subHeaders}
                >Email</Text>
                {emailInput}
            </View>
            
            <View>
                <Text
                    style={styles.subHeaders}
                >Password</Text>
                {passwordInput}
            </View>
            
        </View>
        
        

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={()=>loginPressed()}>
                <Text>SIGN IN</Text>
            </TouchableOpacity>
            <View style={{
                flex:1,
                justifyContent:'center',
                alignItems:'center'
            }}>
                <Text style={{color:colors.white}}>Don't have an account? </Text>
                <TouchableOpacity onPress={()=>Actions.signup()}><Text style={{color:colors.white,textDecorationLine:'underline',fontWeight:'bold'}}>Sign Up</Text></TouchableOpacity>
            </View>
        </View>

    </View>

    // let render = user?Actions.main():emailLogin
    let render = emailLogin

    return(
        <View style={styles.loginContainer}>
            {render}
        </View>
    )
}

const styles = StyleSheet.create({
    loginContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'black',
        alignItems:'center',
    },
    logoContainer:{
        flex:1,
        // backgroundColor:'red',
        justifyContent:'center',
        alignItems:'center',
        color:'white'
    },  
    titleContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'black'
    },  
    mainRender:{

    },
    emailLogin:{
        flex:1,
        justifyContent:'center',
        // backgroundColor:'orange',
        // height:windowHeight/1.5,
        width:windowWidth/1.3

    },
    subHeaders:{
        // marginTop:30,
        // paddingLeft:10,
        fontWeight:'bold',
        color:colors.white,
        fontFamily:'DamascusLight',
    },
    textFields:{
        borderColor:colors.white,
        borderWidth:3,
        borderRadius:0,
        color:'white',
        padding:10,
        fontWeight:'bold',
        fontSize:20
    },
    textFieldsContainer:{
        flex:1,
        justifyContent:'center',
        // alignItems:'center',
        // backgroundColor:'green',
        justifyContent:'space-evenly'
    },
    buttonContainer:{
        flex:1,
        // backgroundColor:'blue',
        justifyContent:'flex-start',

    },
    button:{
        backgroundColor:colors.white,
        // flex:1,
        justifyContent:'center',
        alignItems:'center',
        padding:10,
        marginTop:10
    },
    
})

export default Login