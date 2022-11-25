import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {UserAuthContext, useContext} from '../contexts/UserAuth'
import { DownloadTableExcel } from 'react-export-table-to-excel';
import moment from "moment";
export default function LabPage(){
    const [rows, setRows] = useState([]);
    const {user} = useContext(UserAuthContext)
    const [permission, setPermission] = useState(true);
    const tableRef = useRef(null);

    function RefreshData() {
        axios.get("http://10.35.13.108:8001/api/getlabdata").then((response) => {
            let jsondata = response.data.slice(0, 120);
            let row = [];
            for (let g = 0; g < jsondata.length; g++) {
                const element = jsondata[g];
                row.push(element);
            }
            setRows(row);
        });
    }

    useEffect(() => {
        RefreshData()
    }, [])

    useEffect(() => {
        if (user?.user?.username === 'laboratuvar') {
            setPermission(false);
        }else{
            setPermission(true);
        }
    }, [user])
    return (
        <div className=" mx-auto my-auto h-full w-1/2 ">
            <div className=" overflow-x-hidden w-full max-h-full border border-separate rounded">
                <DownloadTableExcel
                    filename={moment().format('DD-MM-YY') + ' Katı Madde Hesabı'}
                    sheet="CSM"
                    currentTableRef={tableRef.current}
                >
                   <button> Export excel </button>
                </DownloadTableExcel>
              <table id="veritablo" className=" text-white" ref={tableRef} >
                <thead className=" sticky -top-[0.001rem] rounded">
                    <tr>
                        <th className="text-xs font-medium bg-gray-700 text-center border p-1 rounded m-1">Tarih</th>
                        <th className="text-xs font-medium bg-gray-700 text-center border p-1 rounded m-1">Vardiya</th>
                        <th className="text-xs font-medium bg-gray-700 text-center border p-1 rounded m-1">Nem Analizi</th>
                        <th className="text-xs font-medium bg-gray-700 text-center border p-1 rounded m-1">Katı Madde Miktarı (%)</th>
                        <th className="text-xs font-medium bg-gray-700 text-center border p-1 rounded m-1">Yoğunluk (t/m³)</th>
                        <th className="text-xs font-medium bg-gray-700 text-center border p-1 rounded m-1">Şlam (m³)</th>
                        <th className="text-xs font-medium bg-gray-700 text-center border p-1 rounded m-1">Kuru Katı Madde (t)</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(( listValue, index ) => {
                        return (
                            <tr key={index} className="border" style={{backgroundColor: listValue.vardiya === 'Toplam' ? 'orange' : '', color: listValue.vardiya === 'Toplam' ? 'black' : 'white'}} >
                                <th id="tarih" className=" text-sm text-center w-24">
                                    {listValue.time}
                                </th>
                                <td id="vardiya" className=" text-sm text-center w-24 ">
                                    {listValue.vardiya}
                                </td>
                                <td id="nem" className=" text-sm text-center w-[350px]">
                                    {
                                        listValue.vardiya === 'Toplam' ? null : <NemAnalizi data={listValue} refreshdata={RefreshData} permission={permission} />
                                    }
                                </td>
                                <td id="katimadde" className=" text-sm text-center w-auto">
                                    {
                                        listValue.vardiya === 'Toplam' ? <KatiMaddeTotal data={listValue} refreshdata={RefreshData} permission={permission} /> : <KatiMadde data={listValue} refreshdata={RefreshData} permission={permission} />
                                    }
                                </td>
                                <td id="yogunluk" className=" text-sm text-center w-auto">
                                    {
                                        listValue.vardiya === 'Toplam' ? <YogunlukTotal data={listValue} refreshdata={RefreshData} permission={permission} /> : <Yogunluk data={listValue} refreshdata={RefreshData} permission={permission} />
                                    }
                                </td>
                                <td id="slam" className=" text-sm text-center w-24">
                                    {listValue.slurry}
                                </td>
                                <td id="kurukatimadde" className=" text-sm text-center w-auto ">
                                    {
                                        listValue.vardiya === 'Toplam' ? <KuruKatiTotal data={listValue} refreshdata={RefreshData} permission={permission} /> : <KuruKatiMadde data={listValue} refreshdata={RefreshData} permission={permission} />
                                    }
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
              </table>
            </div>
        </div>
    )
}

function NemAnalizi(props) {
    const [bos1, setBos1] = useState(props?.data?.nemdata?.bos1);
    const handleChangebos1 = (e) => {setBos1(parseFloat(e.target.value.replaceAll(',', '.')))};
    const [bos2, setBos2] = useState(props?.data?.nemdata?.bos2);
    const handleChangebos2 = (e) => {setBos2(parseFloat(e.target.value.replaceAll(',', '.')))};
    const [numune1, setNumune1] = useState(props?.data?.nemdata?.numune1);
    const handleChangeNumune1 = (e) => {setNumune1(parseFloat(e.target.value.replaceAll(',', '.')))};
    const [numune2, setNumune2] = useState(props?.data?.nemdata?.numune2);
    const handleChangeNumune2 = (e) => {setNumune2(parseFloat(e.target.value.replaceAll(',', '.')))};
    const [sontart1, setSontart1] = useState(props?.data?.nemdata?.sontart1);
    const handleChangeSontart1 = (e) => {setSontart1(parseFloat(e.target.value.replaceAll(',', '.')))};
    const [sontart2, setSontart2] = useState(props?.data?.nemdata?.sontart2);
    const handleChangeSontart2 = (e) => {setSontart2(parseFloat(e.target.value.replaceAll(',', '.')))};
    const [hesaplanannem1, setHesaplanannem1] = useState(0);
    const [hesaplanannem2, setHesaplanannem2] = useState(0);
    const [ortnem, setOrtnem] = useState(0);
    const [fark, setFark] = useState(0);

    useEffect(() => {
        setHesaplanannem1(((((bos1 + numune1) - sontart1) / numune1) * 100).toFixed(2).replaceAll('NaN', '0'));
        setHesaplanannem2(((((bos2 + numune2) - sontart2) / numune2) * 100).toFixed(2).replaceAll('NaN', '0'));
        setOrtnem(((parseFloat(hesaplanannem1) + parseFloat(hesaplanannem2)) / 2).toFixed(2));
        setFark(Math.abs(parseFloat(hesaplanannem1) - parseFloat(hesaplanannem2)).toFixed(2));
    }, [bos1, bos2, numune1, numune2, sontart1, sontart2, hesaplanannem1, hesaplanannem2, ortnem]);

    function Save() {
        axios.post("http://10.35.13.108:8001/api/labdatasavenem", {
            id: props?.data?.id,
            bos1: bos1,
            bos2: bos2,
            numune1: numune1,
            numune2: numune2,
            sontart1: sontart1,
            sontart2: sontart2,
            hesaplanannem1: hesaplanannem1,
            hesaplanannem2: hesaplanannem2,
            ortnem: ortnem,
            fark: fark,
            saved: true
        }).then((response) => {
            console.log(response);
            props.refreshdata();
        });
    }

    return(
        <div className=" grid grid-cols-5 gap-1 p-1 rounded select-none  " style={{backgroundColor: fark > 1 ? 'red' : '#007d38'}}>
            <input disabled={ props.permission } defaultValue={props?.data?.nemdata?.bos1} onChange={handleChangebos1} className=" bg-gray-300 rounded text-black text-xs border border-gray-900 p-1 flex w-16 text-center" placeholder="Boş Tartım" />
            <input disabled={ props.permission } defaultValue={props?.data?.nemdata?.numune1} onChange={handleChangeNumune1} className=" bg-gray-300 rounded text-black text-xs border border-gray-900 p-1 w-16 text-center" placeholder="Numune" />
            <input disabled={ props.permission } defaultValue={props?.data?.nemdata?.sontart1} onChange={handleChangeSontart1} className=" bg-gray-300 rounded text-black text-xs border border-gray-900 p-1 w-16 text-center" placeholder="Son Tartım" />
            <p className=" text-center rounded p-1 w-16">{hesaplanannem1}</p>
            <p id={'ortnem-' + props?.data?.id.toString()} className=" text-center rounded p-1 w-16 ">{ortnem}</p>
            
            <input disabled={ props.permission } defaultValue={props?.data?.nemdata?.bos2} onChange={handleChangebos2} className=" bg-gray-300 rounded text-black text-xs border border-gray-900 p-1 w-16 text-center" placeholder="Boş Tartım" />
            <input disabled={ props.permission } defaultValue={props?.data?.nemdata?.numune2} onChange={handleChangeNumune2} className=" bg-gray-300 rounded text-black text-xs border border-gray-900 p-1 w-16 text-center" placeholder="Numune" />
            <input disabled={ props.permission } defaultValue={props?.data?.nemdata?.sontart2} onChange={handleChangeSontart2} className=" bg-gray-300 rounded text-black text-xs border border-gray-900 p-1 w-16 text-center" placeholder="Son Tartım" />
            <p className=" text-center rounded p-1 w-16 bg-color">{hesaplanannem2}</p>
            <button onClick={Save} className=" text-center rounded p-1  " style={{backgroundColor: props?.data?.nemdata?.saved ? 'gray' : '#56eb34'}} disabled={ fark > 1 ? true : false || props.permission }>Kaydet</button>
        </div>
    )
}

function Yogunluk(props) {
    const [yoguluk, setYogunluk] = useState(props?.data?.yogunluk);
    const handleChangebos1 = (e) => {setYogunluk(parseFloat(e.target.value.replaceAll(',', '.')))};

    function Save() {
        axios.post("http://10.35.13.108:8001/api/labdatayogunluk", {
            id: props?.data?.id,
            yogunluk: yoguluk,
            saved: true
        }).then((response) => {
            props.refreshdata();
        });
    }

    return(
        <div className=" grid grid-cols-2 gap-1 p-1 rounded select-none " >
            <input disabled={ props.permission } defaultValue={props?.data?.yogunluk} onChange={handleChangebos1} className=" bg-gray-300 rounded text-black text-xs border border-gray-900 p-1 flex col-start-1 col-span-2 text-center" placeholder="Yoğunluk" />
            <p className="invisible" id={'yogunluk-' + props?.data?.id.toString()}>{yoguluk}</p>
            <button onClick={Save} className=" text-center rounded p-1  w-full " style={{backgroundColor: props?.data?.yogunluk ? 'gray' : '#56eb34'}}  disabled={ props.permission }>Kaydet</button>
        </div>
    )
}

function KatiMadde(props) {
    const [katimadde, setKatiMadde] = useState(0);
    useEffect(() => {
        let nem = document.querySelector(`#ortnem-${props?.data?.id.toString()}`)?.innerHTML;
        setKatiMadde((100 - nem).toFixed(2));
    }, [props]);

    return katimadde
}

function KuruKatiMadde(props) {
    const [kurukatimadde, setKuruKatiMadde] = useState(0);
    useEffect(() => {
        let nem = document.querySelector(`#ortnem-${props.data.id.toString()}`).innerHTML
        let yogunluk = document.querySelector(`#yogunluk-${props.data.id.toString()}`).innerHTML
        setKuruKatiMadde(((props.data.slurry * (100 - nem) * yogunluk) / 100).toFixed());
    }, [props]);
    
    return kurukatimadde
}

function KatiMaddeTotal(props) {
    const [katimaddetotal, setKatiMaddeTotal] = useState(0);
    useEffect(() => {
        let table = document.getElementById("veritablo").rows
        let v1 = 0, v2 = 0, v3 = 0;
        for (let tb = 0; tb < table.length; tb++) {
            const element = table[tb];
            let time = element.querySelector("tr > th").innerHTML
            let vardiya = element.querySelector("#vardiya")?.innerHTML
            if (vardiya === "V1" || vardiya === "V2" || vardiya === "V3") {
                if (time === props.data.time ) {
                    let katimadde = element.querySelector("#katimadde")?.innerHTML
                    let slurry = element.querySelector("#slam")?.innerHTML
                    if (vardiya === "V1" ) v1 = katimadde * slurry
                    if (vardiya === "V2" ) v2 = katimadde * slurry
                    if (vardiya === "V3" ) v3 = katimadde * slurry
                }
            }
        }
        setKatiMaddeTotal(((v1+v2+v3)/props.data.slurry).toFixed(2));
    }, [props]);

    return katimaddetotal
}

function YogunlukTotal(props) {
    const [yogunluktotaltotal, setYogunlukTotal] = useState(0);
    useEffect(() => {
        let table = document.getElementById("veritablo").rows
        let v1 = 0.0, v2 = 0.0, v3 = 0.0;
        for (let tb = 0; tb < table.length; tb++) {
            const element = table[tb];
            let time = element.querySelector("tr > th").innerHTML
            let vardiya = element.querySelector("#vardiya")?.innerHTML
            if (vardiya === "V1" || vardiya === "V2" || vardiya === "V3") {
                if (time === props.data.time ) {
                    let yogunluk = element.querySelector("#yogunluk  > div > p:nth-child(2)")?.innerHTML
                    let slurry = element.querySelector("#slam")?.innerHTML
                    if (vardiya === "V1" ) v1 = parseFloat(slurry) * parseFloat(yogunluk)
                    if (vardiya === "V2" ) v2 = parseFloat(slurry) * parseFloat(yogunluk)
                    if (vardiya === "V3" ) v3 = parseFloat(slurry) * parseFloat(yogunluk)
                }
            }
        }
        setYogunlukTotal(((v1+v2+v3)/props.data.slurry).toFixed(2).replaceAll('NaN', '0'));
    }, [props]);

    return yogunluktotaltotal
}

function KuruKatiTotal(props) {
    const [kurukatitotal, setKuruKatiTotal] = useState(0);
    useEffect(() => {
        let table = document.getElementById("veritablo").rows
        let total = 0;
        for (let tb = 0; tb < table.length; tb++) {
            const element = table[tb];
            let time = element.querySelector("tr > th").innerHTML
            let vardiya = element.querySelector("#vardiya")?.innerHTML
            if (vardiya === "V1" || vardiya === "V2" || vardiya === "V3") {
                if (time === props.data.time ) {
                    let kurukati = element.querySelector("#kurukatimadde")?.innerHTML
                    total += parseInt(kurukati)
                }
            }
        }
        setKuruKatiTotal((total));
    }, [props]);

    return kurukatitotal
}

