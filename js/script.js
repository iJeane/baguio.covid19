var myPRDP, myPUI, myPUM, myPUMOK, myGender;
var positive=[],death=[],recover=[],puiActive=[],puiRecover=[],pumUnder=[],pumOkay=[],puimIso=[],negative=[],probable=[],mlabel=[];
var pPosAge=[],pPosGen=[],pPosDes=[],pRecAge=[],pRecGen=[],pRecDes=[],pDecAge=[],pDecGen=[],pDecDes=[];
var child=0,adole=0,adult=0,elder=0,males=0,females=0;
var months = {1:'Jan',2:'Feb',3:'Mar',4:'Apr',5:'May',6:'Jun',7:'Jul',8:'Aug',9:'Sep',10:'Oct',11:'Nov',12:'Dec'}
var date = new Date();
var month = date.getMonth()+1;
var peeps = $.ajax({
    type: "GET",
    url: "../json/peeps.json",
    dataType: "json",
    async: false,
    done: function(data) {
        return data;
    }
}).responseJSON;
if(peeps.length > 0){
    var pPos = peeps.map(x => x.positive),
        pRec = peeps.map(x => x.recovered),
        pDec = peeps.map(x => x.death);
    if(pPos.length > 0){
        $('ul#posCases').html("");
        var pPos = pPos[0];
        $('.posTotal').html(pPos.length);
        pPosAge = pPos.map(x => x.age);
        pPosGen = pPos.map(x => x.gen);
        pPosDes = pPos.map(x => x.des);
        appendCasesList("#posCases",pPos.length,pPosAge,pPosGen,pPosDes);
    }
    if(pRec.length > 0){
        $('ul#recCases').html("");
        var pRec = pRec[0];
        $('.recTotal').html(pRec.length);
        pRecAge = pRec.map(x => x.age);
        pRecGen = pRec.map(x => x.gen);
        pRecDes = pRec.map(x => x.des);
        appendCasesList("#recCases",pRec.length,pRecAge,pRecGen,pRecDes);
    }
    if(pDec.length > 0){
        $('ul#decCases').html("");
        var pDec = pDec[0];
        $('.decTotal').html(pDec.length);
        pDecAge = pDec.map(x => x.age);
        pDecGen = pDec.map(x => x.gen);
        pDecDes = pDec.map(x => x.des);
        appendCasesList("#decCases",pDec.length,pDecAge,pDecGen,pDecDes);
    }
}

function appendCasesList(id,len,age,gen,des){
    for(var x=0; x < len; x++){
        $(id).append('<li class="list-group-item">'+(x+1)+'.&emsp;'+age[x]+' '+gen[x]+', '+des[x]+'</li>');
        if(gen[x]=='M') males++; else if(gen[x]=='F') females++;
        if(age[x]<11) child++; else if(age[x]>11 && age[x]<18) adole++; else if(age[x]>17 && age[x]<60) adult++; else if(age[x]>59) elder++;
    }
}

var dates = $.ajax({
    type: "GET",
    url: "../json/months.json",
    dataType: "json",
    async: false,
    done: function(data) {
        return data;
    }
}).responseJSON;
appendMoYe(dates);
getStats($('#moyeSelect').val());
updateLatest();

function appendMoYe(dates){
    for(x=0; x<dates.length; x++){
        if(x==0){
            $('select#moyeSelect').append("<option value="+dates[x].month.val+" selected>"+dates[x].month.name+"</option>");
        }else{
            $('select#moyeSelect').append("<option value="+dates[x].month.val+">"+dates[x].month.name+"</option>");
        }
    }
}

function getStats(moye){
    var stats = $.ajax({
        type: "GET",
        url: "../json/"+moye+".json",
        dataType: "json",
        async: false,
        done: function(data) {
            return data;
        }
    }).responseJSON;  
    var latestDate = new Date(stats[stats.length-1].date); 
    $('#current-update').html("UPDATED AS OF <b>"+months[latestDate.getMonth()+1].toUpperCase()+". "+latestDate.getDate()+", "+latestDate.getFullYear()+"</b>");
    mlabel = [];
    for(var x=0; x<stats.length;x++){
        var datel = new Date(stats[x].date);
        mlabel.push(months[datel.getMonth()+1]+" "+datel.getDate());
    }
    positive = stats.map(x => x.posCount);
    death = stats.map(x => x.deathCount);
    recover = stats.map(x => x.recCount);
    puiActive = stats.map(x => x.puiActive);
    puiRecover = stats.map(x => x.puiRecover);
    pumUnder = stats.map(x => x.pumUnder);
    pumOkay = stats.map(x => x.pumOkay);
    puimIso = stats.map(x => x.puimIso);
    negative = stats.map(x => x.negative);
    probable = stats.map(x => x.probable);
}

$('select').on('change', function() {
    getStats(this.value);
    updateLatest();
    resetCharts();
});

function updateLatest(){
    var lPositive = positive.slice(-1)[0],
    lDeath = death.slice(-1)[0],
    lRec = recover.slice(-1)[0],
    lpuiAct = puiActive.slice(-1)[0],
    lpuiRec = puiRecover.slice(-1)[0],
    lpumUnder = pumUnder.slice(-1)[0],
    lpumOkay = pumOkay.slice(-1)[0],
    lpuimIso = puimIso.slice(-1)[0],
    lNeg = negative.slice(-1)[0],
    lProb = probable.slice(-1)[0];
    $('.posCount').html(lPositive);
    $('.decCount').html(lDeath);
    $('.negCount').html(lNeg);
    $('.recCount').html(lRec);
    $('.puiActCount').html(lpuiAct);
    $('.puiRecCount').html(lpuiRec);
    $('.pumUnderCount').html(lpumUnder);
    $('.pumOkayCount').html(lpumOkay);
    $('.puimIsoCount').html(lpuimIso);
    $('.probCount').html(lProb);
    animateNums();
}

function animateNums(){
    $('.count').each(function () {
        $(this).prop('Counter',0).animate({
            Counter: $(this).text()
        }, {
            duration: 1000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
}

function resetCharts(){
    myPRDP.data.labels = mlabel;
    myPUI.data.labels = mlabel;
    myPUM.data.labels = mlabel;
    myPUMOK.data.labels = mlabel;
    myPRDP.data.datasets[0].data = positive;
    myPRDP.data.datasets[1].data = recover;
    myPRDP.data.datasets[2].data = death;
    myPRDP.data.datasets[3].data = probable;
    myPUI.data.datasets[0].data = puiActive;
    myPUI.data.datasets[1].data = puiRecover;
    myPUM.data.datasets[0].data = pumUnder;
    myPUM.data.datasets[1].data = negative;
    myPUMOK.data.datasets[0].data = pumOkay;
    myPRDP.update();
    myPUI.update();
    myPUM.update();
    myPUMOK.update();
}


myPRDP = new Chart(document.getElementById("prdp-chart").getContext('2d'), {
    type: 'line',
    data: {
        labels: mlabel,
        datasets: [
        {   label: "Positive",
            fill: false,
            data: positive,
            borderColor: 'rgba(250, 143, 42,.7)',
            backgroundColor: 'rgba(250, 143, 42,.7)',
            borderWidth: 2 },
        {   label: "Recovered",
            fill: false,
            data: recover,
            borderColor: 'rgba(92, 247, 2, .7)',
            backgroundColor: 'rgba(92, 247, 2, .7)',
            borderWidth: 2
        },
        {   label: "Deceased",
            fill: false,
            data: death,
            borderColor: 'rgba(250, 42, 42, .7)',
            backgroundColor: 'rgba(250, 42, 42, .7)',
            borderWidth: 2
        },
        {   label: "Probable",
            fill: false,
            data: probable,
            borderColor: 'rgba(179, 114, 41, .7)',
            backgroundColor: 'rgba(179, 114, 41, .7)',
            borderWidth: 2
        }
        ]
    },
    options:{responsive: true,scales:{yAxes:[{display: true,ticks:{suggestedMin: 0,suggestedMax: 20,beginAtZero: true}}]},tooltips: {mode: 'index',intersect: false},hover: {intersect: true}}
});

myPUI = new Chart(document.getElementById("pui-chart").getContext('2d'), {
    type: 'line',
    data: {
        labels: mlabel,
        datasets: [
        {   label: "Active",
            fill: false,
            data: puiActive,
            borderColor: 'rgba(161, 34, 224,.7)',
            backgroundColor: 'rgba(161, 34, 224,.7)',
            borderWidth: 2 },
        {   label: "Recovered",
            fill: false,
            data: puiRecover,
            borderColor: 'rgba(92, 247, 2, .7)',
            backgroundColor: 'rgba(92, 247, 2, .7)',
            borderWidth: 2
        }
        ]
    },
    options: {responsive: true,scales: {yAxes: [{display: true,ticks: {suggestedMin: 0,suggestedMax: 500,beginAtZero: true}}]},tooltips: {mode: 'index',intersect: false},hover: {intersect: true}}
});

myPUM = new Chart(document.getElementById("pum-chart").getContext('2d'), {
    type: 'line',
    data: {
        labels: mlabel,
        datasets: [
        {   label: "Possible Cases",
            fill: false,
            data: pumUnder,
            borderColor: 'rgba(179, 114, 41,.7)',
            backgroundColor: 'rgba(179, 114, 41,.7)',
            borderWidth: 2 },
        {   label: "Tested Negative",
            fill: false,
            data: negative,
            borderColor: 'rgba(2, 129, 247, .7)',
            backgroundColor: 'rgba(2, 129, 247, .7)',
            borderWidth: 2
        }
        ]
    },
    options: {responsive: true,scales: {yAxes: [{display: true,ticks: {suggestedMin: 0,suggestedMax: 500,beginAtZero: true}}]},tooltips: {mode: 'index',intersect: false},hover:{intersect: true}}
});

myPUMOK = new Chart(document.getElementById("pumok-chart").getContext('2d'), {
    type: 'line',
    data: {
        labels: mlabel,
        datasets: [
        {   label: "Non-COVID Cases",
            fill: false,
            data: pumOkay,
            borderColor: 'rgba(2, 129, 247,.7)',
            backgroundColor: 'rgba(2, 129, 247,.7)',
            borderWidth: 2 }
        ]
    },
    options: {responsive: true,scales: {yAxes: [{display: true,ticks: {suggestedMin: 0,suggestedMax: 500,beginAtZero: true}}]},tooltips: {mode: 'index',intersect: false},hover:{intersect: true}}
});

$('a#viewMoreBtn').click(function(){
    $('#viewMore').modal();
    animateNums();
});

myGender = new Chart(document.getElementById("gen-chart").getContext('2d'), {
    type: 'pie',
    data: {
        labels: ['Male','Female'],
        datasets: [{
            data: [males,females],
            backgroundColor: ['rgba(54,162,235,0.2)','rgba(255,99,132,0.5)'],
            borderColor: ['rgba(54,162,235,0.7)','rgba(255,99,132,.7)']
        }],
        borderWidth: 1
    },
    options: {responsive: true}
});

myAge = new Chart(document.getElementById("age-chart").getContext('2d'), {
    type: 'pie',
    data: {
        labels: ['0-10 yo','11-17 yo','18-59 yo','60yo and above'],
        datasets: [{
            data: [child,adole,adult,elder],
            backgroundColor: ['rgba(48,157,230,0.2)','rgba(87,230,48,0.2)','rgba(235,91,91,0.2)','rgba(197,67,217,0.2)'],
            borderColor: ['rgba(48,157,230,0.7)','rgba(87,230,48,0.7)','rgba(235,91,91,0.7)','rgba(197,67,217,0.7)']
        }],
        borderWidth: 1
    },
    options: {responsive: true}
});