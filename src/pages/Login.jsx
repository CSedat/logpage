import {useState} from "react";
import { Navigate } from "react-router-dom";
import logo from '../assets/polyakeynez.png';
import {UserAuthContext, useContext} from '../contexts/UserAuth'
import axios from "axios";

const Login = (props) => {
    // eslint-disable-next-line no-unused-vars
    const {user, setUser} = useContext(UserAuthContext)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isAuth, setIsAuth] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        const serveruserdata = await axios.post('http://10.35.13.108:8001/auth', {
            username: username,
            password: password
        })
        if (serveruserdata.data.status === 'success') {
            setIsAuth(true)
            setUser(serveruserdata.data)
        }else{
            setIsAuth(false)
            alert(serveruserdata.data.message)
        }
    }

    return (
        <div className="login bg-gradient-to-r from-cyan-700 to-blue-900 h-[95.7vh] w-full flex">
            <div className=" p-1 m-auto">
                <img className=" w-96 mx-auto relative bottom-32 " src={logo} alt="CSedat" />
                <h2 className=" text-white text-center text-2xl relative bottom-32">Lavvar Tesisi Veri Kayıt & İzleme Sistemi</h2>
                <form className=" text-white text-center items-center rounded bg-blue-600 p-2 flex flex-col" onSubmit={handleSubmit}>
                    <p>Kullanıcı Adı</p>
                    <input className=" text-black text-center rounded w-44" type="text" required value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <p>Şifre</p>
                    <input className=" text-black text-center rounded w-44" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <button className=" bg-gradient-to-r from-green-500 to-blue-500 hover:from-pink-500 hover:to-yellow-500 px-4 py-1 uppercase m-2 rounded ">giriş yap</button>
                    {/* <p className=" text-xs">Giriş yetkilendirmesi için <strong>tunahan.simsek@polyakeynez.com</strong> ile iletişime geçebilirsiniz.</p> */}
                </form>
                {isAuth && <Navigate to={`/MainPage`} exact/>}
            </div>
        </div>
    );
}

export default Login;