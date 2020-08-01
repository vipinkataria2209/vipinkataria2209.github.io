function get_scaleTime(current_sequence_id) {

    var parseDate = d3.timeParse("%m/%d/%Y");
    startDate = "3/1/2020"
    endDate = "7/20/2020"

    return d3.scaleTime()
        .range([0, width])
        .domain([parseDate(startDate), parseDate(endDate)]);
}


function loadFixedScene(dataSet) {

    if (currentSceneIndex == 0) {
        hoverText = "NewCases"
        bar_color = 'darkorange'
        chart_title = "NewCases of Covid-19 in USA vs Date"

    } else if (currentSceneIndex == 1) {
        hoverText = "Deaths"
        bar_color = 'red'
        chart_title = "Deaths Covid-19 in USA vs Date"
    } else if (currentSceneIndex == 2) {
        var form = document.getElementById("test");
        if (form.elements["test"].value == 'A') {
            hoverText = "NewCases"
            bar_color = 'darkorange'
            chart_title = "NewCases of  Covid-19 in USA State vs Date"
        } else {
            hoverText = "Deaths"
            bar_color = 'red'
            chart_title = "Deaths Covid-19 in USA State vs Date"

        }
    }

    var svg = d3.select("#my_dataviz")
        .select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    svg.append("text")
        .attr("x", (width / 2) - 250)
        .attr("y", (margin.top / 2) - 25)
        .attr("text-anchor", "middle")
        .style("font-size", "18")
        .style("font-weight", "bold")
        .style("fill", "blue")
        .style("text-decoration", "underline")
        .text(chart_title);

    var xAxis = get_scaleTime();
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xAxis));
    svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")

        .text("Date");

    var yAxis = d3.scaleLinear()
        .domain([0, d3.max(dataSet, function (d) {
            return d.Value;
        })])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(yAxis));
    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(hoverText + " Covid-19");




    svg.selectAll("#mybar")
        .data(dataSet)
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return xAxis(d.Date);
        })
        .attr("y", function (d) {
            return yAxis(d.Value);
        })
        .attr("width", 3)
        .attr("height", function (d) {
            return height - yAxis(d.Value);
        })
        .attr("fill", bar_color)
        .on("mouseover", function () {
            return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function (d) {
            month = Number(1) + Number(d.Date.getMonth())
            date1 = d.Date.getDate() + "/" + month + "/" + d.Date.getFullYear()
            return tooltip.style("top", (height-195) + "px").style("left", (event.pageX) + "px").html("<div class='hoverText'>" + d.Value + " :" + hoverText + "</div>" + "<div class='hoverText'>" + date1 + " :Date</div>");
        })
        .on("mouseout", function () {
            return tooltip.style("visibility", "hidden");
        });


    var tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("position", "absolute")
        .attr("class", "demo")
        .style("visibility", "hidden");


    parent = d3.select("#my_dataviz")
        .select("svg")
        .append("g")

    if (currentSceneIndex != 2) {
        xoffset = annotations[currentSceneIndex].xoffset
        linex1 = annotations[currentSceneIndex].linex1
        linex2 = annotations[currentSceneIndex].linex2

        maxIndex = getMaxIndex(dataSet)
        parent.append("rect")
            .attr("opacity", 1)
            .attr("x", xAxis(dataSet[maxIndex].Date) - xoffset - 20)
            .attr("y", yAxis(dataSet[maxIndex].Value))
            .attr("height", 50)
            .attr("width", 330)
            .attr("fill", '#e6e6e6')

        parent.append("text")
            .attr("class", "annotation_text")
            .attr("x", xAxis(dataSet[maxIndex].Date) - xoffset)
            .attr("y", 25 + yAxis(dataSet[maxIndex].Value))
            .text(annotations[currentSceneIndex].text);

        d3.select("#my_dataviz")
            .select("svg")
            .append("g")
            .attr("class", "vipin")
            .attr("id", 'adad')
            .selectAll("line")
            .data(dataSet)
            .enter()
            .append("line")
            .attr("opacity", 1)
            .attr("style", "stroke:rgb(0,0,0);stroke-width:0.5px")
            .attr("x1", linex1 + margin.left + xAxis(dataSet[maxIndex].Date) - 160)
            .attr("y1", 25 + yAxis(dataSet[maxIndex].Value))
            .attr("x2", linex2 + margin.left + xAxis(dataSet[maxIndex].Date))
            .attr("y2", 25 + yAxis(dataSet[maxIndex].Value))
    }

}


function handleNextScene() {
    if (currentSceneIndex == 2) {
        return
    }
    currentSceneIndex++;

    if (currentSceneIndex == 1) {
        d3.select("#scene2_id")
            .style("visibility", "hidden")
        d3.select("#my_dataviz")
            .select("svg").selectAll("g").remove();
        loadFixedScene(deathCasesDataSet)
        d3.select("#scene_1").style("display", "none")
        d3.select("#scene_2").style("display", "block")
        d3.select("#scene_3").style("display", "none")


        k = d3.select(".pagination").selectAll("a").nodes()
        d3.selectAll("a").style("background-color", "white")
        d3.selectAll("a").style("color", "black")
        d3.select(k[currentSceneIndex + 1]).style("background-color", "red")
        d3.select(k[currentSceneIndex + 1]).style("color", "white")
        //bg_color = d3.select(k[currentSceneIndex+1]).style("background-color")
        //font_color = d3.select(k[currentSceneIndex+1]).style("color")


    }
    if (currentSceneIndex == 2) {
        d3.select("#my_dataviz")
            .select("svg").selectAll("g").remove();
        load_3rd_scene()
        d3.select("#scene_1").style("display", "none")
        d3.select("#scene_2").style("display", "none")
        d3.select("#scene_3").style("display", "block")
        k = d3.select(".pagination").selectAll("a").nodes()
        d3.selectAll("a").style("background-color", "white")
        d3.selectAll("a").style("color", "black")
        d3.select(k[currentSceneIndex + 1]).style("background-color", "red")
        d3.select(k[currentSceneIndex + 1]).style("color", "white")
        //bg_color = d3.select(k[currentSceneIndex+1]).style("background-color")
        // font_color = d3.select(k[currentSceneIndex+1]).style("color")


    }
}

function handleUserDrivenScene(sceneIndex) {
    if (sceneIndex == 0) {
        d3.select("#scene2_id")
            .style("visibility", "hidden")
        currentSceneIndex = 0
        d3.select("#my_dataviz")
            .select("svg").selectAll("g").remove();
        loadFixedScene(newCasesDataSet)
        d3.select("#scene_1").style("display", "block")
        d3.select("#scene_2").style("display", "none")
        d3.select("#scene_3").style("display", "none")

    }
    if (sceneIndex == 1) {
        d3.select("#scene2_id")
            .style("visibility", "hidden")
        currentSceneIndex = 1
        d3.select("#my_dataviz")
            .select("svg").selectAll("g").remove();
        loadFixedScene(deathCasesDataSet)
        //d3.select("#scene_2").innerHTML("adadadadad")
        d3.select("#scene_1").style("display", "none")
        d3.select("#scene_2").style("display", "block")
        d3.select("#scene_3").style("display", "none")

    }
    if (sceneIndex == 2) {
        currentSceneIndex = 2
        d3.select("#my_dataviz")
            .select("svg").selectAll("g").remove();
        load_3rd_scene()
        d3.select("#scene_1").style("display", "none")
        d3.select("#scene_2").style("display", "none")
        d3.select("#scene_3").style("display", "block")
    }
}


function handlePreviousScene() {
    if (currentSceneIndex == 0) {
        return
    }
    currentSceneIndex--;
    if (currentSceneIndex == 0) {
        d3.select("#scene2_id")
            .style("visibility", "hidden")
        d3.select("#my_dataviz")
            .select("svg").selectAll("g").remove();
        loadFixedScene(newCasesDataSet)
        k = d3.select(".pagination").selectAll("a").nodes()
        d3.selectAll("a").style("background-color", "white")
        d3.selectAll("a").style("color", "black")
        d3.select(k[currentSceneIndex + 1]).style("background-color", "red")
        d3.select(k[currentSceneIndex + 1]).style("color", "white")

    }
    if (currentSceneIndex == 1) {
        d3.select("#scene2_id")
            .style("visibility", "hidden")
        d3.select("#my_dataviz")
            .select("svg").selectAll("g").remove();
        loadFixedScene(deathCasesDataSet)
        k = d3.select(".pagination").selectAll("a").nodes()
        d3.selectAll("a").style("background-color", "white")
        d3.selectAll("a").style("color", "black")
        d3.select(k[currentSceneIndex + 1]).style("background-color", "red")
        d3.select(k[currentSceneIndex + 1]).style("color", "white")


    }


}

function load_3rd_scene() {
    d3.select("#scene2_id")
        .style("visibility", "visible")
    var selected = d3.select("#d3-dropdown").node().value;
    console.log(selected);
    var form = document.getElementById("test");
    if (form.elements["test"].value == 'A') {
        d3.select("#selected-dropdown").text(selected);
        data1 = countryNewCasesDataSet[selected]
        d3.select("#my_dataviz")
            .select("svg").selectAll("g").remove();
        loadFixedScene(data1)

    } else {
        d3.select("#selected-dropdown").text(selected);
        data1 = countryDeathCasesDataSet[selected]
        d3.select("#my_dataviz")
            .select("svg").selectAll("g").remove();
        loadFixedScene(data1)
    }
}

function handle_radio_button_change_event() {
    var selected = d3.select("#d3-dropdown").node().value;
    console.log(selected);
    var form = document.getElementById("test");
    if (form.elements["test"].value == 'A') {
        d3.select("#selected-dropdown").text(selected);
        data1 = countryNewCasesDataSet[selected]
        d3.select("#my_dataviz")
            .select("svg").selectAll("g").remove();
        loadFixedScene(data1)

    } else {
        d3.select("#selected-dropdown").text(selected);
        data1 = countryDeathCasesDataSet[selected];
        d3.select("#my_dataviz")
            .select("svg").selectAll("g").remove();
        loadFixedScene(data1);
    }
}


function getMaxIndex(dataset) {
    var counter = 1;
    var max = 0;
    for (counter; counter < dataset.length; counter++) {
        if (dataset[max].Value < dataset[counter].Value) {
            max = counter;
        }
    }
    return max;
}


