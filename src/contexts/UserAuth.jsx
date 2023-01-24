import { createContext, useContext } from "react";
const UserAuthContext = createContext({
    isLoggedIn: false,
    user: null,
});
export { UserAuthContext, useContext };
