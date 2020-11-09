import React, {useState,useEffect} from 'react'
import {View,Dimensions,StyleSheet,Text,TextInput,Button,TouchableOpacity,Image,Animated} from 'react-native'
import imageBack from '../assets/icons/back2.png'
import {Actions, Reducer} from 'react-native-router-flux'
import {colors} from '../styles/styles'
import logoImage from '../assets/icons/logo.png'
import auth from '@react-native-firebase/auth';
// import imageBack from '../components'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SignUp = () =>{

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
    const [name,updateName] = useState('')
    const [email,updateEmail] = useState('')
    const [password,updatePassword] = useState('')


    const [passwordValid,updatePasswordValid] = useState(true)
    const [nameValid,updateNameValid] = useState(true)
    const [emailValid,updateEmailValid] = useState(true)

    const signupPressed = () =>{
        //password Minimum eight characters, at least one letter and one number

        let regName = /^[A-Za-z]+((\s)?([A-Za-z])+)*$/
        let regEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let regPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

        let nameValid = false
        let emailValid = false
        let passwordValid = false

        //determine validity
        if(regName.test(name)&&name!==''&&name!==' ') nameValid= true
        else nameValid = false

        if(regEmail.test(email)&&email!==''&&email!==' ') emailValid= true
        else emailValid = false

        if(regPassword.test(password)&&password!==''&&password!==' ') passwordValid= true
        else passwordValid = false

        //adjust states
        if(!nameValid) updateNameValid(false)
        else updateNameValid(true)

        if(!emailValid) updateEmailValid(false)
        else updateEmailValid(true)

        if(!passwordValid) updatePasswordValid(false)
        else updatePasswordValid(true)

        //submit if everything is valid
        if(nameValid&&emailValid&&passwordValid){
            auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
              console.log('User account created & signed in!');
            })
            .catch(error => {
              if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
              }
          
              if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
              }
              console.error(error);
            });
        }

        console.log(name,nameValid)
        console.log(email,emailValid)
        console.log(password,passwordValid)

    }

    const onAuthStateChanged = user =>{
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        console.log('sub',subscriber)
        return subscriber; // unsubscribe on unmount
    }, [])

    

    let backButtonRender = <View
                                style={{
                                    position:'absolute',
                                    top:15,
                                    left:15,
                                    zIndex:100,
                                    backgroundColor:'black',
                                    borderRadius:100,
                                    padding:5
                                }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={()=>Actions.pop()}
                                >
                                    <Image 
                                        source={imageBack}
                                        style={{
                                            width:30,
                                            height:30,
                                            right:2
                                        }}
                                    />
                                </TouchableOpacity>

                            </View>

 let signUpRender = 
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
         <View style={{marginBottom:'10%'}}>
             <Text
                 style={styles.subHeaders}
             >Name</Text>
             <TextInput
                 style={[styles.textFields,{borderColor:nameValid?colors.white:'red'}]}
                 maxLength={40}
                 onChangeText={text=>updateName(text)}
             />
         </View>
         <View style={{marginBottom:'10%'}}>
             <Text
                 style={styles.subHeaders}
             >Email</Text>
             <TextInput
                 style={[styles.textFields,{borderColor:emailValid?colors.white:'red'}]}
                 maxLength={40}
                 onChangeText={text=>updateEmail(text)}
             />
         </View>
         
         <View style={{marginBottom:'10%'}}>
             <Text
                 style={styles.subHeaders}
             >Password (8 characters. 1 letter. 1 number)</Text>
             <TextInput
                 style={[styles.textFields,{borderColor:passwordValid?colors.white:'red'}]}
                 maxLength={40}
                 onChangeText={text=>updatePassword(text)}
                 password
                 secureTextEntry={true}
             />
         </View>
         
     </View>
     
     

     <View style={styles.buttonContainer}>
         <TouchableOpacity style={styles.button} onPress={()=>signupPressed()}>
             <Text>SIGN UP</Text>
         </TouchableOpacity>

         <View style={{
             flex:1,
             justifyContent:'center',
             alignItems:'center'
         }}>
             <Text style={{color:colors.white}}>Already have an account? </Text>
             <TouchableOpacity onPress={()=>Actions.pop()}><Text style={{color:colors.white,textDecorationLine:'underline',fontWeight:'bold'}}>Sign In</Text></TouchableOpacity>
         </View>
     </View>

 </View>

 let render = user?<TouchableOpacity style={styles.button} onPress={()=>logoutPressed()}>
 <Text>LOGOUT</Text>
</TouchableOpacity>:signUpRender

 return(
     <View style={styles.loginContainer}>
         {backButtonRender}
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
        // borderColor:colors.white,
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

export default SignUp