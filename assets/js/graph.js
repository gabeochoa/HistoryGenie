var Chartjs = Chart.noConflict();
var ctx = document.getElementById("timeofdaychart").getContext("2d");
var lineChartSites;

function histogram(arr)
{
    var a = [], b = [], prev;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== prev)
        {
            a.push(arr[i]);
            b.push(1);
        }
        else
        {
            b[b.length-1]++;
        }
        prev = arr[i];
    }

    return [a, b];
}


function setUpGraphVisits()
{
    $('a.graphVisits').click(function(e) {
        if (lineChartSites !== undefined) lineChartSites.destroy();
        var hours = new Array();
        chrome.history.getVisits({ url: e.target.parentElement.attributes[1].nodeValue }, function(visits) {
            for (var j = 0; j < visits.length; j++)
            {
                var a = visits[j].visitTime;
                var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                d.setUTCSeconds(a);
                hours.push(d.getHours());
            }
            hours.sort( function(a,b) { return a - b; } );
            histo = histogram(hours);
            var chartData = {
                labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                "10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
                "20", "21", "22", "23"],
                datasets: [{
                    label: "Time of Day",
                    fillColor: "rgba(220, 220, 220, 0.5)",
                    strokeColor: "rgba(220, 220, 220, 0.8)",
                    highlightFill: "rgba(220, 220, 220, 0.75)",
                    highlightStroke: "rgba(220, 220, 220, 1)",
                    data: histo[1]
                }]
            };

            lineChartSites = new Chartjs(ctx).Bar(chartData, {
                tooltipTemplate: "<%if (label){%><%=label + ':00' %>: <%}%><%= value + ' times visited' %>",
            });
        });
    });
}