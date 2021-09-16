import axios from 'axios'
import React, {useState,useRef} from 'react'
import CancelIcon from '@material-ui/icons/Cancel';
import './register.css'
const Register = (props) => {
    const[success,setSuccess] = useState(false)
    const[failure,setFailure] = useState(false)
    
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async(e) => {
        e.preventDefault();
        const newUser = {
            username:nameRef.current.value,
            email:emailRef.current.value,
            password:passwordRef.current.value
        };
                
        try{
            const res = await axios.post('/users/register', newUser)            
            props.setCurrentUser(res.data)
            setFailure(false)
            setSuccess(true)
            nameRef.current.value = ''
            emailRef.current.value = ''
            passwordRef.current.value = ''
            props.registerCloseClick()
        }catch(err){
            setFailure(true)
            setSuccess(false)
            nameRef.current.value = ''
            emailRef.current.value = ''
            passwordRef.current.value = ''
        }

    }
    

    return (
        <div className='registerContainer'>
            <div className='logo'>
                <img src='http://maps.google.com/mapfiles/ms/icons/purple-dot.png' /> Add New Pin
            </div>
            <CancelIcon className='cancelBtn' onClick={props.registerCloseClick} />
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='Username' ref={nameRef}/>
                <input type='email' placeholder='email' ref={emailRef}/>
                <input type='password' placeholder='password' ref={passwordRef}/>
                <button className='registerBtn' type='submit'>Register</button>
                {success && <span className='success'>Successfull .. you can login now!</span>}
                
                {failure && <span className='failure'>Somrthing went wrong</span>}
            </form>
            
        </div>
    )
}

export default Register
