var blacklist = ["google.com", "chrome-extension://"];
var blacklistRegex = new RegExp( '\\b' + blacklist.join('\\b|\\b') + '\\b');
var topSites = "";

$(document).ready(function() {
    chrome.history.search({ text: "", maxResults: 2147483647 }, function(data) {
        var max = 10;

        // Check if history data is available for analysis
        if (data.length == 0)
        {
            $("#topSites ul").append("<li class='truncate'>No history available.</li>");
            return;
        }
        else if (max >= data.length)
        {
            max = data.length;
        }

        // Sort site history by visit count
        data.sort(function(a, b) { return b.visitCount - a.visitCount });

        // Show top ten visited sites
        for (var i = 0; i < max; i++)
        {
            if (blacklistRegex.test(data[i].url))
            {
                max++;
            }
            else
            {
                $("#topSites ul").append("<li class='truncate'>Most visited url " + data[i].visitCount + " times: <a href='" + data[i].url + "'>" + data[i].title + "</a></li>");
            }
        }
        return;
    });
});

function parseData(predata)
{
    data = JSON.parse(predata);
    output = "";
    maxvisited = 0;
    visited = "";
    sites = [];
    for (var i = 0; i < data.length; i++)
    {
        point = data[i];
        output += JSON.stringify(data[i]);
        document.getElementById("byte_content").textContent = output;
        output = "";

        if(maxvisited < point["visitCount"])
        {
            maxvisited = point["visitCount"]
            visited = point["url"]
        }
    }
    str = "Most visited url " + maxvisited + " times:" + visited;
    addTable(str);
}

function addTable(dd)
{
    var tableRef = document.getElementById("myTable").getElementsByTagName("tbody")[0];

    // Insert a row in the table at the last row
    var newRow = tableRef.insertRow(tableRef.rows.length);

    // Append a text node to the cell
    var text = document.createTextNode(dd);

    newRow.appendChild(text);
}

$('#upload').change(function() {
    var file = $("#upload")[0].files[0];
    var reader = new FileReader();

    reader.onloadend = function(evt)
    {
        if (evt.target.readyState == FileReader.DONE)
        {
            parseData(evt.target.result);
        }
    }

    var blob = file.slice(0, file.size);
    reader.readAsBinaryString(blob);
});