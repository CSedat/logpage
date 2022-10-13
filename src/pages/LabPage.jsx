import { useState, useEffect } from "react";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import axios from "axios";



export default function DataGridDemo() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        { align: 'center', headerAlign: 'center', flex: true, field: 'time', headerName: 'Tarih' }, 
        { align: 'center', headerAlign: 'center', flex: true, field: 'vardiya', headerName: 'Vardiya' }, 
        { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'slurry', headerName: 'Şlam' }, 
        { align: 'center', headerAlign: 'center', width: 350, type: 'number', field: 'madde', headerName: 'Nem Miktarı',
            renderCell: (cellValues) => {
                return NemAnalizi(cellValues);
            }
        },
        { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'kmadde', headerName: '% Katı Madde Miktarı',
            valueGetter: (params) => {
                if(loading) {
                    let val = document.querySelector(`#ortnem-${params.row.id.toString()}`).innerHTML
                    return (parseFloat((100-val).toFixed(2)));
                };
                return 100.00;
            }
        },
        { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'yogunluk', headerName: 'Yoğunluk (g/cm3)',
            renderCell: (cellValues) => {
                return Yogunluk(cellValues);
            }
        },
        { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'kkmadde', headerName: 'Kuru Katı Madde (t)',
            renderCell: (params) => {
                if(loading) { 
                    let nem = document.querySelector(`#ortnem-${params.row.id.toString()}`).innerHTML
                    let yogunluk = document.querySelector(`#yogunluk-${params.row.id.toString()}`).innerHTML
                    return <p>{((params.row.slurry * (100 - nem) * yogunluk) / 100).toFixed(2)}</p>
                };
                return 100.00;
            }
        }, 
    ];
    function RefreshData() {
        axios.get("http://10.35.13.108:8001/api/getlabdata").then((response) => {
            let jsondata = response.data;
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
        setTimeout(() => {
            setLoading(true);
        }, 500);
    }, [])

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarExport />
            </GridToolbarContainer>
        );
    }
    return (
        <div className=" h-full w-full p-2 py-20 px-40">
            <DataGrid
                rows={rows}
                columns={columns}
                rowHeight={80}
                headerHeight={35}
                initialState={{
                    pagination: {
                      pageSize: 30,
                    },
                }}
                components={{
                    Toolbar: CustomToolbar,
                }}
                rowsPerPageOptions={[30, 50, 100]}
                // getCellClassName={(params) => {
                //     if (params.field === 'vardiya' || params.value == null) {
                //         if (params.row.vardiya === 'Toplam') {
                //             return 'dark';
                //         }
                //     }
                //     return '';
                // }}
                sx={{
                    color: '#ffffff',
                    // backgroundColor: '#1d1d1d',
                    boxShadow: 4,
                    border: 1,
                    borderColor: '#ffffff',
                    '& .MuiDataGrid-cell:hover': {
                    color: 'yellow',
                    }
                }}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
            />
        </div>
    );
}

function NemAnalizi(props) {
    const [bos1, setBos1] = useState(props?.row?.nemdata?.bos1);
    const handleChangebos1 = (e) => {setBos1(parseFloat(e.target.value.replaceAll(',', '.')))};
    const [bos2, setBos2] = useState(props?.row?.nemdata?.bos2);
    const handleChangebos2 = (e) => {setBos2(parseFloat(e.target.value.replaceAll(',', '.')))};
    const [numune1, setNumune1] = useState(props?.row?.nemdata?.numune1);
    const handleChangeNumune1 = (e) => {setNumune1(parseFloat(e.target.value.replaceAll(',', '.')))};
    const [numune2, setNumune2] = useState(props?.row?.nemdata?.numune2);
    const handleChangeNumune2 = (e) => {setNumune2(parseFloat(e.target.value.replaceAll(',', '.')))};
    const [sontart1, setSontart1] = useState(props?.row?.nemdata?.sontart1);
    const handleChangeSontart1 = (e) => {setSontart1(parseFloat(e.target.value.replaceAll(',', '.')))};
    const [sontart2, setSontart2] = useState(props?.row?.nemdata?.sontart2);
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
            id: props.row.id,
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
        }).then((response) => {
            console.log(response);
        });
    }

    return(
        <div className=" grid grid-cols-5 gap-1 p-1 rounded select-none  " style={{backgroundColor: fark > 1 ? 'red' : '#007d38'}}>
            <input defaultValue={props?.row?.nemdata?.bos1} onChange={handleChangebos1} className=" bg-gray-300 rounded text-black text-xs border border-gray-900 p-1 flex w-16" placeholder="Boş Tartım" />
            <input defaultValue={props?.row?.nemdata?.numune1} onChange={handleChangeNumune1} className=" bg-gray-300 rounded text-black text-xs border border-gray-900 p-1 w-16" placeholder="Numune" />
            <input defaultValue={props?.row?.nemdata?.sontart1} onChange={handleChangeSontart1} className=" bg-gray-300 rounded text-black text-xs border border-gray-900 p-1 w-16" placeholder="Son Tartım" />
            <p className=" text-center rounded p-1 w-16">{hesaplanannem1}</p>
            <p id={'ortnem-' + props.row.id.toString()} className=" text-center rounded p-1 w-16 ">{ortnem}</p>
            
            <input defaultValue={props?.row?.nemdata?.bos2} onChange={handleChangebos2} className=" bg-gray-300 rounded text-black text-xs border border-gray-900 p-1 w-16" placeholder="Boş Tartım" />
            <input defaultValue={props?.row?.nemdata?.numune2} onChange={handleChangeNumune2} className=" bg-gray-300 rounded text-black text-xs border border-gray-900 p-1 w-16" placeholder="Numune" />
            <input defaultValue={props?.row?.nemdata?.sontart2} onChange={handleChangeSontart2} className=" bg-gray-300 rounded text-black text-xs border border-gray-900 p-1 w-16" placeholder="Son Tartım" />
            <p className=" text-center rounded p-1 w-16 bg-color">{hesaplanannem2}</p>
            <button onClick={Save} className=" text-center rounded p-1  " style={{backgroundColor: fark > 1 ? '#eb5b34' : '#56eb34'}} disabled={ fark > 1 ? true : false }>Kaydet</button>
        </div>
    )
}

function Yogunluk(props) {
    const [yoguluk, setYogunluk] = useState(props?.row?.yogunluk);
    const handleChangebos1 = (e) => {setYogunluk(parseFloat(e.target.value.replaceAll(',', '.')))};

    function Save() {
        axios.post("http://10.35.13.108:8001/api/labdatayogunluk", {
            id: props.row.id,
            yogunluk: yoguluk,
        }).then((response) => {
            
        });
    }

    return(
        <div className=" grid grid-cols-2 gap-1 p-1 rounded select-none  " >
            <input defaultValue={props?.row?.yogunluk} onChange={handleChangebos1} className=" bg-gray-300 rounded text-black text-xs border border-gray-900 p-1 flex w-16" placeholder="Yoğunluk" />
            <p className="invisible" id={'yogunluk-' + props.row.id.toString()}>{yoguluk}</p>
            <button onClick={Save} className=" text-center rounded p-1 bg-[#56eb34] w-16 "  disabled={ false }>Kaydet</button>
        </div>
    )
}

