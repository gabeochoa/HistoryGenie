var Chartjs = Chart.noConflict();
var ctx = document.getElementById("testchart").getContext("2d");

function setUpGraphVisits()
{
    $('a.graphVisits').click(function(e) {
        var hours = new Array();
        chrome.history.getVisits({ url: e.target.parentElement.attributes[1].nodeValue }, function(visits) {
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
    });
}