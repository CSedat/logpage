import { useState, useEffect } from "react";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";

const columns = [
    { align: 'center', headerAlign: 'center', flex: true, field: 'id', headerName: 'No' }, 
    { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'kantar', headerName: 'Kantar' }, 
    { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'dara', headerName: 'Dara' }, 
    { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'net', headerName: 'Net' }, 
    { align: 'center', headerAlign: 'center', flex: true, field: 'hour', headerName: 'Kayıt Saati' }, 
    { align: 'center', headerAlign: 'center', flex: true, field: 'date', headerName: 'Tarih' }, 
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
            let oldv1 = 0;
            let oldv2 = 0;
            let oldv3 = 0;
            for (let g = 0; g < jsondata.length; g++) {
                const element = jsondata[g];
                let net = element.kantar - element.dara
                row.push({...element, net: net});
                let d = element.date.split('/')[0]
                let h = element.hour.split(':')[0]
                let nowd = moment().format('DD')
                if (d === nowd) { 
                    let nett = parseFloat(element.kantar - element.dara)
                    if (h >= 0 && h <= 7) {
                        oldv1 += nett
                        setAraurunv1(oldv1)
                    } else if (h >= 8 && h <= 15) {
                        oldv2 += nett
                        setAraurunv2(oldv2)
                    } else if (h >= 16 && h <= 23) {
                        oldv3 += nett
                        setAraurunv3(oldv3)
                    }
                }
            }
            setAraurunrows(row);
        });
        axios.get("http://10.35.13.108:8501/gettoz").then((response) => {
            let jsondata = response.data;
            let row = [];
            let oldv1 = 0; 
            let oldv2 = 0;
            let oldv3 = 0;
            for (let g = 0; g < jsondata.length; g++) {
                const element = jsondata[g];
                let net = element.kantar - element.dara
                row.push({...element, net: net});

                let d = element.date.split('/')[0]
                let h = element.hour.split(':')[0]
                let nowd = moment().format('DD')
                if (d === nowd) { 
                    let nett = parseInt(element.kantar - element.dara)
                    if (h >= 0 && h <= 7) {
                        oldv1 += nett
                        setTozv1(oldv1)
                    } else if (h >= 8 && h <= 15) {
                        oldv2 += nett
                        setTozv2(oldv2)
                    } else if (h >= 16 && h <= 23) {
                        oldv3 += nett
                        setTozv3(oldv3)
                    }
                }
            }
            setTozrows(row);
        });
        axios.get("http://10.35.13.108:8501/getfindik").then((response) => {
            let jsondata = response.data;
            let row = [];
            let oldv1 = 0; 
            let oldv2 = 0;
            let oldv3 = 0;
            for (let g = 0; g < jsondata.length; g++) {
                const element = jsondata[g];
                let net = element.kantar - element.dara
                row.push({...element, net: net});

                let d = element.date.split('/')[0]
                let h = element.hour.split(':')[0]
                let nowd = moment().format('DD')
                if (d === nowd) { 
                    let nett = parseInt(element.kantar - element.dara)
                    if (h >= 0 && h <= 7) {
                        oldv1 += nett
                        setFindikv1(oldv1)
                    } else if (h >= 8 && h <= 15) {
                        oldv2 += nett
                        setFindikv2(oldv2)
                    } else if (h >= 16 && h <= 23) {
                        oldv3 += nett
                        setFindikv3(oldv3)
                    }
                }
            }
            setFindikrows(row);
        });
        axios.get("http://10.35.13.108:8501/getceviz").then((response) => {
            let jsondata = response.data;
            let row = [];
            let oldv1 = 0; 
            let oldv2 = 0;
            let oldv3 = 0;
            for (let g = 0; g < jsondata.length; g++) {
                const element = jsondata[g];
                let net = element.kantar - element.dara
                row.push({...element, net: net});

                let d = element.date.split('/')[0]
                let h = element.hour.split(':')[0]
                let nowd = moment().format('DD')
                if (d === nowd) { 
                    let nett = parseInt(element.kantar - element.dara)
                    if (h >= 0 && h <= 7) {
                        oldv1 += nett
                        setCevizv1(oldv1)
                    } else if (h >= 8 && h <= 15) {
                        oldv2 += nett
                        setCevizv2(oldv2)
                    } else if (h >= 16 && h <= 23) {
                        oldv3 += nett
                        setCevizv3(oldv3)
                    }
                }
            }
            setCevizrows(row);
        });
    }

    useEffect(() => {
        RefreshData()
        setInterval(() => {
            axios.get("http://10.35.13.108:8501/getPLCData").then((response) => {
            let jsondata = response.data;
            setAraurunseviye(jsondata.Ints.araurunseviye)
            setTozseviye(jsondata.Ints.tozseviye)
            setFindikseviye(jsondata.Ints.findikseviye)
            setCevizseviye(jsondata.Ints.cevizseviye)
        });
        
        }, 3000);
    }, [])

    function CustomToolbar(toolbar) {
        return (
            <GridToolbarContainer>
                <GridToolbarExport />
                <button onClick={RefreshData} className="bg-green-600 rounded p-1 hover:bg-green-500">TABLOYU YENILE</button>
                <p className="w-40 text-xs bg-[#1f2937] p-1 text-center font-bold">{toolbar.urun} Silo Seviyesi: {toolbar.seviye}</p>
                <p className="w-40 text-xs bg-[#1f2937] p-1 text-center font-bold">V1: {numberWithCommas(toolbar.v1)}</p>
                <p className="w-40 text-xs bg-[#1f2937] p-1 text-center font-bold">V2: {numberWithCommas(toolbar.v2)}</p>
                <p className="w-40 text-xs bg-[#1f2937] p-1 text-center font-bold">V3: {numberWithCommas(toolbar.v3)}</p>
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
            componentsProps={{ toolbar: { urun: 'Araürün', seviye: araurunseviye, v1: araurunv1, v2: araurunv2, v3: araurunv3 } }}
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
            componentsProps={{ toolbar: { urun: 'Toz', seviye: tozseviye, v1: tozv1, v2: tozv2, v3: tozv3 } }}
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
            componentsProps={{ toolbar: { urun: 'Fındık', seviye: findikseviye, v1: findikv1, v2: findikv2, v3: findikv3 } }}
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
            componentsProps={{ toolbar: { urun: 'Ceviz', seviye: cevizseviye, v1: cevizv1, v2: cevizv2, v3: cevizv3 } }}
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

