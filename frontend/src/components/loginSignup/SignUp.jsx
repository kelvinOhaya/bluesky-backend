import { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../authentication/useAuth'



export default function SignUp({styles}) {
  const { signUp } = useAuth()

  //router variable that allows us to go to different components
  const navigate = useNavigate()

  //formData that will be passed to the server
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
  })

  //validation that controlls whether an error message will be shown or not
  const [isValid, setisValid] = useState({
    firstName: true,
    lastName: true,
    username: true,
    email: true,
    password: true
  })

  //error messages for each input field
  const errorMessage = {
    firstName: '*Name cannot contain numbers or symbols',
    lastName: '*Name cannot contain numbers or symbols',
    username: '*Username is already in use',
    email: '*Email is already in use',
    password: '*Password must contain at least 8 characters, 1 symbol, and 1 uppercase letter'
  }

  //stores the input the user enters into its respective property in state for formData
  const handleChange = (e) => {
    setFormData((prevFormData) => ({...prevFormData, [e.target.name]: e.target.value}))
  }



  //set input fields back to normal on reload
  useEffect(() => {

    setisValid({
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      password: true
    })
  }, [])







//send the users information to the server. If it follows all the guidelines, allow the user to enter the account. If not, turn show error messages on
  const handleSubmit = async (e) => {
    e.preventDefault()

  
    //send info to server. Either returns true, meaning a successfull login, or an object with which input fields have errors. isValid should recieve this object to show error messges
    const signUpStatus = await signUp(formData)

    if(signUpStatus.result === true) {
      console.log("success")
      navigate("/chatRoom")

    } else {
      setisValid(signUpStatus.errors)
    } 


    //reset all input fields no matter what
    const newObject = Object.keys(formData).reduce((obj, key) => {
      obj[key] = ''
      return obj
    }, {})
    
    setFormData(newObject)
    console.log("done\n", signUpStatus)
    
  }

  //The JSX 
  return (
      <div className={styles.parent}>
        <div className={styles.authContainer}>
          <h1>Sign Up</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.infoInput}>
                <label htmlFor="firstName">First Name</label>
                <input type="text" value={formData.firstName} name="firstName" id='firstName' onChange={handleChange} />
                {!isValid.firstName && <p className={styles.errorMessage}>{errorMessage.firstName}</p>}
            </div>
            <div className={styles.infoInput}>
                <label htmlFor="lastName">Last Name</label>
                <input type="text" value={formData.lastName} name="lastName" id='lastName' onChange={handleChange} />
                {!isValid.lastName && <p className={styles.errorMessage}>{errorMessage.lastName}</p>}
            </div>
            <div className={styles.infoInput}>
                <label htmlFor="email">Email</label>
                <input type="email" value={formData.email} name='email' id='email' onChange={handleChange} />
                {!isValid.email && <p className={styles.errorMessage}>{errorMessage.email}</p>}
            </div>
            <div className={styles.infoInput}>
                <label htmlFor="username">Username</label>
                <input type="text" value={formData.username} name="username" id='username' onChange={handleChange} />
                {!isValid.username && <p className={styles.errorMessage}>{errorMessage.username}</p>}
            </div>
            <div className={styles.infoInput}>
                <label htmlFor="password">Password</label>
                <input type="password" value={formData.password} name="password" id='password' autoComplete="new-password" placeholder="At least 8 chracters and 1 uppercase letter and symbol each" onChange={handleChange} />
                {!isValid.password && <p className={styles.errorMessage}>{errorMessage.password}</p>}
            </div>
            <div className={styles.submitButtons}>
                <button type="submit">Sign Up</button>
                <button type='button' onClick={() => navigate('/login')}>Login for Registered Users</button>
            </div>
          </form>
        </div>
      </div>
    )
}


