import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { firebaseUser } = useContext(UserContext);
  return !!firebaseUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;