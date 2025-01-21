import {useNavigate } from 'react-router-dom'
import { useAuth } from '../authentication/useAuth'
import axios from 'axios'
import { useState } from 'react'

axios.defaults.withCredentials = true

export default function Login({styles}) {
    const {login} = useAuth()
    const navigate = useNavigate()  
    const [isValid, setIsValid] = useState(true)

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })

    //stores the value of the input fields
    const handleChange = (e) => {
        setFormData((prevFormData) => ({...prevFormData, [e.target.name]: e.target.value}))
    }

    //submits the form data to the server
    const handleSubmit = async (e) => {
        e.preventDefault()
        const loginStatus = await login(formData)

        if (loginStatus === true) {
            console.log('success')
            navigate('/chatRoom')

        } else {
            setIsValid(false)
        }

    }


    return (
    <div className={styles.parent}>
      <div className={styles.authContainer}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <div className={styles.infoInput}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" onChange={handleChange} />
            </div>
            <div className={styles.infoInput}>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" onChange={handleChange} />
                {!isValid && <p className={styles.errorMessage}>*Invalid username or password</p>}
            </div>
            <div className={styles.submitButtons}>
                <button type="submit">Login</button>
                <button type="button" onClick={() => navigate('/signUp')}>Don&#39;t have an account? Sign Up</button>
            </div>
        </form>
      </div>
    </div>
  )
}

