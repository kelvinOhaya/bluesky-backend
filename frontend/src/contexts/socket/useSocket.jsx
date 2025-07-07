import { useContext } from "react";
import socketContext from "./socketContext";

const useSocket = () => useContext(socketContext);

export default useSocket;
