//read element in the HTML
var jsonFile = ("samples.json");


function init(){
    var sampleid = d3.select("#selDataset");
    //console.log(sampleid);
    //pull the first key 
    d3.json(jsonFile).then((x) => {
        var samplenames = x.names;
        samplenames.forEach((sample_name) => {
            sampleid
                .append("option")
                .text(sample_name)
                .property("value", sample_name);
        });
        var firstid = samplenames[0];
     builddemographic(firstid);
     buildcharts(firstid);
    });
}

function builddemographic(sample){
    d3.json(jsonFile).then((d) => {
        var metadata = d.metadata;
        var filterData = metadata.filter(x => x.id == sample);
        console.log(filterData);
        var filterresult = filterData[0];
        var sample_metadata = d3.select("#sample-metadata");
        sample_metadata.html("");
        Object.entries(filterresult).forEach(function([key, value]){
            console.log(key,value);
            var row = sample_metadata.append("tr");
            row.append("td").html(`<strong><font size = '1'>${key}</font></strong>:`);
            row.append('td').html(`<font size ='1'>${value}</font>`);
        });
    });
}

function buildcharts(sample) {
    d3.json(jsonFile).then((d) => {
        var samples = d.samples;
        var filterData = samples.filter(x => x.id == sample);
        console.log(filterData);
        var filterresult = filterData[0];
        var otu_ids = filterresult.otu_ids;
        var otu_labels = filterresult.otu_labels;
        var sample_values = filterresult.sample_values;
        
        //bar chart
        var trace1 = [{
            x: sample_values.slice(0,10),
            y: otu_ids.slice(0,10),
            text: otu_labels,
            type: "bar",
            orientation: "h"
        }]

        var layout1 = {
            title: "Otu's"

            
        }
        Plotly.newPlot("bar", trace1, layout1);

        //scatter plot
        var trace2 = [{
            x: otu_ids, 
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids
            }
        }]
        var layout2 = {
            title: "Bubble Chart"
        }
        Plotly.newPlot("bubble", trace2, layout2);

    });

}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildcharts(newSample);
    builddemographic(newSample);
}
init();

