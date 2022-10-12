var http = require('http');
var static = require('node-static');
var fileServer = new static.Server('./client');
var port = process.env.PORT || 8000;
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
    }
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
        roles:['pdc', 'yks', 'slurry', 'ambar']
    },
    {
        id: 2,
        username: "tunahansimsek",
        password: "Ts159753",
        roles:['pdc', 'yks', 'slurry', 'ambar']
    },
    {
        id: 3,
        username: "irfansariyar",
        password: "is1425",
        roles:['pdc', 'slurry', 'ambar']
    },
    {
        id: 4,
        username: "tansukoralay",
        password: "ts1q2w",
        roles:['pdc', 'slurry', 'ambar']
    },
    {
        id: 5,
        username: "kontrolmerkezi",
        password: "Pe123456@",
        roles:['pdc', 'slurry', 'ambar']
    },
    {
        id: 6,
        username: "lavvarkantar",
        password: "1925",
        roles:['pdc', 'slurry', 'ambar']
    },
]

app.listen(appport, () => {
    console.log(`${appport} api port started`)
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));
app.set("view engine", "pug");

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
        var labdata = fs.readFileSync('./laboratuvar/data.json');
        var Obj = JSON.parse(json);
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
            slurry: parseInt(jsondata["Slurry"]).toFixed(),
            time: GetDate(),
            vardiya: vard,
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





var nodes7 = require('nodes7');
const { Console } = require('console');
var mainPLC = new nodes7;
var doneReading = false;
var doneWriting = false;

var variables = {
    m3Slurry: 'DB80,REAL0',
    SlurryTotal: 'DB80,REAL16',
    HourlySlurry: 'DB80,REAL24',
    Pac3200: 'DB79,LREAL144',
    MainPLCMBPdc: 'DB69,REAL48.6',
    MainPLCPdc710: 'DB13,REAL20',
    D328Values: 'DB85,REAL0.6',
};

mainPLC.initiateConnection({
    port: 102,
    host: '10.35.17.10',
    rack: 0,
    slot: 1,
    timeout: 30000,
    debug: true
}, connected);


function connected(err) {
    if (typeof (err) !== "undefined") {
        console.log(err);
    }
    mainPLC.setTranslationCB(function (tag) {
        return variables[tag];
    });
    mainPLC.addItems(['m3Slurry', 'HourlySlurry', 'SlurryTotal', 'Pac3200', 'MainPLCMBPdc', 'MainPLCPdc710', 'D328Values']);
    mainPLC.readAllItems(valuesReady);
}

function valuesReady(err, values) {
    if (err) { console.log('\x1b[31m', `Plc Bağlantısı Yok yada Okunan Değerlerde Hata Var` ,'\x1b[0m'); return }
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
        voltage: values.D328Values[0].toFixed(2),
        current: values.D328Values[1].toFixed(2),
        density: values.D328Values[2].toFixed(2),
        level: values.D328Values[3].toFixed(),
        kw: values.D328Values[4].toFixed(),
        kwh: values.D328Values[5].toFixed(),
    }
}

function valuesWritten(err) {
    if (err) { console.log("YAZILAN DEĞERLERDE HATA VAR"); }
    console.log("Yazıldı.");
    doneWriting = true;
    if (doneReading) {  }
}
app.get('/api/getPLCData', function (req, res) {
    res.send(plcdata);
});


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
    timeout: 30000,
    debug: true
}, ambarPLCconnected);


function ambarPLCconnected(err) {
    if (typeof (err) !== "undefined") {
        console.log(err);
    
    }
    ambarPLC.setTranslationCB(function (tag) {
        return ambarPLCvariables[tag];
    });
    ambarPLC.addItems(['status', 'seviye']);
    ambarPLC.readAllItems(ambarPLCvaluesReady);
}

function ambarPLCvaluesReady(err, values) {
    if (err) { console.log('\x1b[31m', `Plc Bağlantısı Yok yada Okunan Değerlerde Hata Var` ,'\x1b[0m'); return }
    ambarPLC.readAllItems(ambarPLCvaluesReady);
    plcdata.ambarstatus = values.status;
    plcdata.ambarseviye = values.seviye;

}

// setInterval(() => {
//     fs.readFile('./ambardata.json', null, function (error, data) {
//         if (error) {  console.log(error); }
//         var amdata = JSON.parse(data)
//         let status = 0;
//         if (plcdata.ambarstatus === 1) {
//             status = 10;
//         } else if (plcdata.ambarstatus === 2){
//             status = 20;
//         } else if (plcdata.ambarstatus === 3){
//             status = 30;
//         } else if (plcdata.ambarstatus === 4){
//             status = 40;
//         } else {
//             status = 0;
//         }
//         amdata.push({
//             time: GetDate(true),
//             status: status,
//             seviye: plcdata.ambarseviye,
//         });
//         fs.writeFile('./ambardata.json', JSON.stringify(amdata), err => {
//             if (err) throw err;
//         });
//     });
// }, 60000);

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
    timeout: 30000,
    debug: true
}, crusherPLCconnected);


function crusherPLCconnected(err) {
    if (typeof (err) !== "undefined") {
        console.log(err);
    }
    crusherPLC.setTranslationCB(function (tag) {
        return crusherPLCvariables[tag];
    });
    crusherPLC.addItems(['crusherkhw', 'bc1bpdc1', 'bc1bpdc2']);
    crusherPLC.readAllItems(crusherPLCvaluesReady);
}

function crusherPLCvaluesReady(err, values) {
    if (err) { console.log('\x1b[31m', `Plc Bağlantısı Yok yada Okunan Değerlerde Hata Var` ,'\x1b[0m'); return }
    crusherPLC.readAllItems(crusherPLCvaluesReady);
    plcdata.crusherkwh = parseInt(values.crusherkhw.toFixed());
    plcdata.crusherpdc = {
        bc1b_1: parseInt(values.bc1bpdc1.toFixed()),
        bc1b_2: parseInt(values.bc1bpdc2.toFixed()),
    }
    
}