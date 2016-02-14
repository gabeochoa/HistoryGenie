var blacklist = ["google.com", "chrome-extension://"];
var blacklistRegex = new RegExp( '\\b' + blacklist.join('\\b|\\b') + '\\b');

function addToList(str)
{
    $("#topSites ol").append("<li class='ellipsis'>" + str + "</li>");
}

function clearList()
{
    $("#topSites ol").empty();
}

function processData(data, max, showChart)
{
    // Check if history data is available for analysis
    if (data.length == 0)
    {
        addToList("No history available.");
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
            if (showChart)
            {
                addToList("<a class='graphVisits' data-url='" + data[i].url + "'><i class='material-icons'>insert_chart</i></a> [" + data[i].visitCount + "] <a href='" + data[i].url + "'>" + data[i].title + "</a>");
            }
            else
            {
                addToList("[" + data[i].visitCount + "] <a href='" + data[i].url + "'>" + data[i].title + "</a>");
            }
        }
    }
}

function searchTopSites(callback)
{
    chrome.history.search({ text: "", maxResults: 2147483647 }, function(data) {
        processData(data, 10, true);
        callback();
        music(data)
    });
}

$(document).ready(function() {
    searchTopSites(setUpGraphVisits);
});

function parseData(predata)
{
    var data = JSON.parse(predata);
    clearList();
    processData(data, 10, false);
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