import { useState, useEffect } from "react";
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
} from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";


const columns = [
    {
        align: "center",
        headerAlign: "center",
        flex: true,
        field: "id",
        headerName: "No",
    },
    {
        align: "center",
        headerAlign: "center",
        flex: true,
        type: "number",
        field: "kantar",
        headerName: "Kantar",
    },
    {
        align: "center",
        headerAlign: "center",
        flex: true,
        type: "number",
        field: "dara",
        headerName: "Dara",
    },
    {
        align: "center",
        headerAlign: "center",
        flex: true,
        type: "number",
        field: "net",
        headerName: "Net",
    },
    {
        align: "center",
        headerAlign: "center",
        flex: true,
        field: "hour",
        headerName: "Kayıt Saati",
    },
    {
        align: "center",
        headerAlign: "center",
        flex: true,
        field: "date",
        headerName: "Tarih",
    },
];

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function DataGridDemo() {
    const [araurunrows, setAraurunrows] = useState([]);
    const [tozrows, setTozrows] = useState([]);
    const [findikrows, setFindikrows] = useState([]);
    const [cevizrows, setCevizrows] = useState([]);

    const [araurunseviye, setAraurunseviye] = useState(0);
    const [tozseviye, setTozseviye] = useState(0);
    const [findikseviye, setFindikseviye] = useState(0);
    const [cevizseviye, setCevizseviye] = useState(0);

    const [araurunv1, setAraurunv1] = useState(0.0);
    const [araurunv2, setAraurunv2] = useState(0);
    const [araurunv3, setAraurunv3] = useState(0);

    const [tozv1, setTozv1] = useState(0);
    const [tozv2, setTozv2] = useState(0);
    const [tozv3, setTozv3] = useState(0);

    const [findikv1, setFindikv1] = useState(0);
    const [findikv2, setFindikv2] = useState(0);
    const [findikv3, setFindikv3] = useState(0);

    const [cevizv1, setCevizv1] = useState(0);
    const [cevizv2, setCevizv2] = useState(0);
    const [cevizv3, setCevizv3] = useState(0);

    function RefreshData() {
        axios.get("http://10.35.13.108:8501/getaraurun").then((response) => {
            let jsondata = response.data;
            let row = [];
            let v1Total = 0;
            let v2Total = 0;
            let v3Total = 0;
            for (let i = 0; i < jsondata.length; i++) {
                row.push({ ...jsondata[i], net: jsondata[i].kantar - jsondata[i].dara });
                let d = jsondata[i].date.split('/')[0]
                let m = jsondata[i].date.split('/')[1]
                let h = jsondata[i].hour.split(':')[0]
                let nowd = moment().format('DD')
                let nowm = moment().format('MM')
                if (Number(d) === Number(nowd) && Number(m) === Number(nowm)) {
                    console.log(h, nowd)
                    if (jsondata[i].kantar.search('V')) {
                        let net = parseInt(jsondata[i].kantar - jsondata[i].dara)
                        if (h >= 0 && h <= 7) {
                            v1Total += net
                        } else if (h >= 8 && h <= 15) {
                            v2Total += net
                        } else if (h >= 16 && h <= 23) {
                            v3Total += net
                        }
                    }
                }
            }
            setAraurunrows(row);
            setAraurunv1(v1Total);
            setAraurunv2(v2Total);
            setAraurunv3(v3Total);
        });
        axios.get("http://10.35.13.108:8501/gettoz").then((response) => {
            let jsondata = response.data;
            let row = [];
            let v1Total = 0;
            let v2Total = 0;
            let v3Total = 0;
            for (let i = 0; i < jsondata.length; i++) {
                row.push({ ...jsondata[i], net: jsondata[i].kantar - jsondata[i].dara });
                let d = jsondata[i].date.split('/')[0]
                let m = jsondata[i].date.split('/')[1]
                let h = jsondata[i].hour.split(':')[0]
                let nowd = moment().format('DD')
                let nowm = moment().format('MM')
                if (Number(d) === Number(nowd) && Number(m) === Number(nowm)) {
                    console.log(h, nowd)
                    if (jsondata[i].kantar.search('V')) {
                        let net = parseInt(jsondata[i].kantar - jsondata[i].dara)
                        if (h >= 0 && h <= 7) {
                            v1Total += net
                        } else if (h >= 8 && h <= 15) {
                            v2Total += net
                        } else if (h >= 16 && h <= 23) {
                            v3Total += net
                        }
                    }
                }
            }
            setTozrows(row);
            setTozv1(v1Total);
            setTozv2(v2Total);
            setTozv3(v3Total);
        });
        axios.get("http://10.35.13.108:8501/getfindik").then((response) => {
            let jsondata = response.data;
            let row = [];
            let v1Total = 0;
            let v2Total = 0;
            let v3Total = 0;
            for (let i = 0; i < jsondata.length; i++) {
                row.push({ ...jsondata[i], net: jsondata[i].kantar - jsondata[i].dara });
                let d = jsondata[i].date.split('/')[0]
                let m = jsondata[i].date.split('/')[1]
                let h = jsondata[i].hour.split(':')[0]
                let nowd = moment().format('DD')
                let nowm = moment().format('MM')
                if (Number(d) === Number(nowd) && Number(m) === Number(nowm)) {
                    console.log(h, nowd)
                    if (jsondata[i].kantar.search('V')) {
                        let net = parseInt(jsondata[i].kantar - jsondata[i].dara)
                        if (h >= 0 && h <= 7) {
                            v1Total += net
                        } else if (h >= 8 && h <= 15) {
                            v2Total += net
                        } else if (h >= 16 && h <= 23) {
                            v3Total += net
                        }
                    }
                }
            }
            setFindikrows(row);
            setFindikv1(v1Total);
            setFindikv2(v2Total);
            setFindikv3(v3Total);
        });
        axios.get("http://10.35.13.108:8501/getceviz").then((response) => {
            let jsondata = response.data;
            let row = [];
            let v1Total = 0;
            let v2Total = 0;
            let v3Total = 0;
            for (let i = 0; i < jsondata.length; i++) {
                row.push({ ...jsondata[i], net: jsondata[i].kantar - jsondata[i].dara });
                let d = jsondata[i].date.split('/')[0]
                let m = jsondata[i].date.split('/')[1]
                let h = jsondata[i].hour.split(':')[0]
                let nowd = moment().format('DD')
                let nowm = moment().format('MM')
                if (Number(d) === Number(nowd) && Number(m) === Number(nowm)) {
                    console.log(h, nowd)
                    if (jsondata[i].kantar.search('V')) {
                        let net = parseInt(jsondata[i].kantar - jsondata[i].dara)
                        if (h >= 0 && h <= 7) {
                            v1Total += net
                        } else if (h >= 8 && h <= 15) {
                            v2Total += net
                        } else if (h >= 16 && h <= 23) {
                            v3Total += net
                        }
                    }
                }
            }
            setCevizrows(row);
            setCevizv1(v1Total);
            setCevizv2(v2Total);
            setCevizv3(v3Total);
        });
    }

    useEffect(() => {
        RefreshData();
        setInterval(() => {
            axios
                .get("http://10.35.13.108:8501/getPLCData")
                .then((response) => {
                    let jsondata = response.data;
                    setAraurunseviye(jsondata.Ints.araurunseviye);
                    setTozseviye(jsondata.Ints.tozseviye);
                    setFindikseviye(jsondata.Ints.findikseviye);
                    setCevizseviye(jsondata.Ints.cevizseviye);
                });
        }, 3000);
    }, []);

    function CustomToolbar(toolbar) {
        return (
            <GridToolbarContainer>
                <GridToolbarExport />
                <button
                    onClick={RefreshData}
                    className="bg-green-600 rounded p-1 hover:bg-green-500"
                >
                    TABLOYU YENILE
                </button>
                <p className="w-40 text-xs bg-[#1f2937] p-1 text-center font-bold">
                    {toolbar.urun} Silo Seviyesi: {toolbar.seviye}
                </p>
                <p className="w-40 text-xs bg-[#1f2937] p-1 text-center font-bold">
                    V1: {numberWithCommas(toolbar.v1)}
                </p>
                <p className="w-40 text-xs bg-[#1f2937] p-1 text-center font-bold">
                    V2: {numberWithCommas(toolbar.v2)}
                </p>
                <p className="w-40 text-xs bg-[#1f2937] p-1 text-center font-bold">
                    V3: {numberWithCommas(toolbar.v3)}
                </p>
            </GridToolbarContainer>
        );
    }
    return (
        <div className=" h-full w-full p-2 grid grid-cols-2 gap-4">
            <DataGrid
                rows={araurunrows}
                columns={columns}
                rowHeight={35}
                headerHeight={35}
                initialState={{
                    pagination: {
                        pageSize: 30,
                    },
                }}
                components={{
                    Toolbar: CustomToolbar,
                }}
                componentsProps={{
                    toolbar: {
                        urun: "Araürün",
                        seviye: araurunseviye,
                        v1: araurunv1,
                        v2: araurunv2,
                        v3: araurunv3,
                    },
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
                    color: "#ffffff",
                    // backgroundColor: '#1d1d1d',
                    boxShadow: 4,
                    border: 1,
                    borderColor: "#ffffff",
                    "& .MuiDataGrid-cell:hover": {
                        color: "yellow",
                    },
                }}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
            />
            <DataGrid
                rows={tozrows}
                columns={columns}
                rowHeight={35}
                headerHeight={35}
                initialState={{
                    pagination: {
                        pageSize: 30,
                    },
                }}
                components={{
                    Toolbar: CustomToolbar,
                }}
                componentsProps={{
                    toolbar: {
                        urun: "Toz",
                        seviye: tozseviye,
                        v1: tozv1,
                        v2: tozv2,
                        v3: tozv3,
                    },
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
                    color: "#ffffff",
                    // backgroundColor: '#1d1d1d',
                    boxShadow: 4,
                    border: 1,
                    borderColor: "#ffffff",
                    "& .MuiDataGrid-cell:hover": {
                        color: "yellow",
                    },
                }}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
            />
            <DataGrid
                rows={findikrows}
                columns={columns}
                rowHeight={35}
                headerHeight={35}
                initialState={{
                    pagination: {
                        pageSize: 30,
                    },
                }}
                components={{
                    Toolbar: CustomToolbar,
                }}
                componentsProps={{
                    toolbar: {
                        urun: "Fındık",
                        seviye: findikseviye,
                        v1: findikv1,
                        v2: findikv2,
                        v3: findikv3,
                    },
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
                    color: "#ffffff",
                    // backgroundColor: '#1d1d1d',
                    boxShadow: 4,
                    border: 1,
                    borderColor: "#ffffff",
                    "& .MuiDataGrid-cell:hover": {
                        color: "yellow",
                    },
                }}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
            />
            <DataGrid
                rows={cevizrows}
                columns={columns}
                rowHeight={35}
                headerHeight={35}
                initialState={{
                    pagination: {
                        pageSize: 30,
                    },
                }}
                components={{
                    Toolbar: CustomToolbar,
                }}
                componentsProps={{
                    toolbar: {
                        urun: "Ceviz",
                        seviye: cevizseviye,
                        v1: cevizv1,
                        v2: cevizv2,
                        v3: cevizv3,
                    },
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
                    color: "#ffffff",
                    // backgroundColor: '#1d1d1d',
                    boxShadow: 4,
                    border: 1,
                    borderColor: "#ffffff",
                    "& .MuiDataGrid-cell:hover": {
                        color: "yellow",
                    },
                }}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
            />
        </div>
    );
}
