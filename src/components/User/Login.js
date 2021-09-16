import React from 'react';
import axios from 'axios';
import {useState,useRef} from 'react'
import CancelIcon from '@material-ui/icons/Cancel';

const Login = (props) => {
    const[success,setSuccess] = useState(false)
    const[failure,setFailure] = useState(false)
    
    const nameRef = useRef();    
    const passwordRef = useRef();

    const handleSubmit = async(e) => {
        e.preventDefault();
        const User = {
            username:nameRef.current.value,           
            password:passwordRef.current.value
        };
                
        try{
            const res = await axios.post('/users/login', User)
            console.log('>>>>>>>>>>',res.data)            
            props.setCurrentUser(res.data)
            setFailure(false)
            setSuccess(true)
            nameRef.current.value = ''
            passwordRef.current.value = ''

            props.loginCloseClick()
        }catch(err){
            setFailure(true)
            setSuccess(false)
            nameRef.current.value = ''
            passwordRef.current.value = ''
        }

    }
    
    return (
        <div className='loginContainer'>
            <div className='logo'>
                <img src='http://maps.google.com/mapfiles/ms/icons/purple-dot.png' /> Login Page
            </div>
            <CancelIcon className='cancelBtn' onClick={props.registerCloseClick} />
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='Username' ref={nameRef}/>
                
                <input type='password' placeholder='password' ref={passwordRef}/>
                <button className='registerBtn' type='submit'>Login</button>
                {success && <span className='success'>Successfull .. you can login now!</span>}
                
                {failure && <span className='failure'>Somrthing went wrong</span>}
            </form>
            
        </div>
    )
}

export default Login
