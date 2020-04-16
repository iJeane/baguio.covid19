
$(document).ready(function(){
    var positive=[],death=[],recover=[],puiActive=[],puiRecover=[],pumUnder=[],pumOkay=[],puimIso=[],negative=[],probable=[],mlabel=[];
    const remarks = ["","New","New from Presumptive","Stable","New, Stable","New from Presumptive, Stable","From Presumptive","New, Presumptive","Presumptive","Confirmed"];
    const months = {1:'Jan',2:'Feb',3:'Mar',4:'Apr',5:'May',6:'Jun',7:'Jul',8:'Aug',9:'Sep',10:'Oct',11:'Nov',12:'Dec'}
    var date = new Date(); 
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var people = $.ajax({
        type: "GET",
        url: "../json/people.json",
        dataType: "json",
        async: false,
        done: function(data) {
            return data;
        }
    }).responseJSON;
    var stats = $.ajax({
        type: "GET",
        url: "../json/"+year+"-"+month+".json",
        dataType: "json",
        async: false,
        done: function(data) {
            return data;
        }
    }).responseJSON;
    
    var latestDate = new Date(stats[stats.length-1].date);

    $('#current-update').html("UPDATED AS OF <b>"+months[latestDate.getMonth()+1].toUpperCase()+". "+latestDate.getDate()+", "+latestDate.getFullYear()+"</b>");

    for(var x=0; x<stats.length;x++){
        var datel = new Date(stats[x].date);
        mlabel.push(months[month]+" "+datel.getDate());
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

    $('#posCount').html(lPositive);
    $('#decCount').html(lDeath);
    $('#negCount').html(lNeg);
    $('#recCount').html(lRec);
    $('a#viewMoreBtn').click(function(){

    });

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

var myPRDP = new Chart(document.getElementById("prdp-chart").getContext('2d'), {
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
    options: {
        responsive: true,
        scales: {
            yAxes: [{
                display: true,
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 20,
                    beginAtZero: true
                }
            }]
        },
        tooltips: {
            mode: 'index',
            intersect: false
        },
        hover: {
            intersect: true
        }
    }
});

var myPUI = new Chart(document.getElementById("pui-chart").getContext('2d'), {
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
    options: {
        responsive: true,
        scales: {
            yAxes: [{
                display: true,
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 500,
                    beginAtZero: true
                }
            }]
        },
        tooltips: {
            mode: 'index',
            intersect: false
        },
        hover: {
            intersect: true
        }
    }
});

var myPUM = new Chart(document.getElementById("pum-chart").getContext('2d'), {
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
    options: {
        responsive: true,
        scales: {
            yAxes: [{
                display: true,
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 500,
                    beginAtZero: true
                }
            }]
        },
        tooltips: {
            mode: 'index',
            intersect: false
        },
        hover: {
            intersect: true
        }
    }
});

var myPUMOK = new Chart(document.getElementById("pumok-chart").getContext('2d'), {
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
    options: {
        responsive: true,
        scales: {
            yAxes: [{
                display: true,
                ticks: {
                    suggestedMax: 500,
                    beginAtZero: true
                }
            }]
        },
        tooltips: {
            mode: 'index',
            intersect: false
        },
        hover: {
            intersect: true
        }
    }
});




});


