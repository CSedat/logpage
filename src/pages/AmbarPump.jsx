
import {useState, useEffect} from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import moment from 'moment'
import axios from 'axios'

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
let datedays = []
// eslint-disable-next-line no-use-before-define
var dayFrom = moment(dayFrom).subtract(1,'months').endOf('month').format('DD');
dayFrom++;
for (let t = 1; t < dayFrom; t++) {
    datedays.push({
        label: t,
        value: t
    })
}
let datemons = []
for (let t = 1; t < 13; t++) {
    datemons.push({
        label: t,
        value: t
    })
}

export default function App() {
    const [statu, setStatu] = useState(0);
    const [seviye, setSeviye] = useState(0);
    const [amper, setAmper] = useState(0);
    const [chartData, setChartData] = useState({
        labels: ['labs'],
        datasets: [
            {
                label: 'Durum',
                data: ['datasets1'],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.5
            },
            {
                label: 'Seviye',
                data: ['datasets2'],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                tension: 0.5
            },
            {
                label: 'Amper',
                data: ['datasets3'],
                borderColor: 'rgb(255, 255, 0)',
                backgroundColor: 'rgba(255, 255, 0, 0.5)',
                tension: 0.5
            },
        ]
    })
    const [selectedday, setSelectedday] = useState(moment().format('D'));
    const [selectedmon, setSelectedmon] = useState(moment().format('M'));
    const [selectedyear, setSelectedyear] = useState(moment().format('Y'));

    const getData = () => {
        let labs = [];
        let datasets1 = [];
        let datasets2 = [];
        let datasets3 = [];
        axios.post('http://10.35.13.108:8001/api/getambardatafromdate', {
            date: `${selectedmon}-${selectedyear}`,
            dateFull: `${selectedday}-${selectedmon}-${selectedyear}`
        }).then(response => {
            let data = response.data;
            
            for (const cdata of data) {
                const element = cdata;
                labs.push(element.time);
                datasets1.push(element?.status);
                datasets2.push(element?.seviye);
                datasets3.push(element?.amper);
            }
            setChartData({
                labels: labs,
                datasets: [
                    {
                        label: 'Durum',
                        data: datasets1,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        tension: 0.5
                    },
                    {
                        label: 'Seviye',
                        data: datasets2,
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        tension: 0.5
                    },
                    {
                        label: 'Amper',
                        data: datasets3,
                        borderColor: 'rgb(255, 255, 0)',
                        backgroundColor: 'rgba(255, 255, 0, 0.5)',
                        tension: 0.5
                    },
                ]
            })
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        getData();
        RefreshData()
        setInterval(() => {
            RefreshData()
        }, 2500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedday, selectedmon, selectedyear]);

    function RefreshData(){
        axios.get("http://10.35.13.108:8001/api/getPLCData").then((response) => {
            let jsondata = response.data;
            setStatu(jsondata.ambarstatus);
            setSeviye((jsondata.ambarseviye).toFixed(2));
            setAmper(jsondata.ambaramper);
        });
    }
    return (
        <div>
            <div className=' mx-auto p-1 m-1 bg-gray-700 rounded text-white w-1/3  text-center grid grid-cols-3'>
                <p>Durum: {statu === 1 ? 'Çalışıyor' : statu === 2 ? 'Çalışmıyor' : statu === 3 ? 'Acil Stop' : statu === 4 ? 'Termik Atık' : 'Bilinmiyor' }</p>
                <p>Seviye: {seviye}</p>
                <p>Amper: {amper}</p>
            </div>
            <div className=' h-50 w-full overflow-hidden p-4'>
                <Line 
                    style={{height: '80%', width: '80%'}}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        spanGaps: true,
                        plugins: {
                            title: {
                              display: true,
                              text: 'Ambar Pompa Kayıtları (Dakikalık)',
                              color: "white"
                            },
                            legend: {
                                labels: {
                                  color: "white",
                                  font: {
                                    size: 14
                                  }
                                }
                              }
                        },
                        interaction: {
                          intersect: false,
                        },
                        scales: {
                            x: {
                              display: true,
                              title: {
                                    display: true,
                                    
                              },
                              ticks: {
                                color: "white"
                              }
                            },
                            y: {
                                suggestedMin: 0,
                                display: true,
                                title: {
                                  display: true,
                                  text: '10 Çalışıyor 20 Çalışmıyor 30 Acil Stop 40 Termik Hata',
                                  color: "white"
                                },
                                ticks: {
                                  color: "white"
                                },
                            }
                        },
                        elements: {
                            point:{
                                radius: 0
                            }
                        }
                    }}
                    data={chartData} 

                />
            </div>
            <div className='mx-auto text-right w-[23rem] grid grid-cols-6 gap-1 bg-gray-800 rounded'>
                <label>Gün:</label>
                <select className=' w-16 bg-gray-500 text-white rounded' onChange={(e) => {setSelectedday(e.target.value); }} name="" id="">
                    {datedays.map((r) => (
                        <option selected={ Number(r.value) === Number(selectedday)} value={r.value}>{r.label}</option>
                    ))}
                </select>
                <label>Ay:</label>
                <select className=' w-16 bg-gray-500 text-white rounded' onChange={(e) => {setSelectedmon(e.target.value); }} name="" id="">
                    {datemons.map((r) => (
                        <option selected={ Number(r.value) === Number(selectedmon)} value={r.value}>{r.label}</option>
                    ))}
                </select>
                <label>Yıl:</label> 
                <select className=' w-16 bg-gray-500 text-white rounded' onChange={(e) => {setSelectedyear(e.target.value); }} name="year" id="id">
                    <option value='2022'>2022</option>
                    <option value='2023'>2023</option>
                </select>

            </div>
            <div>
                {/* <ReactJson src={cData(selectedday, selectedmon)} theme="monokai" /> */}
            </div>
        </div>
    );
}
