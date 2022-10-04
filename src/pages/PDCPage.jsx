import { useState, useEffect } from "react";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import axios from "axios";
import Box from '@mui/material/Box';

const columns = [
    { align: 'center', headerAlign: 'center', flex: true, field: 'time', headerName: 'Tarih' }, 
    { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'vardiya', headerName: 'Vardiya' }, 
    { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'BC1B_PDC1', headerName: 'BC1B-1' }, 
    { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'BC1B_PDC2', headerName: 'BC1B-2' }, 
    { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'D301_PDC1', headerName: '301-1' }, 
    { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'D301_PDC2', headerName: '301-2' }, 
    { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'D701', headerName: '701 (Ceviz)' }, 
    { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'D705', headerName: '705 (Fındık)' }, 
    { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'D706', headerName: '706 (Toz)' }, 
    { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'D707', headerName: '707 (Araürün)' }, 
    { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'D710', headerName: '710 (Taş)' }, 
    { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'Slurry', headerName: 'Şlam (m³)' }, 
    { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'Keson', headerName: 'Keson (m³)' }, 
    { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'kWh', headerName: 'kWh' }, 
    { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'kWhvard', headerName: 'kWh Vardiyalık' }, 
];

export default function DataGridDemo() {
    const [rows, setRows] = useState([]);
    const [bc1b_1, setBc1b_1] = useState(0);
    const [bc1b_2, setBc1b_2] = useState(0);
    const [d301_1, setD301_1] = useState(0);
    const [d301_2, setD301_2] = useState(0);
    const [d701, setD701] = useState(0);
    const [d705, setD705] = useState(0);
    const [d706, setD706] = useState(0);
    const [d707, setD707] = useState(0);
    const [d710, setD710] = useState(0);
    function RefreshData() {
        axios.get("http://10.35.13.108:8001/api/getpdcdata").then((response) => {
            let jsondata = response.data;
            let row = [];
            let id = 1;
            for (let g = 0; g < jsondata.length; g++) {
                const element = jsondata[g];
                row.push({...element, id: id});
                id++;
            }
            setRows(row);
        });
    }

    function RefreshPDCData(){
        axios.get("http://10.35.13.108:8001/api/getPLCData").then((response) => {
            let jsondata = response.data;
            setBc1b_1(jsondata.crusherpdc.bc1b_1);
            setBc1b_2(jsondata.crusherpdc.bc1b_2);
            setD301_1(jsondata.mainplcpdc.d301_1);
            setD301_2(jsondata.mainplcpdc.d301_2);
            setD701(jsondata.mainplcpdc.d701);
            setD705(jsondata.mainplcpdc.d705);
            setD706(jsondata.mainplcpdc.d706);
            setD707(jsondata.mainplcpdc.d707);
            setD710(jsondata.mainplcpdc.d710);
        });
    }

    useEffect(() => {
        RefreshData()
        RefreshPDCData()
        setInterval(() => {
            RefreshPDCData()
        }, 3000);
    }, [])

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarExport />
                <button onClick={RefreshData} className="bg-green-600 rounded p-1 hover:bg-green-500">TABLOYU YENILE</button>
                <p className="w-40 bg-[#1f2937] p-1 text-center font-bold">Vardiya Tonajları</p>
                <p className="w-40 bg-[#1f2937] p-1 text-center font-bold">1B-1: {bc1b_1}</p>
                <p className="w-40 bg-[#1f2937] p-1 text-center font-bold">1B-2: {bc1b_2}</p>
                <p className="w-40 bg-[#1f2937] p-1 text-center font-bold">301-1: {d301_1}</p>
                <p className="w-40 bg-[#1f2937] p-1 text-center font-bold">301-2: {d301_2}</p>
                <p className="w-40 bg-[#1f2937] p-1 text-center font-bold">701: {d701}</p>
                <p className="w-40 bg-[#1f2937] p-1 text-center font-bold">705: {d705}</p>
                <p className="w-40 bg-[#1f2937] p-1 text-center font-bold">706: {d706}</p>
                <p className="w-40 bg-[#1f2937] p-1 text-center font-bold">707: {d707}</p>
                <p className="w-40 bg-[#1f2937] p-1 text-center font-bold rounded-r">710: {d710}</p>
            </GridToolbarContainer>
        );
    }
  return (
    <div className=" h-full w-full p-6">

        <Box
          sx={{
            height: '100%',
            width: '100%',
            '& .dark': {
              backgroundColor: '#1f2937',
              color: 'white',
              borderRadius: 2
            }
          }}
        >
            <DataGrid
                rows={rows}
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
        </Box>
    </div>
  );
}

