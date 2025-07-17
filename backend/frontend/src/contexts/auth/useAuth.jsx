import { useContext } from "react";
import AuthContext from "./AuthContext";

//Custom hook that provides authentication context to the child elements
const useAuth = () => useContext(AuthContext);
export default useAuth;
