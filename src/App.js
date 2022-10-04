import { useState, useEffect } from 'react';
import './App.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./utils/routes";
import {UserAuthContext} from "./contexts/UserAuth";
import logo from './assets/polyakeynez.png';
import moment from 'moment';

export default function App() {
    const [user, setUser] = useState();
    const [clock, setClock] = useState(moment().format('HH:mm:ss DD/MM/YY'));
    const data = {
        user,
        setUser
    };

    useEffect(() => {
        setInterval(() => {
            setClock(moment().format('HH:mm:ss DD/MM/YY'));
        }, 1000);
    }, []);

    return (
        <UserAuthContext.Provider value={data}>
            <div className="h-10 px-2 flex items-center justify-between text-[#e8e8e8]  bg-[#316e8f] ">
                <img src={logo} alt="logo" className="h-8 col-start-1 col-span-1 " />
                <h1 className=" uppercase font-bold grid place-items-center col-start-2 col-span-2 ">
                    Lavvar Tesisi Veri Kayıt Sistemi
                </h1>
                <div className=" flex right-1 px-1 top-0.5 border-b border-b-black">
                    <strong>{clock}</strong>
                </div>
            </div>
            <BrowserRouter>
              <Routes>
                {routes.map((r) => (
                    <Route path={r.path} element={r.component} />
                ))}
              </Routes>
            </BrowserRouter>
        </UserAuthContext.Provider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
