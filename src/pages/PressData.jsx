
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
                label: '609 Durum',
                data: ['datasets1'],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.5
            },
            {
                label: '610 Durum',
                data: ['datasets2'],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
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
        axios.post('http://10.35.13.108:8001/api/getpressdatafromdate', {
            date: `${selectedmon}-${selectedyear}`,
            dateFull: `${selectedday}-${selectedmon}-${selectedyear}`
        }).then(response => {
            let data = response.data;

            for (const cdata of data) {
                const element = cdata;
                console.log(element);
                labs.push(element.time);
                datasets1.push(element.d609);
                datasets2.push(element.d610);
            }
            setChartData({
                labels: labs,
                datasets: [
                    {
                        label: 'D609 Durum',
                        data: datasets1,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        tension: 0.5
                    },
                    {
                        label: 'D610 Durum',
                        data: datasets2,
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedday, selectedmon, selectedyear]);
    return (
        <div>
            <div className=' w-full overflow-hidden p-4'>
                
                <Line 
                    style={{height: '60%', width: '80%'}}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        spanGaps: true,
                        plugins: {
                            title: {
                              display: true,
                              text: 'Filtre Press Durum Kayıtları (Dakikalık)',
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
                                  text: 'Filtre Durum',
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
            <div className='grid grid-cols-10 text-center items text-[0.65rem] bg-gray-700 rounded p-1 '>
                <div className=' border border-1 p-1 rounded w-full '>
                    <p className='bg-gray-500 rounded'>10</p> Ana Piston Geri Çekiliyor 
                </div>
                <div className=' border border-1 p-1 rounded w-full '>
                    <p className='bg-gray-500 rounded'>(20-30)</p> Araba Çalışıyor Açım Yapılıyor 
                </div>
                <div className=' border border-1 p-1 rounded w-full '>
                    <p className='bg-gray-500 rounded'>40</p> Ana Piston Basılıyor 
                </div>
                <div className=' border border-1 p-1 rounded w-full '>
                    <p className='bg-gray-500 rounded'>50</p> Ana Piston Basılıyor 2 
                </div>
                <div className=' border border-1 p-1 rounded w-full '>
                    <p className='bg-gray-500 rounded'>60</p> Press Besleniyor Rampa 1
                </div>
                <div className=' border border-1 p-1 rounded w-full '>
                    <p className='bg-gray-500 rounded'>70</p> Press Besleniyor Rampa 2
                </div>
                <div className=' border border-1 p-1 rounded w-full '>
                    <p className='bg-gray-500 rounded'>80</p> Hava Veriliyor 
                </div>
                <div className=' border border-1 p-1 rounded w-full '>
                    <p className='bg-gray-500 rounded'>(90-100-110)</p> Sıkılıyor 
                </div>
                <div className=' border border-1 p-1 rounded w-full '>
                    <p className='bg-gray-500 rounded'>(120-130-140)</p> Boşaltılıyor 
                </div>
                <div className=' border border-1 p-1 rounded w-full '>
                    <p className='bg-gray-500 rounded'>150</p> Bitti, Döngü Bekleniyor 
                </div>
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
