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
    var newRow   = tableRef.insertRow(tableRef.rows.length);

    // Append a text node to the cell
    var text  = document.createTextNode(dd);

    newRow.appendChild(text);
}

function loadFile()
{
    var file = document.getElementById("uploadInput").files[0];
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
}