var fill = d3.scaleOrdinal().range(d3.schemeDark2);

var myWords = [
              {'EventName':'Thanks Giving','Hashtags': 'transgender', 'size': 1},
              {'EventName':'Thanks Giving','Hashtags': 'lgbtrights', 'size': 1},
              {'EventName':'FIFA World Cup','Hashtags': 'parade', 'size': 1},
              {'EventName':'Womens World Cup','Hashtags': 'queerlove', 'size': 1},
              {'EventName':'FIFA World Cup','Hashtags': 'trans', 'size': 1},
              {'EventName':'Womens World Cup','Hashtags': 'happy', 'size': 1},
              {'EventName':'Womens World Cup','Hashtags': 'lgbtyouth', 'size': 1},
              {'EventName':'Womens World Cup','Hashtags': 'lgbt', 'size': 21},
              {'EventName':'FIFA World Cup','Hashtags': 'tbtfollowers', 'size': 1},
              {'EventName':'FIFA World Cup','Hashtags': 'nonbinary', 'size': 1},
              {'EventName':'FIFA World Cup','Hashtags': 'pridemakeup', 'size': 1},
              {'EventName':'FIFA World Cup','Hashtags': 'prideandjoy', 'size': 1},
              {'EventName':'FIFA World Cup','Hashtags': 'prideweek', 'size': 1},
              {'EventName':'FIFA World Cup','Hashtags': 'music', 'size': 1}]


arrayToBeHighlight=["music","parade","tbtfollowers","trans","nonbinary","lgbt","happy","queerlove"];



var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 1200 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;


    var eventName="FIFA World Cup";
var svg = d3.select("#my_dataviz").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");



var eventName="Womens World Cup";
selectedWords=[]
              myWords.map(function(d){
                if(d.EventName==eventName){
                  selectedWords.push(d);
                }
              })

var layout = d3.layout.cloud()
  .size([width, height])
  .words(myWords.map(function(d) { return {text: d.Hashtags, size:d.size+30}; }))
  .padding(5)        //space between words
  .rotate(function() { return ~~(Math.random() * 2) * 90; })
  .fontSize(function(d) { return d.size; })      
  .on("end", draw);
  layout.start();




function draw(words) {
    svg
      .append("g")
      .attr("transform", "translate(" + (width / 2) + "," + (height / 2) +")")
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", function(d) { return d.size+ "px"; })
      .style("fill", function(d, i) { 
        return arrayToBeHighlight.indexOf(d.text) >-1 ? "red" : fill(i); 
        })
      .style("font-family", "Impact")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; })
        }
    

       