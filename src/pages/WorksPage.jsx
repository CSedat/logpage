import { useState, useEffect } from "react";
import {UserAuthContext, useContext} from '../contexts/UserAuth'
import axios from "axios";

export default function Works() {
    const [rows, setRows] = useState([]);
    const {user} = useContext(UserAuthContext)
    const [permission, setPermission] = useState(true);

    const [popup, setPopup] = useState(false);
    const [popupData, setPopupData] = useState(null);

    function RefreshData() {
        axios.get("http://10.35.13.108:8001/api/getworksdata").then((response) => {
            let jsondata = response.data.slice(0, 120);
            setRows(jsondata);
        });
    }

    useEffect(() => {
        RefreshData()
    }, [])

    useEffect(() => {
        if (user?.user?.username === 'elektrik' || user?.user?.username === 'tunahansimsek' || user?.user?.username === 'sedatcapar') {
            setPermission(false);
        }else{
            setPermission(true);
        }
    }, [user])

    return(
        <div className=" mx-auto my-auto h-full w-full ">
            <AddWorkPopup trigger={popup} setTrigger={setPopup} RefreshData={RefreshData} data={popupData} />
            <div className=" overflow-x-hidden w-full max-h-full border border-separate rounded">
                <table id="veritablo" className=" text-white rounded" >
                    <thead className=" sticky -top-[0.001rem] rounded">
                        <tr>
                            <th className="text-xs font-medium bg-sky-700 text-center m-1 p-2">Tarih</th>
                            <th className="text-xs font-medium bg-sky-700 text-center m-1 p-2">Vardiya</th>
                            <th className="text-xs font-medium bg-sky-700 text-center m-1 p-2">İşi Yapanlar</th>
                            <th className="text-xs font-medium bg-sky-700 text-center m-1 p-2">Yapılan İş</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.data.key} className=" border">
                                <td className="text-center text-xs font-medium bg-gray-700 w-32">{row?.data.date}</td>
                                <td className="text-center text-xs font-medium bg-gray-700 w-32">{row?.data.vardiya}</td>
                                <td className=" text-xs text-center font-medium bg-gray-700 w-[12rem]">
                                    {
                                        row.data.names.map((name) => (
                                            <li className="text-xs font-medium text-center p-1 rounded m-1">{name}</li>
                                        ))
                                    }
                                </td>

                                <td className="text-xs text-center font-medium bg-gray-700 w-[92rem]">{
                                    row.data.works.map((work) => (
                                        <li className="text-xs font-medium bg-gray-800 text-left p-1 rounded border m-1 "> {work.work} 
                                            <strong> [ {row.data.names.length} kişi {work.sure} saat {work.tip} ]</strong>
                                            {
                                                permission ? null : 
                                                <button className=" bg-red-500 text-white mx-1 w-5 rounded select-none"
                                                onClick={() => {
                                                    axios.post("http://10.35.13.108:8001/api/deletework", {
                                                        row,
                                                        work
                                                    }).then((response) => {
                                                        console.log(response.data);
                                                        if (response.data === 'ok') {
                                                            RefreshData();
                                                        }
                                                    });
                                                }}>Sil</button>
                                            }
                                            
                                        </li>
                                    ))}
                                    {
                                        permission ? null : 
                                        <button 
                                        onClick={() => {
                                            setPopup(true)
                                            setPopupData(row)
                                        }} className=" bg-green-500 rounded p-1 select-none">İş Ekle</button>
                                        
                                    }
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </div>
    )
}

function AddWorkPopup({data, trigger, setTrigger, RefreshData}){
    const [userinfo, setUserInfo] = useState({
        names: []
    });

    const [tip, setTip] = useState('Arıza');
    const [sure, setSure] = useState(1);
    const [work, setWork] = useState(null);
    
    const nameshandleChange = (e) => {
        const { value, checked } = e.target;
        const { names } = userinfo;
        if (checked) {
            setUserInfo({
                names: [...names, value],
            });
        }
        else {
            setUserInfo({
                names: names.filter((e) => e !== value),
            });
        }
    };
    const onChangeTip = (e) => {
        const { value } = e.target;
        setTip(value);
    };

    const onChangeSure = (e) => {
        const { value } = e.target;
        setSure(value);
    };

    const onChangeWork = (e) => {
        const { value } = e.target;
        setWork(value);
    };

    useEffect(() => {
        if (trigger) {
            setUserInfo({
                names: [...data?.data?.names],
            });
        }
    }, [trigger, data])

    const submit = () => {
        if (work.length >= 10) {
            axios.post("http://10.35.13.108:8001/api/savework", {
                date: data?.data?.date,
                vardiya: data?.data?.vardiya,
                data: {
                    names: userinfo.names,
                    tip,
                    sure,
                    work,
                }
            }).then((response) => {
                console.log(response.data);
                if (response.data === 'ok') {
                    setWork(null);
                    setTrigger(false);
                    RefreshData();
                }
            });
        }else{
            alert('İş tanımı en az 10 karakter olmalıdır.')
        }
    };
    return (trigger) ? (
        <div className=" absolute mx-[38rem] h-auto w-[35rem] bg-gray-500 rounded z-10 ">
            <div className="flex bg-gray-900 w-full h-12 rounded">
                <p className=" mx-auto relative top-3">[<strong>{data?.data?.date}</strong>] - [<strong>{data?.data?.vardiya}</strong>] Kişi ve İş Ekle</p>
                <button onClick={() => {setTrigger(false); setWork(null);}} className=' absolute top-2 right-2 bg-red-500 hover:bg-red-400 rounded h-8 w-8 '>X</button>
            </div>
            <div className=" grid grid-cols-4 w-[35rem] text-center  m-2">
                <label className="cursor-pointer label w-[6rem] border rounded m-1">
                    <input value={"Taner KARA"} defaultChecked={data.data.names.find(obj => {return obj === "Taner KARA"})} onChange={nameshandleChange} type="checkbox" className="checkbox checkbox-success" />
                    <span className="text-center text-xs">Taner KARA</span>
                </label>
                <label className="cursor-pointer label w-[6rem] border rounded m-1">
                    <input value={"Berkan GARGILI"} defaultChecked={data.data.names.find(obj => {return obj === "Berkan GARGILI"})} onChange={nameshandleChange} type="checkbox" className="checkbox checkbox-success" />
                    <span className="text-center text-xs">Berkan GARGILI</span>
                </label>
                <label className="cursor-pointer label w-[6rem] border rounded m-1">
                    <input value={"Mehmet CANBAZ"} defaultChecked={data.data.names.find(obj => {return obj === "Mehmet CANBAZ"})} onChange={nameshandleChange} type="checkbox" className="checkbox checkbox-success" />
                    <span className="text-center text-xs">Mehmet CANBAZ</span>
                </label>
                <label className="cursor-pointer label w-[6rem] border rounded m-1">
                    <input value={"Erdem YEŞİL"} defaultChecked={data.data.names.find(obj => {return obj === "Erdem YEŞİL"})} onChange={nameshandleChange} type="checkbox" className="checkbox checkbox-success" />
                    <span className="text-center text-xs">Erdem YEŞİL</span>
                </label>
                <label className="cursor-pointer label w-[6rem] border rounded m-1">
                    <input value={"Sedat ÇAPAR"} defaultChecked={data.data.names.find(obj => {return obj === "Sedat ÇAPAR"})} onChange={nameshandleChange} type="checkbox" className="checkbox checkbox-success" />
                    <span className="text-center text-xs">Sedat ÇAPAR</span>
                </label>
                <label className="cursor-pointer label w-[6rem] border rounded m-1">
                    <input value={"Hasret ÇELİKER"} defaultChecked={data.data.names.find(obj => {return obj === "Hasret ÇELİKER"})} onChange={nameshandleChange} type="checkbox" className="checkbox checkbox-success" />
                    <span className="text-center text-xs">Hasret ÇELİKER</span>
                </label>
                <label className="cursor-pointer label w-[6rem] border rounded m-1">
                    <input value={"İrfan YALÇIN"} defaultChecked={data.data.names.find(obj => {return obj === "İrfan YALÇIN"})} onChange={nameshandleChange} type="checkbox" className="checkbox checkbox-success" />
                    <span className="text-center text-xs">İrfan YALÇIN</span>
                </label>
                <label className="cursor-pointer label w-[6rem] border rounded m-1">
                    <input value={"Berkay ÖTÜN"} defaultChecked={data.data.names.find(obj => {return obj === "Berkay ÖTÜN"})} onChange={nameshandleChange} type="checkbox" className="checkbox checkbox-success" />
                    <span className="text-center text-xs">Berkay ÖTÜN</span>
                </label>
            </div>
            <div className=" grid grid-cols-2 p-1">
                <div className="label">
                    <select value={tip} onChange={onChangeTip} className=" w-full h-10 text-center text-white rounded bg-gray-600 ">
                        <option>Arıza</option>
                        <option>Geliştirme</option>
                        <option>Bakım</option>
                    </select>
                </div>
                <div className="form-control w-full text-center">
                    <label className="label">
                        <input value={sure} onChange={onChangeSure} type="number" className=" w-full h-10 text-center text-white rounded bg-gray-600" />
                        <span className="text-xs p-1">Saat</span>
                    </label>
                </div>
            </div>
            <div className=" p-1">
                <textarea onChange={onChangeWork} className=" w-full h-32 text-white rounded bg-gray-600" placeholder="Yapılan iş"></textarea>
            </div>
            <button onClick={submit} className=" w-32 h-10 border rounded bg-green-500 p-1 m-2 ">Kaydet</button>
        </div>
    ): null
}