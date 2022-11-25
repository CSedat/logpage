
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

    const getData = () => {
        let labs = [];
        let datasets1 = [];
        axios.post('http://10.35.13.108:8001/api/getdensitydatafromdate', {
            date: `${selectedmon}-${selectedyear}`,
            dateFull: `${selectedday}-${selectedmon}-${selectedyear}`
        }).then(response => {
            let data = response.data;
            console.log(data)
            for (const cdata of data) {
                const element = cdata;
                labs.push(element.time);
                datasets1.push(element.density);
            }
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
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedday, selectedmon, selectedyear]);
    return (
        <div>
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
            <div>
                {/* <ReactJson src={cData(selectedday, selectedmon)} theme="monokai" /> */}
            </div>
        </div>
    );
}
