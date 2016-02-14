var blacklist = ["google.com", "chrome-extension://"];
var blacklistRegex = new RegExp( '\\b' + blacklist.join('\\b|\\b') + '\\b');
var musicSites = ["soundcloud.com", "youtube.com", "spotify.com"];
var musicRegex = new RegExp('\\w' + musicSites.join('|') + "[/]" + "\\w");
var socialSites = ["facebook.com", "twitter.com", "plus.google.com", "instagram.com"];
var socialRegex = new RegExp('\\w' + socialSites.join('|') + "[/]" + "\\w");

function addToList(div, str)
{
    $(div + " ol").append("<li class='ellipsis'>" + str + "</li>");
}

function clearList(div)
{
    $(div + " ol").empty();
}

function processData(data, max, showChart)
{
    // Check if history data is available for analysis
    if (data.length == 0)
    {
        addToList("#topSites", "No history available.");
        addToList("#topVideos", "No history available.");
        addToList("#topMedia", "No history available.");
        return;
    }
    else if (max >= data.length)
    {
        max = data.length;
    }

    var end = max;

    // Sort site history by visit count
    data.sort(function(a, b) { return b.visitCount - a.visitCount });

    // Show top ten visited sites
    for (var i = 0; i < end && i < data.length; i++)
    {
        if (blacklistRegex.test(data[i].url))
        {
            end++;
        }
        else
        {
            if (showChart)
            {
                addToList("#topSites", "<a class='graphVisits' data-url='" + data[i].url + "'><i class='material-icons'>insert_chart</i></a> [" + data[i].visitCount + "] <a href='" + data[i].url + "'>" + data[i].title + "</a>");
            }
            else
            {
                addToList("#topSites", "[" + data[i].visitCount + "] <a href='" + data[i].url + "'>" + data[i].title + "</a>");
            }
        }
    }

    var end = max;

    // Show top ten visited videos
    for (var i = 0; i < end && i < data.length; i++)
    {
        if (!musicRegex.test(data[i].url))
        {
            end++;
        }
        else
        {
            if (showChart)
            {
                addToList("#topVideos", "<a class='graphVisits' data-url='" + data[i].url + "'><i class='material-icons'>insert_chart</i></a> [" + data[i].visitCount + "] <a href='" + data[i].url + "'>" + data[i].title + "</a>");
            }
            else
            {
                addToList("#topVideos", "[" + data[i].visitCount + "] <a href='" + data[i].url + "'>" + data[i].title + "</a>");
            }
        }
    }

    var end = max;

    // Show top ten visited media sites
    for (var i = 0; i < end && i < data.length; i++)
    {
        if (!socialRegex.test(data[i].url))
        {
            end++;
        }
        else
        {
            if (data[i].title == "") data[i].title = data[i].url;
            if (showChart)
            {
                addToList("#topMedia", "<a class='graphVisits' data-url='" + data[i].url + "'><i class='material-icons'>insert_chart</i></a> [" + data[i].visitCount + "] <a href='" + data[i].url + "'>" + data[i].title + "</a>");
            }
            else
            {
                addToList("#topMedia", "[" + data[i].visitCount + "] <a href='" + data[i].url + "'>" + data[i].title + "</a>");
            }
        }
    }
}

function searchTopSites(callback)
{
    chrome.history.search({ text: "", maxResults: 2147483647 }, function(data) {
        processData(data, 10, true);
        callback();
    });
}

$(document).ready(function() {
    searchTopSites(setUpGraphVisits);
});

function parseData(predata)
{
    var data = JSON.parse(predata);
    clearList("#topSites");
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