import { useState, useEffect } from "react";
import { DataGrid, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import axios from "axios";

const columns = [
    { align: 'center', headerAlign: 'center', flex: true, field: 'time', headerName: 'Tarih' }, 
    { align: 'center', headerAlign: 'center', flex: true, field: 'vardiya', headerName: 'Vardiya' }, 
    { align: 'center', headerAlign: 'center', flex: true, type: 'number', field: 'Slurry', headerName: 'Şlam' }, 
];

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function DataGridDemo() {
    const [rows, setRows] = useState([]);
    const [slurry, setSlurry] = useState(0);
    const [slurryhourly, setSlurryHourly] = useState(0);
    const [slurrytotal, setSlurryTotal] = useState(0);


    function RefreshData() {
        axios.get("http://10.35.13.108:8001/api/getslurrydata").then((response) => {
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

    function RefreshActualValues(){
        axios.get("http://10.35.13.108:8001/api/getPLCData").then((response) => {
            let jsondata = response.data;
            setSlurry(parseFloat(jsondata.slurrym3.toFixed(2)));
            setSlurryHourly(parseFloat(jsondata.slurryhourly.toFixed(2)));
            setSlurryTotal(parseFloat(jsondata.slurrytotal.toFixed(2)));
        });
    }

    useEffect(() => {
        RefreshData()
        RefreshActualValues()
        setInterval(() => {
            RefreshActualValues()
        }, 1000);
    }, [])

    function CustomToolbar(toolbar) {
        return (
            <GridToolbarContainer>
                <GridToolbarExport />
                <button onClick={RefreshData} className="bg-green-600 rounded p-1 hover:bg-green-500">TABLOYU YENILE</button>
                <p className=" m-2 text-xs bg-[#1f2937] p-1 text-center font-bold rounded">Anlık Geçiş: {toolbar.slurry} m³</p>
                <p className=" m-2 text-xs bg-[#1f2937] p-1 text-center font-bold rounded">Saat Başından Bu Yana Geçen: {numberWithCommas(toolbar.hourly)} m³</p>
                <p className=" m-2 text-xs bg-[#1f2937] p-1 text-center font-bold rounded">Vardiya Başından Bu Yana Geçen: {numberWithCommas(toolbar.total)} m³</p>
            </GridToolbarContainer>
        );
    }
    return (
        <div className=" h-full w-full p-2 py-20 px-40">
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
                componentsProps={{ toolbar: { urun: 'Araürün', slurry: slurry, hourly: slurryhourly, total: slurrytotal } }}
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

