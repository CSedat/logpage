import { useState, useEffect } from 'react';
import './App.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./utils/routes";
import {UserAuthContext} from "./contexts/UserAuth";
import logo from './assets/polyakeynez.png';
import red_lamp from './assets/red_lamp.png';
import green_lamp from './assets/green_lamp.png';
import moment from 'moment';
import axios from 'axios';

export default function App() {
    const [user, setUser] = useState();
    const [clock, setClock] = useState(moment().format('HH:mm:ss DD/MM/YY'));
    const [plcConnection, setPlcConnection] = useState({});
    const data = {
        user,
        setUser
    };

    useEffect(() => {
        setInterval(() => {
            setClock(moment().format('HH:mm:ss DD/MM/YY'));
            axios.get("http://10.35.13.108:8001/api/getPLCConnections").then((response) => {
                setPlcConnection(response.data);
            });
        }, 1000);
    }, []);

    return (
        <UserAuthContext.Provider value={data}>
            <header className="h-10 px-2 grid grid-cols-10 items-center justify-between text-[#e8e8e8]  bg-[#316e8f] ">
                <img src={logo} alt="logo" className="h-8 col-start-1 col-span-1 " />
                <div className=' col-span-2 col-start-2 flex'>
                    <p className='flex text-xs text-center border rounded m-1 items-center'>Main CPU<img className=' h-[25px] w-[25px]' src={plcConnection.maincpu ? green_lamp : red_lamp} alt="" /></p>
                    <p className='flex text-xs text-center border rounded m-1 items-center'>Crusher CPU<img className=' h-[25px] w-[25px]' src={plcConnection.crushercpu ? green_lamp : red_lamp} alt="" /></p>
                    <p className='flex text-xs text-center border rounded m-1 items-center'>Ambar CPU<img className=' h-[25px] w-[25px]' src={plcConnection.ambarcpu ? green_lamp : red_lamp} alt="" /></p>
                    <p className='flex text-xs text-center border rounded m-1 items-center'>D609 CPU<img className=' h-[25px] w-[25px]' src={plcConnection.d609cpu ? green_lamp : red_lamp} alt="" /></p>
                    <p className='flex text-xs text-center border rounded m-1 items-center'>D610 CPU<img className=' h-[25px] w-[25px]' src={plcConnection.d610cpu ? green_lamp : red_lamp} alt="" /></p>
                </div>
                <h1 className=" uppercase font-bold grid place-items-center col-start-4 col-span-4 ">
                    Lavvar Tesisi Veri Kayıt Sistemi
                </h1>
                <div className=" top-0.5 border-b-black col-start-9 text-center uppercase">
                    <strong>{user?.user?.username}</strong>
                </div>
                <div className=" top-0.5 border-b border-b-black col-start-10 text-center">
                    <strong>{clock}</strong>
                </div>
            </header>
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
