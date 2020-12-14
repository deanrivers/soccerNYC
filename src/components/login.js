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

    const [displaySignUpScreen,updateDisplaySignUpScreen] = useState(false)

    // Handle user state changes
    const onAuthStateChanged = user =>{

        setUser(user);
        if (initializing) setInitializing(false);
    }

    //listen to email
    const onEmailChange = (e) =>{
        
    }

    const loginPressed = () =>{


        //check if email and password is valid



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
    },[email,password])

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
                <TextInput
                    style={[styles.textFields,{borderColor:emailValid?colors.white:'red'}]}
                    maxLength={40}
                    onChangeText={text=>updateEmail(text)}
                    autoCapitaliz='none'
                />
            </View>
            
            <View>
                <Text
                    style={styles.subHeaders}
                >Password</Text>
                <TextInput
                    style={[styles.textFields,{borderColor:passwordValid?colors.white:'red'}]}
                    maxLength={40}
                    onChangeText={text=>updatePassword(text)}
                    password={true}
                    password
                    secureTextEntry={true}
                />
            </View>
            
        </View>
        
        

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={()=>loginPressed()}>
                <Text>SIGN IN</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.signUpButton} onPress={()=>signUpPressed()}>
                <Text style={{
                    color:colors.white,
                }}>SIGN UP</Text>
            </TouchableOpacity> */}
            <View style={{
                flex:1,
                // backgroundColor:'red',
                justifyContent:'center',
                alignItems:'center'
            }}>
                <Text style={{color:colors.white}}>Don't have an account? </Text>
                <TouchableOpacity onPress={()=>Actions.signup()}><Text style={{color:colors.white,textDecorationLine:'underline',fontWeight:'bold'}}>Sign Up</Text></TouchableOpacity>
                            
                            
                
            </View>
            
            {/* <Button 
                title="Sign Up"
                style={{
                    fontSize:23,
                    
                }}
                color={colors.white}
                accessibilityLabel="Sign Up Button"
            /> */}
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