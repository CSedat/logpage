var http = require('http');
var static = require('node-static');
var fileServer = new static.Server('./client');
var port = process.env.PORT || 8000;
var nodes7 = require('nodes7');

http.createServer(function (req, res) {
    fileServer.serve(req, res);
    // if (req.url != "/") {
    //     console.log('Page redirected to /');
    //     res.writeHead(302, {
    //         location: "http://10.35.13.108:8000",
    //     });
    //     res.end();
    // }
}).listen(port);
console.log(`Http server running at http://127.0.0.1:${port}/`);

const express = require("express");
const cors = require('cors')
const fs = require('fs');
const appport = 8001
const app = express();
const bodyParser = require('body-parser')
const moment = require('moment');
const XLSX = require("xlsx");
const path = require('path');

var plcdata = {
    slurrym3: 0,
    slurryhourly: 0,
    slurrytotal: 0,
    ambarstatus: 0,
    ambarseviye: 0,
    lavvarkwh: 0,
    crusherkwh: 0,
    crusherpdc:{
        bc1b_1: 0,
        bc1c_2: 0,
    },
    mainplcpdc: {
        d301_1: 0,
        d301_2: 0,
        d701: 0,
        d705: 0,
        d706: 0,
        d707: 0,
        d710: 0,
    },
    d328_vals: {
        voltage: 0,
        current: 0,
        density: 0,
        level: 0,
        kw: 0,
        kwh: 0,
    },
    D609Status: 0,
    D610Status: 0,
    Silolar: {
        rom: 0,
        ceviz: 0,
        findik: 0,
        toz: 0,
        araurun: 0,
    }
}

var plcConnection = {
    maincpu: true,
    d609cpu: true,
    d610cpu: true,
    ambarcpu: true,
    crushercpu: true,
}


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const users = [
    {
        id: 1,
        username: "sedatcapar",
        password: "ss1q2w",
        roles:['pdc', 'yks', 'slurry', 'kmadde', 'ambar', 'press', 'density', 'works', 'elektrik']
    },
    {
        id: 2,
        username: "tunahansimsek",
        password: "1925",
        roles:['pdc', 'yks', 'slurry', 'kmadde', 'ambar', 'press', 'density', 'works', 'elektrik']
    },
    {
        id: 3,
        username: "irfansariyar",
        password: "özürdilerimtunahan",
        roles:['pdc', 'yks', 'slurry', 'kmadde', 'ambar', 'press', 'density', 'works']
    },
    {
        id: 4,
        username: "tansukoralay",
        password: "ts1q2w",
        roles:['pdc', 'yks', 'slurry', 'kmadde', 'ambar', 'press', 'density', 'works']
    },
    {
        id: 5,
        username: "kontrolmerkezi",
        password: "Pe123456@",
        roles:['pdc', 'yks', 'slurry', 'ambar', 'press', 'density']
    },
    {
        id: 6,
        username: "laboratuvar",
        password: "7452",
        roles:['pdc', 'slurry', 'kmadde']
    },
    {
        id: 7,
        username: "kaanuzuner",
        password: "ku123456.",
        roles:['pdc', 'yks', 'slurry', 'kmadde', 'ambar', 'density']
    },
    {
        id: 8,
        username: "aysunkupcu",
        password: "ak123456..",
        roles:['pdc', 'slurry', 'kmadde']
    },
    {
        id: 9,
        username: "mehmetkelesoglu",
        password: "mk123456",
        roles:['pdc', 'slurry', 'kmadde', 'ambar', 'density']
    },
    {
        id: 10,
        username: "alicanyuzbasi",
        password: "ac123456",
        roles:['pdc', 'yks', 'slurry', 'kmadde', 'ambar']
    },
    {
        id: 11,
        username: "elektrik",
        password: "741369",
        roles:['pdc', 'yks', 'slurry', 'kmadde', 'ambar', 'press', 'density', 'works', 'elektrik']
    },
	{
        id: 11,
        username: "mehmetgec",
        password: "mg123456.",
        roles:['pdc', 'yks', 'slurry', 'kmadde', 'ambar', 'works']
    	},
]

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.set("view engine", "pug");

var mainPLC = new nodes7;
mainPLC.initiateConnection({
    port: 102,
    host: '10.35.17.10',
    rack: 0,
    slot: 1,
    timeout: 3000,
    debug: true
}, mainPLCconnected);
var ambarPLC = new nodes7;
var ambarPLCvariables = {
    status: 'DB2,INT2',
    seviye: 'DB1,REAL0',
};
ambarPLC.initiateConnection({
    port: 102,
    host: '10.35.14.184',
    rack: 0,
    slot: 1,
    timeout: 3000,
    debug: true
}, ambarPLCconnected);
var D609_Press = new nodes7;
var D609_Pressvariables = {
    status: 'DB150,INT0',
};
D609_Press.initiateConnection({
    port: 102,
    host: '10.35.17.40',
    rack: 0,
    slot: 1,
    timeout: 3000,
    debug: true
}, D609_Pressconnected);
var crusherPLC = new nodes7;
var crusherPLCvariables = {
    crusherkhw: 'MR152',
    bc1bpdc1: 'DB57,REAL0',
    bc1bpdc2: 'DB57,REAL18',
};
crusherPLC.initiateConnection({
    port: 102,
    host: '10.35.17.11',
    rack: 0,
    slot: 1,
    timeout: 3000,
    debug: true
}, crusherPLCconnected);
var D610_Press = new nodes7;
var D610_Pressvariables = {
    status: 'DB150,INT0',
};
D610_Press.initiateConnection({
    port: 102,
    host: '10.35.17.50',
    rack: 0,
    slot: 1,
    timeout: 3000,
    debug: true
}, D610_Pressconnected);


app.post("/auth", function (req, res) {
    let data = req.body;
    let user = users.find((user) => user.username === data.username);
    let date = moment().format('HH:mm:ss DD/MM/YY')
    if (user) {
        if (user.password === data.password) {
            res.send({ status: "success", user: user });
            console.log(`${date} ${user.username} giriş yaptı.`)
        } else {
            res.send({ status: "error", message: "Şifre yanlış" });
            console.log(`${date} ${user.username} yanlış şifre denedi.`)
        }
    } else {
        res.send({ status: "error", message: "Kullanıcı bulunamadı." });
        console.log(`${date} Kullanıcı bulunamadı.`)
    }
});

app.get('/api/getpdcdata', function (req, res) {
    res.sendFile('./data.json', { root: __dirname });
});

app.get('/api/getslurrydata', function (req, res) {
    res.sendFile('./slurrydata.json', { root: __dirname });
});

app.get('/api/getambardata', function (req, res) {
    res.sendFile('./ambardata.json', { root: __dirname });
});

app.get('/api/getlabdata', function (req, res) {
    res.sendFile('./laboratuvar/data.json', { root: __dirname });
});

app.get('/api/getworksdata', function (req, res) {
    res.sendFile('./works/works.json', { root: __dirname });
});

app.post('/api/labdatasavenem', function (req, res) {
    var data = req.body;
    
    fs.readFile(`./laboratuvar/data.json`, null, function (error, r) {
        if (error) {console.log(error);res.send('error');return}
        let d = JSON.parse(r);
        for (let l = 0; l < d.length; l++) {
            let element = d[l];
            if (element.id == data.id) {
                element['nemdata'] = data;
                fs.writeFile('./laboratuvar/data.json', JSON.stringify(d), err => {
                    if (err) throw err;
                    console.log(`${data.id} nem saved!`);
                });
                res.send('success');
                break;
            }
        }
    });
});

app.post('/api/labdatayogunluk', function (req, res) {
    var data = req.body;

    fs.readFile(`./laboratuvar/data.json`, null, function (error, r) {
        if (error) {console.log(error);res.send('error');return}
        let d = JSON.parse(r);
        for (let l = 0; l < d.length; l++) {
            let element = d[l];
            if (element.id == data.id) {
                element['yogunluk'] = data.yogunluk;
                fs.writeFile('./laboratuvar/data.json', JSON.stringify(d), err => {
                    if (err) throw err;
                    console.log(`${data.id} yoğunluk saved!`);
                });
                res.send('success');
                break;
            }
        }
    });
});

app.post('/api/getambardatafromdate', function (req, res) {
    var date = req.body.date;
    var dateFull = req.body.dateFull;
    fs.readFile(`./ambardata/${date}/${dateFull}.json`, null, function (error, data) {
        if (error) {
            console.log(error);
            res.send('error');
            return
        }
        res.send(data);
    });
});

app.post('/api/getpressdatafromdate', function (req, res) {
    var date = req.body.date;
    var dateFull = req.body.dateFull;
    let data = fs.readFileSync(`./pressdata/${date}/${dateFull}.json`);
    res.send(data);
});

app.post('/api/getdensitydatafromdate', function (req, res) {
    var date = req.body.date;
    var dateFull = req.body.dateFull;
    fs.readFile(`./density/${date}/${dateFull}.json`, null, function (error, data) {
        if (error) {
            console.log(error);
            res.send('error');
            return
        }
        res.send(data);
    });
});

app.get('/api/saveslurry', function (req, res) {
    res.destroy();
    const prof = new Promise(function (resolve, reject) {
        try {
            resolve(req.query);
        } catch (e) {
            
            console.log(e);
        }
    })

    prof.then(function (jsondata) {
        if (jsondata == undefined) { jsondata = 0; }
        var json = fs.readFileSync('./slurrydata.json');
        var Obj = JSON.parse(json);
        var ss = moment().format('H');
        let vard
        if (ss >= 0 && ss <= 7) {
            vard = "V1";
        } else if (ss >= 8 && ss <= 15) {
            vard = "V2";
        } else if (ss >= 16 && ss <= 23) {
            vard = "V3";
        }

        // for (var k in Obj) {
        // var ob = Obj[k];
        // var now = moment().unix();
        // var endTime = ob.timestamp;

        // if (now > endTime + 3600*12) {
        // Obj.splice(k,1);
        // }
        // }

        Obj.unshift({
            time: GetDate(true),
            vardiya: vard,
            Slurry: parseInt(jsondata["Slurry"]).toFixed(),
        });
        var newData = JSON.stringify(Obj);
        fs.writeFile('./slurrydata.json', newData, err => {
            if (err) throw err;
            console.log(`${GetDate(true)} saved!`);
        });
    }).catch(function (hata) {
        console.log(hata)
    })
    if (moment().format('H') == 0) {
        setTimeout(function () {
            var prof = new Promise(function (resolve, reject) {
                fs.readFile('./slurrydata.json', null, function (error, data) {
                    if (error) {  console.log(error); }
                    var jdata = JSON.parse(data)
                    var Slurry = 0;
                    for (var i in jdata.slice(0, 23)) {
                        Slurry += parseInt(jdata[i].Slurry);
                    }
                    jdata.unshift({
                        time: GetDate(),
                        vardiya: "Toplam",
                        Slurry,
                    });
                    fs.writeFile('./slurrydata.json', JSON.stringify(jdata), err => {
                        if (err) throw err;
                        console.log(`${GetDate()} Total saved!`);
                    });
                    resolve(true)
                });
            })
            prof.then(function (jsondata) {

            }).catch(function (hata) {
                console.log(hata)
            })
        }, 1000);
    }
});


app.get("/takeX", (req, res) => {
    res.destroy();
    const prof = new Promise(function (resolve, reject) {
        try {
            resolve(req.query);
        } catch (e) {
            console.log(e);
        }
    })

    prof.then(function (jsondata) {
        if (jsondata == undefined) { jsondata = 0; }
        var json = fs.readFileSync('./data.json');
        var Obj = JSON.parse(json);
        var labdata = fs.readFileSync('./laboratuvar/data.json');
        var labjson = JSON.parse(labdata);
        var ss = moment().format('H');
        let vard
        if (ss >= 0 && ss <= 7) {
            vard = "V1";
        } else if (ss >= 8 && ss <= 15) {
            vard = "V2";
        } else if (ss >= 16 && ss <= 23) {
            vard = "V3";
        }

        // for (var k in Obj) {
        // var ob = Obj[k];
        // var now = moment().unix();
        // var endTime = ob.timestamp;

        // if (now > endTime + 3600*12) {
        // Obj.splice(k,1);
        // }
        // }

        Obj.unshift({
            time: GetDate(),
            vardiya: vard,
            BC1B_PDC1: parseInt(jsondata["BC1BPDC1"]).toFixed(),
            BC1B_PDC2: parseInt(jsondata["BC1BPDC2"]).toFixed(),
            D301_PDC1: parseInt(jsondata["D301PDC1"]).toFixed(),
            D301_PDC2: parseInt(jsondata["D301PDC2"]).toFixed(),
            D701: parseInt(jsondata["D701"]).toFixed(),
            D705: parseInt(jsondata["D705"]).toFixed(),
            D706: parseInt(jsondata["D706"]).toFixed(),
            D707: parseInt(jsondata["D707"]).toFixed(),
            D710: parseInt(jsondata["D710"]).toFixed(),
            Slurry: parseInt(jsondata["Slurry"]).toFixed(),
            Keson: parseInt(jsondata["Keson"]).toFixed(),
            kWh: (plcdata.lavvarkwh + plcdata.crusherkwh),
            kWhvard: ((plcdata.lavvarkwh + plcdata.crusherkwh) - Obj[0].kWh),
        });
        var newData = JSON.stringify(Obj);
        fs.writeFile('./data.json', newData, err => {
            if (err) throw err;
            console.log(`${vard} PDC saved!`);
        });

        labjson.unshift({
            id: Date.now(),
            slurry: parseInt(jsondata["Slurry"]).toFixed(),
            time: GetDate(),
            vardiya: vard,
            nemdata: {},
            yogunluk: null,
        });
        var newLabData = JSON.stringify(labjson);
        fs.writeFile('./laboratuvar/data.json', newLabData, err => {
            if (err) throw err;
            console.log(`${vard} Lab saved!`);
        });
    }).catch(function (hata) {
        console.log(hata)
    })
    if (moment().format('H') == 23) {
        setTimeout(function () {
            var prof = new Promise(function (resolve, reject) {
                fs.readFile('./data.json', null, function (error, data) {
                    if (error) {  console.log(error); }
                    var jdata = JSON.parse(data)
                    var BC1B_PDC1 = 0, BC1B_PDC2 = 0, D301_PDC1 = 0, D301_PDC2 = 0, D701 = 0, D705 = 0, D706 = 0, D707 = 0, D710 = 0, Keson = 0, Slurry = 0, kWh = (plcdata.lavvarkwh + plcdata.crusherkwh), kWhvard = 0;
                    for (var i in jdata.slice(0, 3)) {
                        BC1B_PDC1 += parseInt(jdata[i].BC1B_PDC1);
                        BC1B_PDC2 += parseInt(jdata[i].BC1B_PDC2);
                        D301_PDC1 += parseInt(jdata[i].D301_PDC1);
                        D301_PDC2 += parseInt(jdata[i].D301_PDC2);
                        D701 += parseInt(jdata[i].D701);
                        D705 += parseInt(jdata[i].D705);
                        D706 += parseInt(jdata[i].D706);
                        D707 += parseInt(jdata[i].D707);
                        D710 += parseInt(jdata[i].D710);
                        Keson += parseInt(jdata[i].Keson);
                        Slurry += parseInt(jdata[i].Slurry);
                        kWhvard += parseInt(jdata[i].kWhvard);
                    }
                    jdata.unshift({
                        time: GetDate(),
                        vardiya: "Toplam",
                        BC1B_PDC1,
                        BC1B_PDC2,
                        D301_PDC1,
                        D301_PDC2,
                        D701,
                        D705,
                        D706,
                        D707,
                        D710,
                        Keson,
                        Slurry,
                        kWh,
                        kWhvard,
                    });

                    var labdata = fs.readFileSync('./laboratuvar/data.json');
                    var labjson = JSON.parse(labdata);
                    labjson.unshift({
                        id: Date.now(),
                        slurry: Slurry,
                        time: GetDate(),
                        vardiya: "Toplam",
                        nemdata: {},
                        yogunluk: null,
                    });
                    var newLabData = JSON.stringify(labjson);
                    fs.writeFile('./laboratuvar/data.json', newLabData, err => {
                        if (err) throw err;
                        console.log(`Toplam Lab total saved!`);
                    });


                    fs.writeFile('./data.json', JSON.stringify(jdata), err => {
                        if (err) throw err;
                        console.log(`${GetDate(false)} Total saved!`);
                    });
                    resolve(true)
                });
            })
            prof.then(function (jsondata) {

            }).catch(function (hata) {
                console.log(hata)
            })
        }, 1000);
    }
})


function GetDate(bool) {
    if (bool) {
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes();
        return `${time} ${date}`;
    } else {
        var today = new Date();
        var date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes();
        return `${date}`;
    }
}

var mainPLCvariables = {
    m3Slurry: 'DB80,REAL0',
    SlurryTotal: 'DB80,REAL16',
    HourlySlurry: 'DB80,REAL24',
    Pac3200: 'DB79,LREAL144',
    MainPLCMBPdc: 'DB69,REAL48.6',
    MainPLCPdc710: 'DB13,REAL20',
    D328Values: 'DB85,REAL8',
    Silolar: 'DB88,INT0.5',
};

function mainPLCconnected(err) {
    if (typeof (err) !== "undefined") {
        console.log('\x1b[31m', `Main PLC bağlantısı kurulamadı` ,'\x1b[0m');
        plcConnection.maincpu = false;
    }
    mainPLC.setTranslationCB(function (tag) {
        return mainPLCvariables[tag];
    });
    mainPLC.addItems(['m3Slurry', 'HourlySlurry', 'SlurryTotal', 'Pac3200', 'MainPLCMBPdc', 'MainPLCPdc710', 'D328Values', 'Silolar']);
    mainPLC.readAllItems(valuesReady);
}
function valuesReady(err, values) {
    if (err) { console.log('\x1b[31m', `s7-1500 Plc Bağlantısı Yok yada Okunan Değerlerde Hata Var` ,'\x1b[0m'); plcConnection.maincpu = false;}else{plcConnection.maincpu = true;}
    if(plcConnection.maincpu == true){
        mainPLC.readAllItems(valuesReady);
        plcdata.slurrym3 = parseInt(values.m3Slurry.toFixed(2));
        plcdata.slurryhourly = values.HourlySlurry;
        plcdata.slurrytotal = parseInt(values.SlurryTotal.toFixed(2));
        plcdata.lavvarkwh = parseInt(values.Pac3200.toFixed());
        plcdata.mainplcpdc = {
            d301_1: parseInt(values.MainPLCMBPdc[0].toFixed()),
            d301_2: parseInt(values.MainPLCMBPdc[1].toFixed()),
            d701: parseInt(values.MainPLCMBPdc[2].toFixed()),
            d705: parseInt(values.MainPLCMBPdc[3].toFixed()),
            d706: parseInt(values.MainPLCMBPdc[4].toFixed()),
            d707: parseInt(values.MainPLCMBPdc[5].toFixed()),
            d710: parseInt(values.MainPLCPdc710.toFixed()),
        }
        plcdata.d328_vals = {
            density: values.D328Values.toFixed(2),
        }
        plcdata.Silolar = {
            rom: values.Silolar[0],
            ceviz: values.Silolar[1],
            findik: values.Silolar[2],
            toz: values.Silolar[3],
            araurun: values.Silolar[4]
        }
    }
}

app.get('/api/getPLCData', function (req, res) {
    res.send(plcdata);
});

app.get('/api/getPLCConnections', function (req, res) {
    res.send(plcConnection);
});

function ambarPLCconnected(err) {
    if (typeof (err) !== "undefined") {
        console.log('\x1b[31m', `Ambar PLC bağlantısı kurulamadı` ,'\x1b[0m');
        plcConnection.ambarcpu = false;
    }
    ambarPLC.setTranslationCB(function (tag) {
        return ambarPLCvariables[tag];
    });
    ambarPLC.addItems(['status', 'seviye']);
    ambarPLC.readAllItems(ambarPLCvaluesReady);
}
function ambarPLCvaluesReady(err, values) {
    if (err) { console.log('\x1b[31m', `Ambar Plc Bağlantısı Yok yada Okunan Değerlerde Hata Var` ,'\x1b[0m'); plcConnection.ambarcpu = false; return }else{plcConnection.ambarcpu = true;}
    if(plcConnection.ambarcpu == true){
        ambarPLC.readAllItems(ambarPLCvaluesReady);
        plcdata.ambarstatus = values.status;
        plcdata.ambarseviye = values.seviye;
    }
}

function GetFileDate(bb) {
    var today = new Date();
    if(bb){
        var date = (today.getMonth() + 1) + '-' + today.getFullYear();
        return date;
    }else{
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        return date;
    }
}
function SaveAmbarData() {
    fs.readFile(`./ambardata/${GetFileDate(true)}/${GetFileDate()}.json`, null, function (error, data) {
        if (error) {  console.log(error); }
        var amdata = JSON.parse(data)
        let status = 0;
        if (plcdata.ambarstatus === 1) {
            status = 10;
        } else if (plcdata.ambarstatus === 2){
            status = 20;
        } else if (plcdata.ambarstatus === 3){
            status = 30;
        } else if (plcdata.ambarstatus === 4){
            status = 40;
        } else {
            status = 0;
        }
        amdata.push({
            time: GetDate(true),
            status: status,
            seviye: plcdata.ambarseviye,
        });
        fs.writeFile(`./ambardata/${GetFileDate(true)}/${GetFileDate()}.json`, JSON.stringify(amdata), err => {
            if (err) throw err;
        });
    });
}
setInterval(() => {
    var dir = `./ambardata/${GetFileDate(true)}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
        console.log('\x1b[32m', `${dir} directory created.` ,'\x1b[0m');
        fs.readFile(`./ambardata/${GetFileDate(true)}/${GetFileDate()}.json`, null, function (error, data) {
            if (error) {  
                fs.appendFile(`./ambardata/${GetFileDate(true)}/${GetFileDate()}.json`, '[]', err => {
                    if (err) throw err;
                    console.log('\x1b[32m', `${GetFileDate()}.json File created.` ,'\x1b[0m');
                    SaveAmbarData()
                });
            }else{
                SaveAmbarData()
            }
        });
    }else{
        fs.readFile(`./ambardata/${GetFileDate(true)}/${GetFileDate()}.json`, null, function (error, data) {
            if (error) {  
                fs.appendFile(`./ambardata/${GetFileDate(true)}/${GetFileDate()}.json`, '[]', err => {
                    if (err) throw err;
                    console.log('\x1b[32m', `${GetFileDate()}.json File created.` ,'\x1b[0m');
                    SaveAmbarData()
                });
            }else{
                SaveAmbarData()
            }
        });
    }
} , 60000);

function crusherPLCconnected(err) {
    if (typeof (err) !== "undefined") {
        console.log('\x1b[31m', `Crusher PLC bağlantısı kurulamadı` ,'\x1b[0m');
        plcConnection.crushercpu = false;
    }
    crusherPLC.setTranslationCB(function (tag) {
        return crusherPLCvariables[tag];
    });
    crusherPLC.addItems(['crusherkhw', 'bc1bpdc1', 'bc1bpdc2']);
    crusherPLC.readAllItems(crusherPLCvaluesReady);
}
function crusherPLCvaluesReady(err, values) {
    if (err) { console.log('\x1b[31m', `Kırıcı Plc Bağlantısı Yok yada Okunan Değerlerde Hata Var` ,'\x1b[0m'); plcConnection.crushercpu = false; return crusherPLCvaluesReady }else{plcConnection.crushercpu = true;}
    if(plcConnection.crushercpu == true){
        crusherPLC.readAllItems(crusherPLCvaluesReady);
        plcdata.crusherkwh = parseInt(values.crusherkhw.toFixed());
        plcdata.crusherpdc = {
            bc1b_1: parseInt(values.bc1bpdc1.toFixed()),
            bc1b_2: parseInt(values.bc1bpdc2.toFixed()),
        };
    }
}


function D609_Pressconnected(err) {
    if (typeof (err) !== "undefined") {
        console.log('\x1b[31m', `D609 PLC bağlantısı kurulamadı` ,'\x1b[0m');
        plcConnection.d609cpu = false;
    }
    D609_Press.setTranslationCB(function (tag) {
        return D609_Pressvariables[tag];
    });
    D609_Press.addItems(['status',]);
    D609_Press.readAllItems(D609_PressvaluesReady);
}
function D609_PressvaluesReady(err, values) {
    if (err) { console.log('\x1b[31m', `D609 Plc Bağlantısı Yok yada Okunan Değerlerde Hata Var` ,'\x1b[0m'); plcConnection.d609cpu = false;}else{plcConnection.d609cpu = true;}
    if(plcConnection.d609cpu == true){
        D609_Press.readAllItems(D609_PressvaluesReady);
        plcdata.D609Status = values.status;
    }
}
function Save609PressData() {
    fs.readFile(`./pressdata/${GetFileDate(true)}/${GetFileDate()}.json`, null, function (error, data) {
        if (error) {  console.log(error); }
        var amdata = JSON.parse(data)
        let d609status = 0;
        let d610status = 0;
        switch (plcdata.D609Status) {
            case 1:
                d609status = 10;
                break;
            case 2:
                d609status = 20
                break;
            case 3:
                d609status = 30
                break;
            case 4:
                d609status = 40
                break;
            case 5:
                d609status = 50
                break;
            case 6:
                d609status = 60
                break;
            case 7:
                d609status = 70
                break;
            case 8:
                d609status = 80
                break;
            case 9:
                d609status = 90
                break;
            case 10:
                d609status = 100
                break;
            case 11:
                d609status = 110
                break;
            case 12:
                d609status = 120
                break;
            case 13:
                d609status = 130
                break;
            case 14:
                d609status = 140
                break;
            case 15:
                d609status = 150
                break;
            default:
                break;
        }
        switch (plcdata.D610Status) {
            case 1:
                d610status = 10;
                break;
            case 2:
                d610status = 20
                break;
            case 3:
                d610status = 30
                break;
            case 4:
                d610status = 40
                break;
            case 5:
                d610status = 50
                break;
            case 6:
                d610status = 60
                break;
            case 7:
                d610status = 70
                break;
            case 8:
                d610status = 80
                break;
            case 9:
                d610status = 90
                break;
            case 10:
                d610status = 100
                break;
            case 11:
                d610status = 110
                break;
            case 12:
                d610status = 120
                break;
            case 13:
                d610status = 130
                break;
            case 14:
                d610status = 140
                break;
            case 15:
                d610status = 150
                break;
            default:
                break;
        }
        
        amdata.push({
            time: GetDate(true),
            d609: d609status,
            d610: d610status
        });
        fs.writeFile(`./pressdata/${GetFileDate(true)}/${GetFileDate()}.json`, JSON.stringify(amdata), err => {
            if (err) throw err;
        });
    });
}

setInterval(() => {
    var dir = `./pressdata/${GetFileDate(true)}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
        console.log('\x1b[32m', `${dir} directory created.` ,'\x1b[0m');
        fs.readFile(`./pressdata/${GetFileDate(true)}/${GetFileDate()}.json`, null, function (error, data) {
            if (error) {  
                fs.appendFile(`./pressdata/${GetFileDate(true)}/${GetFileDate()}.json`, '[]', err => {
                    if (err) throw err;
                    console.log('\x1b[32m', `${GetFileDate()}.json File created.` ,'\x1b[0m');
                    Save609PressData()
                });
            }else{
                Save609PressData()
            }
        });
    }else{
        fs.readFile(`./pressdata/${GetFileDate(true)}/${GetFileDate()}.json`, null, function (error, data) {
            if (error) {  
                fs.appendFile(`./pressdata/${GetFileDate(true)}/${GetFileDate()}.json`, '[]', err => {
                    if (err) throw err;
                    console.log('\x1b[32m', `${GetFileDate()}.json File created.` ,'\x1b[0m');
                    Save609PressData()
                });
            }else{
                Save609PressData()
            }
        });
    }
} , 60000);


function D610_Pressconnected(err) {
    if (typeof (err) !== "undefined") {
        console.log('\x1b[31m', `D610 PLC bağlantısı kurulamadı` ,'\x1b[0m');
        plcConnection.d610cpu = false;
    }
    D610_Press.setTranslationCB(function (tag) {
        return D610_Pressvariables[tag];
    });
    D610_Press.addItems(['status',]);
    D610_Press.readAllItems(D610_PressvaluesReady);
}
function D610_PressvaluesReady(err, values) {
    if (err) { console.log('\x1b[31m', `D610 Plc Bağlantısı Yok yada Okunan Değerlerde Hata Var` ,'\x1b[0m'); plcConnection.d610cpu = false;}else{plcConnection.d610cpu = true;}
    if(plcConnection.d610cpu == true){
        D610_Press.readAllItems(D610_PressvaluesReady);
        plcdata.D610Status = values.status;
    }
}



setInterval(() => {
    var dir = `./density/${GetFileDate(true)}`;
    var min = parseInt(moment().format('mm'));
    if (min == 00 || min == 30) {
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
            console.log('\x1b[32m', `${dir} directory created.` ,'\x1b[0m');
            fs.readFile(`./density/${GetFileDate(true)}/${GetFileDate()}.json`, null, function (error, data) {
                if (error) {  
                    fs.appendFile(`./density/${GetFileDate(true)}/${GetFileDate()}.json`, '[]', err => {
                        if (err) throw err;
                        console.log('\x1b[32m', `${GetFileDate()}.json File created.` ,'\x1b[0m');
                        SaveDensityData()
                    });
                }else{
                    SaveDensityData()
                }
            });
        }else{
            fs.readFile(`./density/${GetFileDate(true)}/${GetFileDate()}.json`, null, function (error, data) {
                if (error) {  
                    fs.appendFile(`./density/${GetFileDate(true)}/${GetFileDate()}.json`, '[]', err => {
                        if (err) throw err;
                        console.log('\x1b[32m', `${GetFileDate()}.json File created.` ,'\x1b[0m');
                        SaveDensityData()
                    });
                }else{
                    SaveDensityData()
                }
            });
        }
    }
} , 60000);

function SaveDensityData() {
    fs.readFile(`./density/${GetFileDate(true)}/${GetFileDate()}.json`, null, function (error, data) {
        if (error) {  console.log(error); }
        var densitydata = JSON.parse(data)
        densitydata.push({
            time: GetDate(true),
            density: parseFloat(plcdata.d328_vals.density),
        });
        fs.writeFile(`./density/${GetFileDate(true)}/${GetFileDate()}.json`, JSON.stringify(densitydata), err => {
            if (err) throw err;
        });
    });
}

setInterval(() => {
    var min = parseInt(moment().format('mm'));
    var hour = parseInt(moment().format('HH'));
    var key = moment().format('DD-MM-YYYY')
    if (hour == 00 && min == 00 || hour == 08 && min == 00 || hour == 16 && min == 00) {
        fs.readFile('./works/works.json', null, function (error, data) {
            if (error) { console.log(error); }
            var jdata = JSON.parse(data)
        
            jdata.unshift({
                data: {
                    date: key,
                    vardiya: hour >= 00 && hour <= 7 ? 'V1' : hour >= 8 && hour <= 15 ? 'V2' : hour >= 16 && hour <= 23 ? 'V3': null,
                    names: [],
                    works: [],
                }
            });
            
            fs.writeFile('./works/works.json', JSON.stringify(jdata), err => {
                if (err) throw err;
                console.log(`${key} iş oluşturuldu!`);
            });
        });
    }
} , 60000);

app.post('/api/savework', function (req, res) {
    let adata = req.body
    let date = req.body.date
    let vardiya = req.body.vardiya
    fs.readFile('./works/works.json', null, function (error, data) {
        if (error) {  console.log(error); }
        var jdata = JSON.parse(data)

        for (let j = 0; j < jdata.length; j++) {
            const e = jdata[j];
            if (e.data.date == date) {
                if (e.data.vardiya == vardiya) {
                    e.data.names = adata.data.names

                    e.data.works.unshift({
                        sure: Number(adata.data.sure),
                        tip: adata.data.tip,
                        work: adata.data.work
                    })
                    fs.writeFile('./works/works.json', JSON.stringify(jdata), err => {
                        if (err) throw err;
                        console.log(`${adata.data.work} iş kaydedildi!`);
                    });
                }
            }
        }
    });
    res.send('ok')
});

app.post('/api/deletework', function (req, res) {
    let row = req.body.row
    let work = req.body.work

    fs.readFile('./works/works.json', null, function (error, data) {
        if (error) {  console.log(error); }
        var jdata = JSON.parse(data)

        for (let j = 0; j < jdata.length; j++) {
            const e = jdata[j];
            if (e.data.date == row.data.date) {
                if (e.data.vardiya == row.data.vardiya) {
                    for (let v = 0; v < e.data.works.length; v++) {
                        const element = e.data.works[v];
                        if(element.work == work.work){
                            e.data.works.splice(v, 1)
                        }
                    }
                }
            }
        }
        fs.writeFile('./works/works.json', JSON.stringify(jdata), err => {
            if (err) throw err;
            console.log(`${work.work} iş silindi!`);
        });
    });
    res.send('ok')
});

app.listen(appport, () => {
    console.log(`${appport} api port started`)
})