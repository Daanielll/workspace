import { useContext } from "react";
import { UserContext } from "../context/userContext";
import Login from "./login/Login";
import App from "../App";

const ConditionalRender = () => {
  const { user } = useContext(UserContext);
  console.log(user);
  if (user) {
    return <App />;
  } else {
    return <Login />;
  }
};

export default ConditionalRender;
