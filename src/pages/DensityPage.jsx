
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
    const [chartData, setChartData] = useState({
        labels: ['labs'],
        datasets: [
            {
                label: 'Yoğunluk',
                data: ['datasets1'],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.5
            }
        ]
    })
    const [selectedday, setSelectedday] = useState(moment().format('D'));
    const [selectedmon, setSelectedmon] = useState(moment().format('M'));
    const [selectedyear, setSelectedyear] = useState(moment().format('Y'));

    const [density, setDensity] = useState(0);

    const [ortDensity, setOrtDensity] = useState(0);


    const getData = () => {
        let labs = [];
        let datasets1 = [];
        let ortDensityArr = []
        let totDensity = 0
        axios.post('http://10.35.13.108:8001/api/getdensitydatafromdate', {
            date: `${selectedmon}-${selectedyear}`,
            dateFull: `${selectedday}-${selectedmon}-${selectedyear}`
        }).then(response => {
            let data = response.data;
            for (const cdata of data) {
                const element = cdata;
                labs.push(element.time);
                datasets1.push(element.density);
                if (element.density >= 1000){
                    ortDensityArr.push(element)
                    totDensity += element.density
                }
            }

            setOrtDensity((totDensity / ortDensityArr.length).toFixed(2))
            setChartData({
                labels: labs,
                datasets: [
                    {
                        label: 'Yoğunluk',
                        data: datasets1,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        tension: 0.5
                    }
                ]
            })
        }).then(() => {
            // console.log(firstort)
        }).catch(err => {
            console.log(err)
        })
    }
    function RefreshData(){
        axios.get("http://10.35.13.108:8001/api/getPLCData").then((response) => {
            let jsondata = response.data;
            setDensity(jsondata.d328_vals.density);
        });
    }

    useEffect(() => {
        getData();
        RefreshData()
        setInterval(() => {
            RefreshData()
        }, 3000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedday, selectedmon, selectedyear]);
    return (
        <div>
            <div className=' text-center bg-gray-800 w-[30rem] rounded mx-auto grid grid-cols-2'>
                <p className=' '>Şuanki Yoğunluk</p>
                <p className=' '>Günlük Ortalama Yoğunluk</p>
                <p className=' '>{density}</p>
                <p className=' '>{ortDensity}</p>

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
                                text: 'Tesis Manyetit Yoğunluk Kayıtları (30 Dakikada Bir)',
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
                                  text: '',
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
        </div>
    );
}
