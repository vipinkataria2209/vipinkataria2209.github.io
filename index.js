var margin = {top: 25, right: 30, bottom: 120, left: 60},
    width = 950 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;
const annotations = [
    {
        text: "Largest Count of New Cases Reported on 16/July/20",
        xoffset: 400,
        linex1: 10,
        linex2: 0
    },

    {
        text: "Largest Count of Deaths Reported on 14/April/20",
        xoffset: -400,
        linex1: 160,
        linex2: 320
    }
];


var newCasesDataSet = []
var deathCasesDataSet = []
var currentSceneIndex = 0;
var countryNewCasesDataSet = []
var countryDeathCasesDataSet = []
var countyList = []


async function init() {
    /* Reading New Cases CSV File */
    var data = await d3.csv("https://vipinkataria2209.github.io/vipin_covid_confirmed_usafacts.csv")
    processNewCasesDataSet(data)
    /* Reading Deaths Cases CSV File */
    data = await d3.csv("https://vipinkataria2209.github.io/vipin_covid_deaths_usafacts.csv")
    processDeathCasesDataSet(data)
    loadFixedScene(newCasesDataSet)

    var selectTag = d3.select("select");
    var options = selectTag.selectAll('option')
        .data(countyList);
    options.enter()
        .append('option')
        .attr('value', function (d, i) {
            return i + 2
        })
        .text(function (d) {
            return d

        });
    d3.select(".tool_box").selectAll("a").on("mouseover", function () {
        bg_color = d3.select(this).style("background-color")
        font_color = d3.select(this).style("color")
        d3.select(this).style("color", "black")
        d3.select(this).style("background-color", "gray")
    }).on("mouseout", function (d) {
        d3.select(this).style("background-color",bg_color)
        d3.select(this).style("color",font_color)

    }).on("click", function (d) {
        if (d3.select(this).nodes()[0].innerHTML == '1' ||
            d3.select(this).nodes()[0].innerHTML == '2' ||
            d3.select(this).nodes()[0].innerHTML == '3') {
            d3.selectAll("a").style("background-color", "white")
            d3.selectAll("a").style("color", "black")
            d3.select(this).style("background-color", "red")
            d3.select(this).style("color", "white")
            bg_color = d3.select(this).style("background-color")
            font_color = d3.select(this).style("color")
        }
    })
}


function processNewCasesDataSet(dataSet) {
    var parseDate = d3.timeParse("%m/%d/%Y");
    var keys = Object.keys(dataSet[0])
    for (count = 0; count < dataSet.length; count++) {
        var date = parseDate(dataSet[count].Date)
        newCasesDataSet.push({
            "Date": date, "Value": Number(dataSet[count].Count)
        })
    }

    for (keyCount = 2; keyCount < keys.length; keyCount++) {
        keyDb = []
        for (count = 0; count < dataSet.length; count++) {
            var date = parseDate(dataSet[count].Date)
            keyDb.push({
                "Date": date, "Value": Number(dataSet[count][keys[keyCount]])
            })
        }
        countryNewCasesDataSet.push(keyDb)

    }
    for (c1 = 2; c1 < keys.length; c1++) {
        countyList.push(keys[c1])
    }

    d3.select("select")
        .on("change", load_3rd_scene);

    d3.select("#test")
        .on("change", handle_radio_button_change_event);

}

function processDeathCasesDataSet(dataSet) {
    var parseDate = d3.timeParse("%m/%d/%Y");
    var keys = Object.keys(dataSet[0])

    for (count = 0; count < dataSet.length; count++) {
        date = parseDate(dataSet[count].Date)
        deathCasesDataSet.push({
            "Date": date, "Value": Number(dataSet[count].Count)
        })
    }

    for (keyCount = 2; keyCount < keys.length; keyCount++) {
        keyDb = []
        for (count = 0; count < dataSet.length; count++) {
            var date = parseDate(dataSet[count].Date)
            keyDb.push({
                "Date": date, "Value": Number(dataSet[count][keys[keyCount]])
            })
        }
        countryDeathCasesDataSet.push(keyDb);
    }

}