import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import PropTypes from 'prop-types'

//"Middleware for protected routes"
//"Checks if the user's 'token' has 'expired' yet. If it hasn't, take the user to the protected route. If it has, send them to the login page,  "
const  ProtectedRoute = ({children}) => {
    const { token } = useAuth()//get the token property from the authProvider
    const sessionDuration = 5*1000*60*60// time before cookie expires in hours (currently 5 hours)
    const now = Date.now()//time in ms since epoch

    if ( !token || token.createdAt + sessionDuration < now) {
        localStorage.removeItem("token")
        return <Navigate to='/login' />
    } else return children
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute