var Chartjs = Chart.noConflict();
var ctx = document.getElementById("testchart").getContext("2d");

document.addEventListener('DOMContentLoaded', function() {

    var classes = document.getElementsByClassName("graphVisits");

    var createGraph = function() {
        var hours = new Array();
        chrome.history.getVisits({ url: data }, function(visits) {
            for (var j = 0; j < visits.length; j++)
            {
                var a = visits[j].visitTime;
                var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                d.setUTCSeconds(a);
                hours.push(d.getHours());
            }

            var chartData = {
                labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                "10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
                "20", "21", "22", "23"],
                datasets: [{
                    label: "My First dataset",
                    fillColor: "rgba(220, 220, 220, 0.5)",
                    strokeColor: "rgba(220, 220, 220, 0.8)",
                    highlightFill: "rgba(220, 220, 220, 0.75)",
                    highlightStroke: "rgba(220, 220, 220, 1)",
                    data: hours
                }]
            };

            var lineChart = new Chartjs(ctx).Line(chartData, null);
        });
    }

    for (var i = 0; i < classes.length; i++)
    {
        classes[i].addEventListener('click', createGraph, false);
    }

});