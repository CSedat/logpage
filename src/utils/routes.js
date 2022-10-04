import Home from "../pages/Login";
import MainPage from "../pages/MainPage";

export const REDIRECT_PATH = {
  HOME: "/",
  SETTINGS: "/MainPage",
};

export const routes = [
  {
    path: REDIRECT_PATH.HOME,
    component: <Home />,
  },
  {
    path: REDIRECT_PATH.SETTINGS,
    component: <MainPage />,
  },
];