var Chartjs = Chart.noConflict();

var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var ctx = document.getElementById("testchart").getContext("2d");

var blacklist = ["google.com", "chrome-extension://"];
var blacklistRegex = new RegExp( '\\b' + blacklist.join('\\b|\\b') + '\\b');

chrome.history.search({ text: "", maxResults: 2147483647 }, function(data) {
    var max = 10;
    if (data.length == 0)
    {
        addTable("No history available.");
        return;
    }
    else if (max >= data.length)
    {
        max = data.length;
    }

    data.sort(function(a, b) { return b.visitCount - a.visitCount });

    for (var i = 0; i < max; i++)
    {
        if(!blacklistRegex.test(data[i].url))
        {
            var hours = new Array();
            chrome.history.getVisits({ url:data[i].url }, function(visits) {
                for(var j =0; j<visits.length; j++)
                {
                    var a = visits[j].visitTime;
                        var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
                        d.setUTCSeconds(a);
                        addTable("Last hour" + data[i].url + " " + d.getHours());
                        hours.push(d.getHours());
                    }
                    var aaa = {
                        labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 
                        "10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
                        "20", "21", "22", "23"],
                        datasets: [
                        {
                            label: "My First dataset",
                            fillColor: "rgba(220,220,220,0.5)",
                            strokeColor: "rgba(220,220,220,0.8)",
                            highlightFill: "rgba(220,220,220,0.75)",
                            highlightStroke: "rgba(220,220,220,1)",
                            data: hours
                        }
                        ]
                    };
                    var chartaa = new Chartjs(ctx).Line(aaa, null);
                });
        break;
    }//end for
}//end search

});

