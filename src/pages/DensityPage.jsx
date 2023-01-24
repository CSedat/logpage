import { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import moment from "moment";
import axios from "axios";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
let datedays = [];
// eslint-disable-next-line no-use-before-define
var dayFrom = moment(dayFrom).subtract(1, "months").endOf("month").format("DD");
dayFrom++;
for (let t = 1; t < dayFrom; t++) {
    datedays.push({
        label: t,
        value: t,
    });
}
let datemons = [];
for (let t = 1; t < 13; t++) {
    datemons.push({
        label: t,
        value: t,
    });
}

export default function App() {
    const [chartData, setChartData] = useState({
        labels: ["labs"],
        datasets: [
            {
                label: "Yoğunluk",
                data: ["datasets1"],
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                tension: 0.5,
            },
        ],
    });
    const [selectedday, setSelectedday] = useState(moment().format("D"));
    const [selectedmon, setSelectedmon] = useState(moment().format("M"));
    const [selectedyear, setSelectedyear] = useState(moment().format("Y"));

    const [density, setDensity] = useState(0);

    const [ortDensity, setOrtDensity] = useState(0);

    const [v1DensityOrt, setV1DensityOrt] = useState(0);
    const [v2DensityOrt, setV2DensityOrt] = useState(0);
    const [v3DensityOrt, setV3DensityOrt] = useState(0);

    const getData = () => {
        let labs = [];
        let datasets1 = [];
        let ortDensityArr = [];
        let v1OrtDensityArr = [];
        let v2OrtDensityArr = [];
        let v3OrtDensityArr = [];
        let totDensity = 0;
        let v1totDensity = 0;
        let v2totDensity = 0;
        let v3totDensity = 0;
        axios
            .post("http://10.35.13.108:8001/api/getdensitydatafromdate", {
                date: `${selectedmon}-${selectedyear}`,
                dateFull: `${selectedday}-${selectedmon}-${selectedyear}`,
            })
            .then((response) => {
                let data = response.data;
                for (const cdata of data) {
                    const element = cdata;
                    const time = parseInt(
                        element.time.split(" ")[0].split(":")[0]
                    );
                    labs.push(element.time);
                    datasets1.push(element.density);
                    if (element.density >= 1000) {
                        ortDensityArr.push(element);
                        totDensity += element.density;
                        if (time >= 0 && time <= 7) {
                            v1OrtDensityArr.push(element);
                            v1totDensity += element.density;
                        } else if (time >= 8 && time <= 15) {
                            v2OrtDensityArr.push(element);
                            v2totDensity += element.density;
                        } else if (time >= 16 && time <= 23) {
                            v3OrtDensityArr.push(element);
                            v3totDensity += element.density;
                        }
                    }
                }

                setOrtDensity(
                    (totDensity / ortDensityArr.length)
                        .toFixed(2)
                        .replaceAll("NaN", "0")
                );
                setV1DensityOrt(
                    (v1totDensity / v1OrtDensityArr.length)
                        .toFixed(2)
                        .replaceAll("NaN", "0")
                );
                setV2DensityOrt(
                    (v2totDensity / v2OrtDensityArr.length)
                        .toFixed(2)
                        .replaceAll("NaN", "0")
                );
                setV3DensityOrt(
                    (v3totDensity / v3OrtDensityArr.length)
                        .toFixed(2)
                        .replaceAll("NaN", "0")
                );
                setChartData({
                    labels: labs,
                    datasets: [
                        {
                            label: "Yoğunluk",
                            data: datasets1,
                            borderColor: "rgb(255, 99, 132)",
                            backgroundColor: "rgba(255, 99, 132, 0.5)",
                            tension: 0.5,
                        },
                    ],
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };
    function RefreshData() {
        axios
            .get("http://10.35.13.108:8001/api/getPLCData")
            .then((response) => {
                let jsondata = response.data;
                setDensity(jsondata.d328_vals.density);
            });
    }

    useEffect(() => {
        getData();
        RefreshData();
        setInterval(() => {
            RefreshData();
        }, 3000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedday, selectedmon, selectedyear]);
    return (
        <div>
            <div className=" text-center bg-gray-800 w-[30rem] rounded mx-auto grid grid-cols-5 border">
                <p className="text-sm border-r border-b">Şuanki Yoğunluk</p>
                <p className="text-sm border-r border-b">Günlük Ort Yoğunluk</p>
                <p className="text-sm border-r border-b">V1 Ort Yoğunluk</p>
                <p className="text-sm border-r border-b">V2 Ort Yoğunluk</p>
                <p className="text-sm border-b">V3 Ort Yoğunluk</p>
                <p className="text-sm border-r border-b">{density}</p>
                <p className="text-sm border-r border-b">{ortDensity}</p>
                <p className="text-sm border-r border-b">{v1DensityOrt}</p>
                <p className="text-sm border-r border-b">{v2DensityOrt}</p>
                <p className="text-sm border-b">{v3DensityOrt}</p>

                <div className="mx-auto text-right w-[27rem] grid grid-cols-6 gap-1 bg-gray-800 col-span-5 m-1">
                    <label>Gün:</label>
                    <select
                        className=" w-16 bg-gray-500 text-white rounded"
                        onChange={(e) => {
                            setSelectedday(e.target.value);
                        }}
                        name=""
                        id=""
                    >
                        {datedays.map((r) => (
                            <option
                                selected={
                                    Number(r.value) === Number(selectedday)
                                }
                                value={r.value}
                            >
                                {r.label}
                            </option>
                        ))}
                    </select>
                    <label>Ay:</label>
                    <select
                        className=" w-16 bg-gray-500 text-white rounded"
                        onChange={(e) => {
                            setSelectedmon(e.target.value);
                        }}
                        name=""
                        id=""
                    >
                        {datemons.map((r) => (
                            <option
                                selected={
                                    Number(r.value) === Number(selectedmon)
                                }
                                value={r.value}
                            >
                                {r.label}
                            </option>
                        ))}
                    </select>
                    <label>Yıl:</label>
                    <select
                        className=" w-16 bg-gray-500 text-white rounded"
                        onChange={(e) => {
                            setSelectedyear(e.target.value);
                        }}
                        name="year"
                        id="id"
                    >
                        <option value="2022">2022</option>
                        <option value="2023" selected>2023</option>
                    </select>
                </div>
            </div>

            <div className=" h-50 w-full overflow-hidden p-4">
                <Line
                    style={{ height: "60%", width: "70%" }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        spanGaps: true,
                        plugins: {
                            title: {
                                display: true,
                                text: "Tesis Manyetit Yoğunluk Kayıtları (30 Dakikada Bir)",
                                color: "white",
                            },
                            legend: {
                                labels: {
                                    color: "white",
                                    font: {
                                        size: 14,
                                    },
                                },
                            },
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
                                    color: "white",
                                },
                            },
                            y: {
                                suggestedMin: 0,
                                display: true,
                                title: {
                                    display: true,
                                    text: "",
                                    color: "white",
                                },
                                ticks: {
                                    color: "white",
                                },
                            },
                        },
                        elements: {
                            point: {
                                radius: 0,
                            },
                        },
                    }}
                    data={chartData}
                />
            </div>
        </div>
    );
}
