var markers=[];
var data1;
var path;
var data2;
var svg;
let twitter_csv,EventDate_count,EventDate_emotions,EventDate_Hourly;
let formatDate = d3.timeFormat("%Y-%m-%d");
let formatTime = d3.timeFormat("%H:%M");
var eventSvg;
var fill = d3.scaleOrdinal().range(d3.schemeDark2);
var data5;
var eventsdata=[];
var parseDate = d3.timeParse("%Y");

// Create data: coordinates of start and end
// var link = {type: "LineString", coordinates: [[21, 41], [11, 45]]} // Change these data to see ho the great circle reacts
let onLoad = () => {
  const margin = { top: 0, right: 40, bottom: 10, left: 40 };
	eventSvg = d3.select('#eventSvg').append('g')
		.attr("id","chart_g")
		.attr('transform', `translate(${margin.left}, ${margin.top})`);	
}

let totalTime = temp => {
	let [hours, minutes] = temp.split(':');
	let tot=Number(hours)*60+Number(minutes);
	return tot;
}

let convertTime = temp => {
	let [hours, minutes] = temp.split(':');
	if (hours === '0') {
	   hours = '00';
	}
	if (hours === '1') {
		hours = '01';
	}
	if (hours === '2') {
		hours = '02';
	 } 
	 if (hours === '3') {
		hours = '03';
	 }
	 if (hours === '4') {
		hours = '04';
	 }
	 if (hours === '5') {
		hours = '05';
	 }
	 if (hours === '6') {
		hours = '06';
	 }
	 if (hours === '7') {
		hours = '07';
	 }
	 if (hours === '8') {
		hours = '08';
	 }
	 if (hours === '9') {
		hours = '09';
	 }
	return `${hours}:${minutes}`;
 };

 let convertDate = temp => {
	let [month,date,year] = temp.split("/");
	if (date === '1') {
		date = '01';
	}
	if (date === '2') {
		date = '02';
	 } 
	 if (date === '3') {
		date = '03';
	 }
	 if (date === '4') {
		date = '04';
	 }
	 if (date === '5') {
		date = '05';
	 }
	 if (date === '6') {
		date = '06';
	 }
	 if (date === '7') {
		date = '07';
	 }
	 if (date === '8') {
		date = '08';
	 }
	 if (date === '9') {
		date = '09';
	 }
	return `${year}-${month}-${date}`;
 };

document.addEventListener('DOMContentLoaded', function () {
   // Hint: create or set your svg element inside this function
   function convert(d) {
return {
		Event_Name: d['Event_Name'],
		Tweet_Timestamp: new Date(d['Tweet_Timestamp']),
		Count: +d.Count
	}
}  
   //start timer
function convertCsv(d){
return{
  
    Event_Name: d['Event_Name'],
    Latitude: +d.Latitude,
    Longitude: +d.Longitude,											
    Tweet_Datestamp1: new Date(d['Tweet_Timestamp']),
    Tweet_Datestamp: convDate(d['Tweet_Timestamp']),
    Tweet_Timestamp: convTime(d['Tweet_Timestamp']),
    Event_Datestamp: convDate(d['Event_Timestamp']),
    Event_Timestamp: convTime(d['Event_Timestamp']),
    Category: d['Category (for our reference)'],
    Emotions: d['Emotion'],
    Uncertainity: +d['Uncertainity'],
    Hashtags: d['Hashtags'],
	NPMI: +d['NPMI'],
	Link_Ratio: +d.Link_Ratio,
	Hashtag_Ratio: +d.Hashtag_Ratio,
	User_Credibility: +d.User_Credibility,
	User_Diversity:	+d['User_Diversity'],
	Degree_Centrality:	+d['Degree_Centrality'],
	Tweet_Similarity: +d['Tweet_Similarity'],
	PMI: +d['PMI']
}
}

   // This will load your two CSV files and store them into two arrays.
     Promise.all([d3.csv('data/twitter_event_data.csv'),d3.json("data/world-topo.json"), 
	 d3.csv('data/twitter_data_pro.csv', convertCsv), d3.csv('data/heatmap.csv'),
	 d3.csv("data/final_new.csv"),d3.csv("data/emotions.csv"),d3.csv("data/finalday.csv",convert),
	 d3.csv("data/wordcloud.csv")])
        .then(function (values) {
            data1=values[0];
            data2=values[1];
            eventsdata = values[0];
            heatmapdata = values[3];
            data4=values[4];
            data5=values[5];
            data6=values[6];
			data7=values[7];
            emotion(data4,data5);
			heatMap(heatmapdata)
			//console.log(data1);
			var v=[];
			data1.forEach(function(d){
			v.push( {"EventName": d["Event Name"], "Hashtags": d["Hashtags"].replaceAll('#', ''), "size": 1})
		});
		//console.log(data7);
			wordCloud(data7,"default",[]);
     eventsdata.forEach(function(d) {
      d.size = +d.size;
    });
            //console.log('loaded twitter_data.csv and twitter_data.json');
            twitter_csv=values[2];
            getDateRange(twitter_csv);
               data1.forEach(function (a) {
                markers.push({"long":a.Longitude,"lat":a.Latitude});
            });
               geomap();
            
    });  
});

document.addEventListener('DOMContentLoaded', function () {
   
    Promise.all([d3.csv('data/EventDate_count.csv',function(d) {
											return {
														Event_Name: d['Event_Name'],
														Tweet_Timestamp: new Date(d['Tweet_Timestamp']),
														Count: +d.Count
													};
												}),
					d3.csv('data/EventDate_emotions.csv',function(d) {
											return {
														Event_Name: d['Event_Name'],
														Anger: +d.Anger,
														Disgust: +d.Disgust,	
														Fear: +d.Fear,
														Joy: +d.Joy,
														Sadness: +d.Sadness,
														Surprise: +d.Surprise
													};
												}),
					d3.csv('data/EventDate_Hourly.csv',function(d) {
										return {
													Event_Name: d['Event_Name'],
													Hour: +d.Hour,
													Tweet_Datestamp: convDate(d['Tweet_Timestamp']),
													Tweet_Timestamp: convTime(d['Tweet_Timestamp']),
													Day: new Date(d['Day']),
													Count: +d.Count
												};
											})

				])	
        .then(function(values) {
            console.log('loaded twitter_data.csv and twitter_data.json');
            EventDate_count=values[0];
			EventDate_emotions=values[1];
			EventDate_Hourly=values[2];
		});

	});
	
function emotion(data1,data3)
{
	var margin = {top: 30, right: 30, bottom: 50, left: 30},
    width = 300 - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;
    d3.select("#my_dataviz2").selectAll("*").remove();
    var barsvg = d3.select("#my_dataviz2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var EventNameDate=[{"EventName":"50 Year Anniversary of Pride March","Tweet_Timestamp":"10/27/2022 1:00"}]


  selectedEvents=[]
// EventNameDate.map(function(e)
//     {
//       eventname=e.EventName;
//       tweettime=e.Tweet_Timestamp;
      
//     });

// const [dateValues, timeValues] = tweettime.split(' ')
// data1.map(function(d){
//      if(d.Event_Name==eventname && d.Day==dateValues){
//        selectedEvents.push(d);    

//        }
//    })
selectedEvents.push(data1[0]);

//console.log("selectedeve",selectedEvents)
// selectedEventsSorted=[]

// hourSorted=function(d){ //console.log(d.Hour);return d["Hour"];};
// //console.log(hourSorted);
// selectedEvents.sort()
// //console.log(selectedEvents);


  var x = d3.scaleLinear()
    .domain([0,23])
    .range([ 0, width])
    //.domain(selectedEvents.map(d => d.Hour))
    //.padding(0.5);
    barsvg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(24))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 5])
    .range([ height, 0]);
  barsvg.append("g")
    .call(d3.axisLeft(y));

  // Bars
  barsvg.selectAll("mybar")
    .data(selectedEvents)
    .enter()
    .append("rect")
      .attr("x",d => x(new Date(d.Tweet_Timestamp).getHours()))
      .attr("y", d => y(1))
      .attr("width", "6")
      .attr("height", d => height - y(1))
      .attr("fill", "#69b3a2")



// ------------------------------------------------------------------------



selectedEventsEmotions=[]
EventNameDate.map(function(e){
  data5.map(function(d){
    //console.log(e)
    //console.log(e.EventName+" "+d["Event Name"]+" event date:"+e.EventDate)
  if(e.EventName==d["Event Name"]){
    dict={}
    dict["Anger"]=+d["Anger"]
    dict["Disgust"]=+d["Disgust"]
    dict["Fear"]=+d["Fear"]
    dict["Joy"]=+d["Joy"]
    dict["Sadness"]=+d["Sadness"]
    dict["Surprise"]=+d["Surprise"]
    selectedEventsEmotions.push(dict);
  }
})
})
//console.log(selectedEventsEmotions)
    d3.select("#emotion_viz").selectAll("*").remove();
    barsvg1 = d3.select("#emotion_viz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    x = d3.scaleBand()
    .range([ 0, width])
    .domain(["Anger","Disgust","Fear","Joy","Sadness","Surprise"])
    .padding(0.2);
    barsvg1.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Add Y axis
  y = d3.scaleLinear()
    .domain([0, 1])
    .range([ height, 0]);
  barsvg1.append("g")
    .call(d3.axisLeft(y));

    var color = d3.scaleOrdinal()
    .domain(["Anger","Disgust","Fear","Joy","Sadness","Surprise"])
    .range(['#FF0000','#800080','#FFA500','#90EE90','#00008B','#FFFF00'])
var keyOfEmotions=Object.keys(selectedEventsEmotions[0]);
//console.log(keyOfEmotions);

  // Bars
  barsvg1.selectAll("mybar")
    .data(keyOfEmotions)
    .enter()
    .append("rect")
      .attr("x",d => x(d))
      .attr("y", d => y(selectedEventsEmotions[0][d]))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(selectedEventsEmotions[0][d]))
      .attr("fill", function(d){ return color(d);})


  

input = [data1[0]];
//console.log("input",input);
d3.select("#my_dataviz3").selectAll("*").remove();
barsvg2 = d3.select("#my_dataviz3")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
	  

	let tweet_range=new Date(input[0].Tweet_Timestamp);
	//console.log("Tweet",tweet_range);
	
	//let count_range=d3.extent(input,d=>d.Count);
	////console.log("date",tweet_range[1]);
	let x_range=[new Date(tweet_range.getTime()-15*1000*3600*24),new Date(tweet_range.getTime()+15*1000*3600*24)]
	//console.log("range",x_range);
	let steps_x=30;
	
	let x1=d3.scaleTime()
		.range([0,width]);
	
	y1 = d3.scaleLinear()
  .range([ height, 0]);

	x1.domain([new Date(tweet_range.getTime()-15*1000*3600*24),new Date(tweet_range.getTime()+15*1000*3600*24)]);		
	y1.domain([0, 5 ]);
	//let y_axis1=d3.axisLeft(y).tickFormat(d3.format("d")).ticks(5);
	

    //console.log("x1y1",x1,y1);

	
    xAxis1 = barsvg2.append("g")
    .attr("transform", "translate(0," + height + ")")
    yAxis1 = barsvg2.append("g")
  .attr("class", "myYaxis") 

	//let x_axis1=d3.axisBottom(x).tickFormat(d3.timeFormat("%d-%m")).ticks(steps_x);
	////console.log(x_axis1);
	xAxis1.call(d3.axisBottom(x1).tickFormat(d3.timeFormat("%d-%m")).ticks(steps_x))
	     .selectAll('text')                   
		.style('text-anchor', 'middle')     
		.attr('dx','-30px')             
		.attr('dy','0px')
		.style('font-size','8px')								
		.attr('transform','rotate(-90)');

	yAxis1.call(d3.axisLeft(y1));	
	
	barsvg2.selectAll("mybar")
		.data(input)
		.enter()
		.append('rect')
		.attr("x",function(c){
			//console.log("xdate",c.Tweet_Timestamp);
			return x1(new Date(c.Tweet_Timestamp))+1;
		})
		.attr('y',(d,i)=>y1(1))
		.attr('width',10)
		.attr('height', d=>height-y1(1))
		.attr("fill", "#377eb8")
    .attr("stroke", "black");					   

}



function wordCloud(data,type,Hashtags){
	
  var margin = {top: 0, right: 20, bottom: 20, left: 20},
    width = 350 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

var fill = d3.scaleOrdinal().range(d3.schemeDark2);


d3.selectAll("#my_cloudviz > *").remove();
var wordCloudSvg = d3.select("#my_cloudviz")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")

 wordCloudSvg.attr("width", "100%")
 .attr("height", "100%")
 //.attr("fill", "black")
 //.style("stroke", "black")
 .style("stroke-width", 1);

 wordCloudSvg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	
	if(type!='default')
	{
    countOfHashtags(Hashtags,type);
	}
	else if(type=='default')
	{
		createlayout(data);
	}
	
	function countOfHashtags(Hashtags) // to create size for each Hashtag value
  {
	//console.log("string");
	  //console.log(Hashtags);
      // d3.selectAll("#my_dataviz>*").remove();
      var hashtaglist=[];
      var wc={};
      for (const i of Hashtags){
        wc[i]=  wc[i] ? wc[i]+1:1;
        
      }
      for (const i of Object.keys(wc)){
        hashtagscount={};
        hashtagscount["Hashtags"]= i;
        hashtagscount["size"] =wc[i];
        hashtaglist.push(hashtagscount);

      }
      
      createlayout1(hashtaglist)


}

	function createlayout(eventsdata)
{

       
        var layout = d3.layout.cloud()
        .size([width, height])
		.words(
			eventsdata.map(function(d) { return {text: d.Hashtags, size:d.size}; }))
        .padding(5)        
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .fontSize(function(d) { return d.size; })     
        .on("end", draw);
        layout.start();
        //console.log("in draw");


        function draw(words) {
          wordCloudSvg
          .append("g")
          .attr("transform", "translate(" + (width / 2) + "," + (height / 2) +")")
          .selectAll("text")
          .data(words)
          .enter().append("text")
          .style("font-size", function(d) { return d.size+ "px"; })   
          .style("fill", function(d, i) { return fill(i); })
          .style("font-family", "Impact")
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });
        }

}

function createlayout1(eventsdata)
{

       
        var layout = d3.layout.cloud()
        .size([width, height])
		.words(
			eventsdata.map(function(d) { return {text: d.Hashtags, size:d.size+12}; }))
        .padding(5)        
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .fontSize(function(d) { return d.size; })     
        .on("end", draw);
        layout.start();
        //console.log("in draw");


        function draw(words) {
          wordCloudSvg
          .append("g")
          .attr("transform", "translate(" + (width / 2) + "," + (height / 2) +")")
          .selectAll("text")
          .data(words)
          .enter().append("text")
          .style("font-size", function(d) { return d.size+ "px"; })   
          .style("fill", function(d, i) { return fill(i); })
          .style("font-family", "Impact")
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });
        }

}

}
 


function drawEventCalendarView(twitter_csv,start,stop,begin,end)
{
  const margin = { top: 0, right: 40, bottom: 10, left: 40 };
	eventSvg.selectAll('*').remove();
	let svg_ec = document.querySelector('#eventSvg');
	const width = parseInt(getComputedStyle(svg_ec).width, 10);
	const height = parseInt(getComputedStyle(svg_ec).height, 10);
	const innWidth = width - margin.left - margin.right;
	const innHeight = height - margin.top - margin.bottom;
	//let start,stop,begin,end;
	//[start,stop,begin,end]=getDateRange(data_csv);
	//console.log(start,stop,begin,end);
	let diff=stop.getTime()-start.getTime();
	let steps=Math.ceil(diff/(1000*3600*24));
	////console.log(steps)
	
	if(steps==0)
	{
		document.getElementById("st_demo").innerHTML="Start Date and End Date can't be same";
	}
	else
	{
	let tip = d3.select("body")
			.append("div")
			.style("position", "absolute")
			.style("width","auto")
			.style("height","auto")
			.style("text-align","center")
			.style("z-index", "10")
			.style("visibility", "hidden")
			.style("padding", "15px")
			.style("background", "black")
			.style("border", "2px")
			.style("margin", "5px")
			.style("border-radius", "8px")
			.style("color", "white")
			.style("font-family","arial")
			.style("font-size","15px")
			.style("line-height","20px")
			.style("pointer-events","none");

	let x_scl = d3.scaleTime().range([margin.left, innWidth-margin.right]).nice();
		x_scl.domain([begin,end]).ticks(1440);

	let y_scl = d3.scaleTime().range([innHeight-margin.bottom, margin.top]).nice();
		y_scl.domain([stop,start]);
		
	let y_axisL = d3.axisLeft(y_scl)
					.ticks(steps)
					.tickSizeInner(5) 
      				.tickSizeOuter(0)
					.tickFormat(d3.timeFormat("%Y-%m-%d"));

		eventSvg.append('g')
			.attr('id','yScaleL')
			.attr('transform', `translate(${margin.left},0)`)
			.attr('opacity', 0.5)
			.call(y_axisL);
			// .on("click", function(d,i){
			// 			d3.select(this).style("stroke-width",2);
			//     		tip.html(`Value: ${d.originalTarget["__data__"]}`)
			//     			.style("visibility", "visible")
			//     			.style("left",(event.pageX)+"px")
			//     			.style("top", (event.pageY)+"px");	
			//    });
			

	let y_axisR = d3.axisRight(y_scl)
					.ticks(steps)
					.tickSizeInner(5) 
	  				.tickSizeOuter(0)
					.tickFormat(d3.timeFormat("%a"));

		eventSvg.append('g')
			.attr('id','yScaleR')
			.attr('transform', `translate(${innWidth-margin.right+margin.left},0)`)
			.attr('opacity', 0.5)
			.call(y_axisR);
		
			
	let gridLines = d3.axisRight()
					  .ticks(steps)
					  .tickSize(innWidth-margin.right)
					  .tickFormat('')
					  .scale(y_scl);
		  
		eventSvg.append('g')
			.attr('id','grid')
			.attr('transform', `translate(${margin.left},0)`)
			.attr('opacity', 0.2)
			.call(gridLines);
			
		y_scl.domain([stop,start]);
		eventSvg.selectAll("#yScaleL")
			.transition()
			.duration(1500)
			.delay(600)
			.call(y_axisL);
		
		eventSvg.selectAll("#yScaleR")
			.transition()
			.duration(1500)
			.delay(600)
			.call(y_axisR);

	let emotions=['anger','disgust','fear','joy','sadness','surprise']
	let color=d3.scaleOrdinal(d3.schemeAccent).domain(emotions).range(["#A52A2A","#662D91","#FF7F50","#568203","#72A0C1","#FFC72C"]);

	let barGroups = eventSvg.selectAll('g.barGroup')
						.data(twitter_csv)
						.join('g')
			  			.attr('class', 'barGroup');		
	
					barGroups
						  .append('circle')
						  .attr('transform', `translate(${margin.left},0)`)
						  .attr('cx',d => x_scl(new Date(d.Event_Timestamp)))
						  .attr('cy',d => y_scl(new Date(d.Event_Datestamp)))
						  .attr('r', 10)
						  .attr('stroke', 'blue')
						  .attr('fill', d => color(d.Emotions))
						  .style('opacity',d => d.Uncertainity)
						  .attr('stroke-width',d => d.Uncertainity)
						  .on("mouseover", function(d,i) {
							  ////console.log(d,i);
							  d3.select(this).style("stroke-width",2).attr('opacity',2);
							  
							  tip.html(`Future Event: ${i.Event_Name} <br> Location: (${i.Latitude},${i.Longitude})`)
								  .style("visibility", "visible")
								  .style("left",(event.pageX)+"px")
								  .style("top", (event.pageY)+"px");			
						  })	
						  .on("mouseout", function(d,i) {
							  d3.select(this).style("stroke-width",1).attr('opacity',0.25);
							  tip.style("visibility", "hidden");
						  })
						  .on("mousemove",function(d,i) {
							  tip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");
						  })
						  // .on('click',function(d,i) {
						  // 	////console.log(d,i);
						  // 	let temp=[{"Event_Name":0,"Tweet_Datestamp":0,"Event_Datestamp":0}]
						  // 	temp[0]["Event_Name"]=i.Event_Name;
						  // 	temp[0]["Tweet_Datestamp"]=i.Tweet_Datestamp;
						  // 	temp[0]["Event_Datestamp"]=i.Event_Datestamp;
						  // 	//console.log(temp)			
						  // })
						  .on("click", function(d,i){
                c=[]
                c.push({EventName:d["explicitOriginalTarget"]["__data__"]["Event_Name"],Tweet_Timestamp:d["explicitOriginalTarget"]["__data__"]["Tweet_Datestamp1"]});
                emotion(c,c);
						
						let data_filter_date = EventDate_count.filter(obj => {
						if (obj.Event_Name === i.Event_Name) {
							return true;
						}
					});
					
					let data_filter_emotions = EventDate_emotions.filter(obj => {
						if (obj.Event_Name === i.Event_Name) {
							return true;
						}
					});

					let data_filter_hour = EventDate_Hourly.filter(obj => {
						if (obj.Event_Name === i.Event_Name) {
							return true;
						}
					});
					
					let filter_hour=[{"Event_Name":i.Event_Name,"Tweet_Timestamp":i.Tweet_Datestamp}]
					
							  let temp = [ 
								  [
									  {axis:"NPMI",value:i.NPMI},
									  {axis:"Link Ratio",value:i.Link_Ratio},
									  {axis:"Hashtag Ratio",value:i.Hashtag_Ratio},
									  {axis:"User Credibility",value:i.User_Credibility},
									  {axis:"User Diversity",value:i.User_Diversity},
									  {axis:"Degree Centrality",value:i.Degree_Centrality},
									  {axis:"Tweet Similarity",value:i.Tweet_Similarity}
								  ]
							  ];
							  //console.log(temp)
					tip.html("<p><h3>Event-List View</h3></p><div id='tipDivRadial'><svg id='tipSVGRadial'></svg></div><div id='tipDivBar'><svg id='tipSVGBar1'></svg><br><br><svg id='tipSVGBar2'></svg><br><br><svg id='tipSVGBar3'></svg></div>")
						.style("visibility", "visible")
						.style("left",(event.pageX)+"px")
						.style("top", (event.pageY)+"px")
						.transition().duration(200);
		
					//const margin = {top: 90, right: 70, bottom:90, left: 70},
					let margin_tip = {top: 50, right: 50, bottom: 50, left: 50};
					let svg_rad = document.querySelector('#tipSVGRadial');
					let width = parseInt(getComputedStyle(svg_rad).width, 10);
					let height = parseInt(getComputedStyle(svg_rad).height, 10);
					let inwidth = width - margin_tip.left - margin_tip.right;
					let inheight = height - margin_tip.top - margin_tip.bottom;
					
					// d3.select("#tipDiv")
					// 	.append("svg")
					// 	.attr("id","tipSVG")
					// 	.attr("width", width - margin.left - margin.right)
					// 	.attr("height", height - margin.top - margin.bottom)
					// 	  .append("g")
					// 	.attr("transform","translate(" + margin.left + "," + margin.top + ")");
					
					let color_temp=d3.scaleOrdinal(d3.schemeAccent).domain(temp[0]).range(["#A52A2A"]);
					let radarChartOptions_temp={
							w: inwidth,
							h: inheight,
							margin: margin_tip,
							maxValue: 0.5,
							levels: 10,
							roundStrokes: true,
							color: color_temp
						  };			
					RadarChart("#tipSVGRadial", temp, radarChartOptions_temp);
					BarChart_DateCount("#tipSVGBar1",data_filter_date);
					BarChart_HourCount("#tipSVGBar2",data_filter_hour,filter_hour);
					BarChart_EmotionsCount("#tipSVGBar3",data_filter_emotions);
				})
				.on("dblclick", function(){
					tip.selectAll('*').remove();
					tip.style("visibility", "hidden");
				})
				.transition()
				.duration(1500)
				.delay(600);
				
				
	function getSolidLine(k,l)
	{
		let events=[];
		events.push(k.Event_Name,l.Event_Name);
			barGroups.append('line')
				.attr('transform', `translate(${margin.left},0)`)
				.attr('x1', x_scl(k.Event_Timestamp))
				.attr('y1', y_scl(k.Event_Datestamp))
				.attr('x2', x_scl(l.Event_Timestamp))
				.attr('y2', y_scl(l.Event_Datestamp))
				.attr('stroke', 'red')
				.attr('opacity',0.1)
				.style("stroke-width",0.6)
				.on("mouseover", function(d,i) {
					//console.log("Event hover: ")
					//console.log(i)
					d3.select(this).style("stroke-width",2).attr('opacity',1);	
					tip.html(`Future Events: <br> ${events}`)
							.style("visibility", "visible")
							.style("left",(event.pageX)+"px")
							.style("top", (event.pageY)+"px");			
				})	
				.on("mouseout", function(d,i) {
					//console.log("Event hover: ")
					//console.log(i)
					d3.select(this).style("stroke-width",0.6).attr('opacity',0.1);
					tip.style("visibility", "hidden");
				})
				.on("mousemove",function(d,i) {
					//console.log("Event hover: ")
					//console.log(i)
					tip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");
				}).transition()
				.duration(1500)
				.delay(600);
	}

	function getDottedLine(k,l)
		{
				let hash1=k.Hashtags.split(" ");
				for(let i=0;i<hash1.length;i++)
				{
					hash1[i]=hash1[i].toString().replace("#","");
				}

				let hash2=l.Hashtags.split(" ");
				for(let i=0;i<hash2.length;i++)
				{
					hash2[i]=hash2[i].toString().replace("#","");
				}
				let intersection=hash1.filter(x=>hash2.includes(x));
				let hash_cloud=[]
				hash_cloud.push(...hash1,...hash2)
				//console.log(hash_cloud)
				if(intersection.length>=8)
				{
					////console.log(hash1,hash2,intersection);
					barGroups.append('line')
						.attr('transform', `translate(${margin.left},0)`)
						.attr('x1', x_scl(k.Event_Timestamp))
						.attr('y1', y_scl(k.Event_Datestamp))
						.attr('x2', x_scl(l.Event_Timestamp))
						.attr('y2', y_scl(l.Event_Datestamp))
						.style("stroke-dasharray", ("9,2"))
						.attr('stroke', 'blue')
						.attr('opacity',0.1)
						.style("stroke-width",0.6)
						.on("mouseover", function(d,i) {
							////console.log(d,i);
							d3.select(this).style("stroke-width",2).attr('opacity',1);	
							tip.html(`Shared Keywords: <br> ${intersection}`)
									.style("visibility", "visible")
									.style("left",(event.pageX)+"px")
									.style("top", (event.pageY)+"px");			
						})	
						.on("mouseout", function(d,i) {
							d3.select(this).style("stroke-width",0.6).attr('opacity',0.25);
							tip.style("visibility", "hidden");
						})
						.on("mousemove",function(d,i) {
							tip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");
						})
						.on("click",function(){
							// tip.html("<p>WordCloud View</p><div id='tipDiv'><svg id='tipSVG'></svg></div>")
							// 		.style("visibility", "visible")
							// 		.style("left",(event.pageX)+"px")
							// 		.style("top", (event.pageY)+"px")
							// 		.transition().duration(200);

							// let margin_tip = {top: 70, right: 30, bottom: 70, left: 60};
							// let svg_rad = document.querySelector('#tipSVG');
							// let width = parseInt(getComputedStyle(svg_rad).width, 10);
							// let height = parseInt(getComputedStyle(svg_rad).height, 10);
							// let inwidth = width - margin_tip.left - margin_tip.right;
							// let inheight = height - margin_tip.top - margin_tip.bottom;
							//countOfHashtags(hash_cloud,inwidth,inheight,"#tipSVG");
							console.log(hash_cloud);
							wordCloud(data7,'',hash_cloud);
						})
						.transition()
						.duration(1500)
						.delay(600);
						//.style("stroke-dasharray", ("3, 3"));
				}
		}

	for(let i=0;i<barGroups._groups[0].length-1;i++)
	{
		for(let j=i+1;j<barGroups._groups[0].length;j++)
		{
			////console.log('23',x_scl(barGroups._groups[0][i]["__data__"].Tweet_Timestamp),x_scl(barGroups._groups[0][j]["__data__"].Tweet_Timestamp))
			if(barGroups._groups[0][i]["__data__"].Latitude===barGroups._groups[0][j]["__data__"].Latitude && barGroups._groups[0][i]["__data__"].Longitude===barGroups._groups[0][j]["__data__"].Longitude){
				getSolidLine(barGroups._groups[0][i]["__data__"],barGroups._groups[0][j]["__data__"]);
			}
			if(i!=j)
			{
				getDottedLine(barGroups._groups[0][i]["__data__"],barGroups._groups[0][j]["__data__"]);
			}
		}
	}
}	
}

function BarChart_DateCount(id,input)
{
	//d3.select(id).select("svg").remove();
	//console.log(input);
	if (input.length === 0) {
		d3.select(id).select("svg").remove();
		
	}
	else{
		let margin = {top: 10, right: 20, bottom: 60, left: 40};
		// let margin = {top: 20, right: 20, bottom: 20, left: 20};
		let svg_ec = document.querySelector(id);
		const width = parseInt(getComputedStyle(svg_ec).width, 10);
		const height = parseInt(getComputedStyle(svg_ec).height, 10);
	
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;
		//console.log(width,height,innerHeight,innerWidth)
		
		let svg=d3.select(id).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");
		
		let tweet_range=d3.extent(input,d=>d.Tweet_Timestamp);
		//console.log(tweet_range)
		
		//let count_range=d3.extent(input,d=>d.Count);
		//console.log(count_range);
		
		let x_range=[new Date(tweet_range[1].getTime()-15*1000*3600*24),new Date(tweet_range[1].getTime()+15*1000*3600*24)]
		//console.log(x_range)
		let steps_x=31;
		
		//let steps_y=count_range[1]-count_range[0];
		// console.log(steps_y)
		
		let x=d3.scaleTime()
			.domain(x_range)
			.range([0,innerWidth]);
		
		
		let y=d3.scaleLinear()
				.domain([0,5])
				.nice()
				.range([innerHeight,0]);
		
		let y_axis=d3.axisLeft(y).tickFormat(d3.format("d")).ticks(3);
		
		svg.append('g')
			.call(y_axis)
			.attr('fill','black')
			.selectAll('text')
			.attr('fill','black')
			.style('font-size','10px');
	
		let x_axis=d3.axisBottom(x).tickFormat(d3.timeFormat("%d-%m")).ticks(steps_x);
		svg.append('g')
			.call(x_axis)
			.attr('fill','black')
			.attr('transform',`translate(0,${innerHeight})`)
			.selectAll('text')                   
			.style('text-anchor', 'middle')
			.attr('dx','-30px')             
			.attr('dy','0px')
			.attr('fill','black')
			.style('font-size','10px')								
			.attr('transform','rotate(-90)');
			
		svg.append('text')
			.attr('transform','rotate(-90)')
			.attr('y',-30)
			.attr('x',-innerHeight/2)
			.attr('text-anchor','middle')
			.style('font-size','10px')
			.text('Frequency')
			
		svg.append('text')
			.attr('text-anchor','middle')
			.attr('x',innerWidth/2)
			.attr('y',innerHeight+55)
			.style('font-size','10px')
			.text('30-Day span from the date of event')
				
		svg.selectAll("mybar")
			.data(input)
			.enter()
			.append('rect')
			.attr("x",(c)=>x(c.Tweet_Timestamp))
			.attr('y',(d)=>y(d.Count))
			.attr('fill','#A52A2A')
			.attr('width',10)
			.attr('height', d=>innerHeight-y(d.Count));
	}
}

function BarChart_EmotionsCount(id,input)
{
	temp={};
	//d3.select(id).select("svg").remove();
	//console.log(input);
	if (input.length === 0) {
		d3.select(id).select("svg").remove();
		
	}
	else{
		input.map(function(d){
			temp["Anger"]=d["Anger"]
			temp["Disgust"]=d["Disgust"]
			temp["Fear"]=d["Fear"]
			temp["Joy"]=d["Joy"]
			temp["Sadness"]=d["Sadness"]
			temp["Surprise"]=d["Surprise"]
		  })
		  
		//console.log(temp)
		let margin = {top: 10, right: 20, bottom: 60, left: 40};
		// let margin = {top: 20, right: 20, bottom: 20, left: 20};
		let svg_ec = document.querySelector(id);
		const width = parseInt(getComputedStyle(svg_ec).width, 10);
		const height = parseInt(getComputedStyle(svg_ec).height, 10);
	
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;
		//console.log(width,height,innerHeight,innerWidth)
		
		let svg=d3.select(id).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");
		
		let keyOfEmotions=Object.keys(temp);
		let color=d3.scaleOrdinal(d3.schemeAccent).domain(keyOfEmotions).range(["#A52A2A","#662D91","#FF7F50","#568203","#72A0C1","#FFC72C"]);
	
		let x=d3.scaleBand()
			.domain(keyOfEmotions)
			.range([0,innerWidth])
			.padding(0.2);
		
		
		let y=d3.scaleLinear()
				.domain([0,2])
				.nice()
				.range([innerHeight,0]);
		
		let y_axis=d3.axisLeft(y).ticks(3);
		
		svg.append('g')
			.call(y_axis)
			.attr('fill','black')
			.selectAll('text')
			.attr('fill','black')
			.style('font-size','10px');

		let x_axis=d3.axisBottom(x);
		svg.append('g')
			.call(x_axis)
			.attr('fill','black')
			.attr('transform',`translate(0,${innerHeight})`)
			.selectAll('text')                   
			.style('text-anchor', 'middle')
			.attr('dx','0px')             
			.attr('dy','20px')
			.attr('fill','black')
			.style('font-size','10px')								
			.attr('transform','rotate(0)');
			
		svg.append('text')
			.attr('transform','rotate(-90)')
			.attr('y',-30)
			.attr('x',-innerHeight/2)
			.attr('text-anchor','middle')
			.style('font-size','10px')
			.text('Frequency')
			
		svg.append('text')
			.attr('text-anchor','middle')
			.attr('x',innerWidth/2)
			.attr('y',innerHeight+50)
			.style('font-size','10px')
			.text('Emotions')

		svg.selectAll("mybar")
			.data(keyOfEmotions)
			.enter()
			.append('rect')
			.attr("x",(c)=>x(c))
			.attr('y',(d) =>y(temp[d]))
			.attr('fill',function(d){ return color(d);})
			.attr("width", x.bandwidth())
			.attr('height', d=>innerHeight-y(temp[d]));
	}
}

function BarChart_HourCount(id,input,filter_hour)
{
	//d3.select(id).select("svg").remove();
	if (input.length===0 || filter_hour.length===0) {
		d3.select(id).select("svg").remove();
	}
	else{
		//console.log('123',input);
		let input_filter = input.filter(obj => {
			if (String(obj.Tweet_Datestamp)===String(filter_hour[0]['Tweet_Timestamp'])) {
				return true;
			}
		});
		//console.log(input_filter);
		//console.log(d3.extent(input_filter,d=>d.Hour))
		let margin = {top: 10, right: 20, bottom: 60, left: 40};
		// let margin = {top: 20, right: 20, bottom: 20, left: 20};
		let svg_ec = document.querySelector(id);
		const width = parseInt(getComputedStyle(svg_ec).width, 10);
		const height = parseInt(getComputedStyle(svg_ec).height, 10);
	
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;
		//console.log(width,height,innerHeight,innerWidth)
		
		let svg=d3.select(id).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");
		
		let xrange=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]

		let x=d3.scaleBand()
			.domain(xrange)
			.range([0,innerWidth])
			.padding(0.2);
		
		
		let y=d3.scaleLinear()
				.domain([0,5])
				.nice()
				.range([innerHeight,0]);
		
		let y_axis=d3.axisLeft(y).ticks(3);
		
		svg.append('g')
			.call(y_axis)
			.attr('fill','black')
			.selectAll('text')
			.attr('fill','black')
			.style('font-size','10px');
	
		let x_axis=d3.axisBottom(x);
		svg.append('g')
			.call(x_axis)
			.attr('fill','black')
			.attr('transform',`translate(0,${innerHeight})`)
			.selectAll('text')                   
			.style('text-anchor', 'middle')
			.attr('dx','0px')             
			.attr('dy','20px')
			.attr('fill','black')
			.style('font-size','10px')								
			.attr('transform','rotate(0)');
			
		svg.append('text')
			.attr('transform','rotate(-90)')
			.attr('y',-30)
			.attr('x',-innerHeight/2)
			.attr('text-anchor','middle')
			.style('font-size','10px')
			.text('Frequency')
			
		svg.append('text')
			.attr('text-anchor','middle')
			.attr('x',innerWidth/2)
			.attr('y',innerHeight+50)
			.style('font-size','10px')
			.text('24-Hour span during the date of the tweet')

		svg.selectAll("mybar")
			.data(input_filter)
			.enter()
			.append('rect')
			.attr("x",(c)=>x(c.Hour))
			.attr('y',(d) =>y(d.Count))
			.attr('fill',"#72A0C1")
			.attr("width", x.bandwidth())
			.attr('height', d=>innerHeight-y(d.Count));
	 }
}

function RadarChart(id,data,options) {
	d3.select(id).select("svg").remove();
	let cfg = {
	 w: 200,				
	 h: 200,
	 margin: {top: 20, right: 20, bottom: 20, left: 20}, 
	 levels: 3,				
	 maxValue: 0, 			
	 labelFactor: 1.25, 	
	 wrapWidth: 60, 		
	 opacityArea: 0.35, 	
	 dotRadius: 4, 			
	 opacityCircles: 0.1, 	
	 strokeWidth: 2, 		
	 roundStrokes: false,
	 color: d3.scaleOrdinal(d3.schemeAccent)	
	};
	
	if('undefined' !== typeof options){
	  for(let i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }
	}

	let maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
		
	let allAxis = (data[0].map(function(i, j){return i.axis})),	
		total = allAxis.length,					
		radius = Math.min(cfg.w/2, cfg.h/2), 	
		Format = d3.format(''),			 	
		angleSlice = Math.PI * 2 / total;
	
	let rScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, maxValue]);
	
	let svg = d3.select(id).append("svg")
			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar"+id);
		
	let g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
	
	let filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

	let axisGrid = g.append("g").attr("class", "axisWrapper");
	
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function(d, i){return radius/cfg.levels*d;})
		.style("fill", "#CDCDCD")
		.style("stroke", "black")
		.style("fill-opacity", cfg.opacityCircles)
		.style("filter" , "url(#glow)");

	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", 4)
	   .attr("y", function(d){return -d*radius/cfg.levels;})
	   .attr("dy", "0.4em")
	   .style("font-size", "10px")
	   .attr("fill", "#737373")
	   .text(function(d,i) { return Format(maxValue * d/cfg.levels); });
	
	let axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");

	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
		.attr("class", "line")
		.style("stroke", "black")
		.style("stroke-width", "2px");

	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "10px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.25em")
		.attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
		.text(function(d){return d})
		.call(textWrap, cfg.wrapWidth);

	let radarLine = d3.lineRadial()
		.radius(function(d) { return rScale(d.value); })
		.angle(function(d,i) {	return i*angleSlice; })
		.curve(d3.curveLinearClosed);
		
	if(cfg.roundStrokes) {
		radarLine.curve(d3.curveCardinalClosed);
	}
				
	let radialBlobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");
			
	radialBlobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("fill", function(d,i) { return cfg.color(i); })
		.style("fill-opacity", cfg.opacityArea);
		
	radialBlobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", function(d,i) { return cfg.color(i); })
		.style("fill", "none")
		.style("filter" , "url(#glow)");		
	
	radialBlobWrapper.selectAll(".radarCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", function(d,i,j) { return cfg.color(j); })
		.style("fill-opacity", 0.8);

	let radialBlobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");
		
	radialBlobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", cfg.dotRadius*1.5)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", "none")
		.style("pointer-events", "all");

	function textWrap(text, width) {
	  text.each(function() {
		let text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4,
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}
}

function getDateRange(twitter_csv)
{
	let start_date_str=d3.select("#d_start").property('value');
	let [s_year,s_month,s_date] = start_date_str.split('-');
	let start_date = new Date(+s_year, +s_month-1, +s_date);
	let end_date_str=d3.select("#d_end").property('value');
	let [e_year,e_month,e_date] = end_date_str.split('-');
	let end_date = new Date(+e_year, +e_month-1, +e_date);
	
	let delta=end_date.getTime()-start_date.getTime();

	let tweet_date=d3.extent(twitter_csv, a => a.Tweet_Datestamp);
	let event_date=d3.extent(twitter_csv, a => a.Event_Datestamp);
	let tweet_time=d3.extent(twitter_csv, a => a.Tweet_Timestamp);
	let event_time=d3.extent(twitter_csv, a => a.Event_Timestamp);
	//let start=event_date[0],stop=event_date[1],begin=event_time[0],end=event_time[1];

	let start,stop,begin,end;
	
	if(start_date>=event_date[0] || start_date>=tweet_date[0] && delta>0)
	{
		document.getElementById("st_demo").innerHTML="";
		start=start_date;
	}
	else
	{
		//document.getElementById("st_demo").innerHTML="Start date: "+start_date_str + " not in range";
		////console.log("Start date not in Range");
		if(tweet_date[0]<event_date[0])
		{
			start=tweet_date[0];
		}
		else
		{
			start=event_date[0];
		}
	}

	if(end_date<=event_date[1] || end_date<=tweet_date[1] && delta>0)
	{
		document.getElementById("en_demo").innerHTML="";
		stop=end_date;
	}
	else
	{
		//document.getElementById("en_demo").innerHTML="End date: "+end_date_str + " not in range";
		////console.log("End date not in Range");
		if(tweet_date[1]>event_date[1])
		{
			stop=tweet_date[1];
		}
		else
		{
			stop=event_date[1];
		}
	}

	if(tweet_time[1]>event_time[1])
	{
		end=tweet_time[1];
	}
	else
	{
		end=event_time[1];
	}

	if(tweet_time[0]<event_time[0])
	{
		begin=tweet_time[0];
	}
	else
	{
		begin=event_time[0];
	}
	drawEventCalendarView(twitter_csv,start,stop,begin,end);
}

function convDate(text)
{
	const myArray=text.split(" ");
	const datestamp=convertDate(myArray[0]);
	const timestamp=convertTime(myArray[1]);
	//let time=datestamp+"T"+timestamp;
	let time=`${datestamp}T00:00`;
	let d=new Date(time);
	return d;
}
  
function convTime(text)
{
	const myArray=text.split(" ");
	const datestamp=convertDate(myArray[0]);
	let total_time=totalTime(myArray[1]);
	let timestamp=convertTime(myArray[1]);
	let time=datestamp+"T"+timestamp;
	////console.log(total_time)
	//let d=new Date(time).getHours();
	return total_time;
}
function zoomed(e) {
  // mapLayer is a g element
  svg.attr("transform", e.transform);
}

function geomap()
{
  ////console.log(markers);

   var width=400;
  var height = 500;
  let zoom = d3.zoom()
  .scaleExtent([0, 7])
  .translateExtent([[-200, 0], [width+300, height]])
  .on('zoom', zoomed);

  svg = d3.select("#my_dataviz").attr('id', 'map').call(zoom).append("g");
 


  //var height = 500;

// Map and projection
// var projection = d3.geoMercator()
//   .fitSize([width, height], data2)

//   path = d3.geoPath().projection(projection)
  
//   svg.append("g")
//     .selectAll("path")
//     .data(data2.features)
//     .enter().append("path")
//     .attr("fill", "#b8b8b8")
//     .attr("d", d3.geoPath()
//       .projection(projection)
//     )
//     .style("stroke", "#fff")
//     .style("stroke-width", 1)
var projection = d3.geoEquirectangular()
        .scale(170)
        .translate([width / 2, height / 2]);

    var geoPath = d3.geoPath()
        .projection(projection);
    
        
         svg.append("g")
            .selectAll("path")
            .data( topojson.feature(data2, data2.objects.countries).features)
            .enter()
            .append("path")
            .attr( "d", geoPath )
            .attr("class","country");  
        

  //radius = Math.min(width, height) / 2;

    var color=["#4169e1","#1e90ff","#87cefa","#87ceeb","#b0c4de"]
    var arc = d3.arc()
      .outerRadius(15)
      .innerRadius(8);

    var pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.count; });
    
    var points = svg.selectAll("g")
    .data(data1)
    .enter()
    .append("g")
    .attr("transform",function(d) { 
      ////console.log(d.Latitude,d.Longitude);
      return "translate("+projection([d.Longitude,d.Latitude])+")" })
    .attr("class","pies")
    
    
  var pies = points.selectAll(".pies")
    .data(function(d) { 
      var a=d.data.split(['-']);
      e=[];
      a1='0'+d.Location
      a2='1'+d.Location
      a3='2'+d.Location
      a4='3'+d.Location
      a5='4'+d.Location
      ////console.log(a1,a2);
      e.push({"label":a1,"count":a[0],"hashtags":d.Hashtags, "eventName":d['Event Name']});
      e.push({"label":a2,"count":a[1],"hashtags":d.Hashtags, "eventName":d['Event Name']});
      e.push({"label":a3,"count":a[2],"hashtags":d.Hashtags, "eventName":d['Event Name']});
      e.push({"label":a4,"count":a[3],"hashtags":d.Hashtags, "eventName":d['Event Name']});
      e.push({"label":a5,"count":a[4],"hashtags":d.Hashtags, "eventName":d['Event Name']});
      //console.log(e);
      return pie(e);
    })
    .enter()
    .append('g')
    .attr('class','arc');
  
   bubbles = Array.from(
      d3.group(data1, d => d.Location), ([key, value]) => ({key, value})
    );
////console.log(bubbles);
   let tooltip1 = d3.select("#my_dataviz")
			  .append("div")
			  .style("position", "absolute")
			  .style("width","auto")
			  .style("height","auto")
			  .style("text-align","center")
			  .style("z-index", "10")
			  .style("visibility", "hidden")
			  .style("padding", "15px")
		   .style("background", "black")
			  .style("border", "2px")
			  .style("margin", "5px")
			  .style("border-radius", "8px")
			  .style("color", "white")
			  .style("font-family","sans-serif")
			  .style("font-size","8px")
			  .style("line-height","20px")
			  .style("pointer-events","none");
	var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);		  
	// Three function that change the tooltip when user hover / move / leave a cell
	const mouseover1 = function(event,d) {
	  tooltip1
		.style("opacity", 1)
	  d3.select(this)
		.style("stroke", "black")
		.style("stroke-width", 0)
		.style("opacity", 1)
	}
  
	const mousemove1 = function(event,d) {
        //console.log(event);
        a=event["explicitOriginalTarget"]["__data__"]["data"];
		div.transition()
		  .duration(20)
		  .style("opacity",1);
		  div.html("Event:"+ a.eventName+"<br>Location : "+a.label.slice(1))
		  .style("font-size","15px")
		  .style("left", (event.pageX) + "px")
		  .style("top", (event.pageY - 28) + "px");
		// tooltip.style("visibility", "hidden");
		// tooltip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");
	}
	
	const mouseleave1 = function(event,d) {
	  div
		.style("opacity", 0)
	  d3.select(this)
		.style("stroke", "black")
		.style("stroke-width", 0)
		.style("opacity", 0.8)
  
		div.transition()
		  .duration(100)
		  .style("opacity", 0);
	}
    
  pies.append("path")
    .attr('d',arc)
      .attr("fill",function(d,i){
           return color[i];
      })
      .on("mouseover", mouseover1)
	  .on("mousemove", mousemove1)
	  .on("mouseleave", mouseleave1)
      .on("click", function(d, i) {
        dataCloud=[]
        i.data.hashtags.split("#").forEach(hashtag =>{
          dataCloud.push(hashtag.replace('#'," "))
        })
		//console.log("t");
        //console.log(dataCloud);
        wordCloud([],"",dataCloud);
        // {'Event Name':'Womens World Cup', 'Hashtags': '', 'size': 3}
        
           //console.log(i);
           var svg2 = d3.select("#my_dataviz1");
           svg2.selectAll("*").remove();
           var c1;
           for(let j=0;j<bubbles.length;j++)
           {
                if(bubbles[j]["key"]==i.data.label.slice(1))
                {
                  c1=bubbles[j]["value"];
                }
           }
          ////console.log(bubbles,c1);
           var start = 0,
          end = 2.25,
      numSpirals = 4;

    var theta = function(r) {
      return numSpirals * Math.PI * r;
    };

    var r = d3.min([300, 300]) / 2 - 40;

    var radius = d3.scaleLinear()
      .domain([start, end])
      .range([40, r]);

    var svg1 = d3.select("#my_dataviz1").append("svg").attr('id',"svg1")
      .attr("width", 300)
      .attr("height", 500)
      .append("g")
      .attr("transform", "translate(" + 300 / 2 + "," + 300 / 2 + ")");

      svg1.append("rect").attr("x",-90).attr("y",160).attr("width", 15).attr("height",15).attr("fill", "#4169e1")
      svg1.append("rect").attr("x",-90).attr("y",180).attr("width", 15).attr("height",15).attr("fill", "#1e90ff")
      svg1.append("rect").attr("x",-90).attr("y",200).attr("width", 15).attr("height",15).attr("fill", "#87cefa")
      svg1.append("rect").attr("x",-90).attr("y",220).attr("width", 15).attr("height",15).attr("fill", "#87ceeb")
      svg1.append("rect").attr("x",-90).attr("y",240).attr("width", 15).attr("height",15).attr("fill", "#b0c4de")
      svg1.append("text").attr("x", -70).attr("y", 170).text("tommorow").style("font-size", "16px").style("fill","black").attr("alignment-baseline","middle")
      svg1.append("text").attr("x", -70).attr("y", 190).text("<=week").style("font-size", "16px").style("fill","black").attr("alignment-baseline","middle")
      svg1.append("text").attr("x", -70).attr("y", 210).text("<=2week").style("font-size", "16px").style("fill","black").attr("alignment-baseline","middle")
      svg1.append("text").attr("x", -70).attr("y", 230).text("<=30days").style("font-size", "16px").style("fill","black").attr("alignment-baseline","middle")
      svg1.append("text").attr("x", -70).attr("y", 250).text(">30days").style("font-size", "16px").style("fill","black").attr("alignment-baseline","middle")
    // create the spiral, borrowed from http://bl.ocks.org/syntagmatic/3543186
    var points1 = d3.range(start, end + 0.001, (end - start) / 1000);

    var spiral = d3.radialLine()
      .curve(d3.curveCardinal)
      .angle(theta)
      .radius(radius);

    var path1 = svg1.append("path")
      .datum(points1)
      .attr("id", "spiral")
      .attr("d", spiral)
      .style("fill", "none")
      .style("stroke", "steelblue");

    // fudge some data, 2 years of data starting today
    var spiralLength = path1.node().getTotalLength();
    //     N = 730,
    //     barWidth = (spiralLength / N) - 1;
    

    // var someData = [];
    // for (var i = 0; i < N; i++) {
    //   var currentDate = new Date();
    //   currentDate.setDate(currentDate.getDate() + i);
    //   someData.push({
    //     date: currentDate,
    //     value: Math.random()
    //   });
    // }
    var someData = [];
    for (var i = 0; i < c1.length; i++) {
      var currentDate = new Date(c1[i].Event_Timestamp);
      
      someData.push({
        date: currentDate,
        eventName : c1[i]["Event Name"],
        Tweet_Timestamp: new Date(c1[i].Tweet_Timestamp),

      });
    }
    ////console.log(data1,someData);
    var someData1 = [];
    // for (var i = 0; i < data1.length; i++) {
    //   var currentDate = new Date(data1[i].Event_Timestamp);
      
    //   someData1.push({
    //     date: currentDate,
    //     Tweet_Timestamp: new Date(data1[i].Tweet_Timestamp),

    //   });
    // }
    // //console.log(someData1);
    // here's our time scale that'll run along the spiral
    var timeScale = d3.scaleTime()
      .domain(d3.extent(someData, function(d){
        return d.date;
      }))
      .range([0, spiralLength]);
    ////console.log(someData,spiralLength);
    let tooltip2 = d3.select("#my_dataviz1")
			  .append("div")
			  .style("position", "absolute")
			  .style("width","auto")
			  .style("height","auto")
			  .style("text-align","center")
			  .style("z-index", "10")
			  .style("visibility", "hidden")
			  .style("padding", "15px")
		   .style("background", "black")
			  .style("border", "2px")
			  .style("margin", "5px")
			  .style("border-radius", "8px")
			  .style("color", "white")
			  .style("font-family","sans-serif")
			  .style("font-size","8px")
			  .style("line-height","20px")
			  .style("pointer-events","none");
	var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);		  

    const mouseover2 = function(event,d) {
	  tooltip1
		.style("opacity", 1)
	  d3.select(this)
		.style("stroke", "black")
		.style("stroke-width", 0)
		.style("opacity", 1)
	}
  
	const mousemove2 = function(event,d) {
        //console.log(event);
        a=event["explicitOriginalTarget"]["__data__"];
		div.transition()
		  .duration(20)
		  .style("opacity",1);
		  div.html("Event:"+ a.eventName +"<br> Time:" + a.date)
		  .style("font-size","15px")
		  .style("left", (event.pageX) + "px")
		  .style("top", (event.pageY - 28) + "px");
		// tooltip.style("visibility", "hidden");
		// tooltip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");
	}
	
	const mouseleave2 = function(event,d) {
	  div
		.style("opacity", 0)
	  d3.select(this)
		.style("stroke", "black")
		.style("stroke-width", 0)
		.style("opacity", 0.8)
  
		div.transition()
		  .duration(100)
		  .style("opacity", 0);
	}

    var spiral=svg1.selectAll("cir")
    .data(someData)
    spiral.exit().remove()
    spiral.enter()
    .append("circle")
    
    .attr("cx", (d,i) => {
      ////console.log(d.date);
      const linePos = timeScale(d.date)
      const posOnLine = path1.node().getPointAtLength(linePos+10)

      d.cx = posOnLine.x
      d.cy = posOnLine.y

      return d.cx;
    })
   .attr("cy", d => d.cy)
   .attr("r", "5")
   .on("mouseover", mouseover2)
	  .on("mousemove", mousemove2)
	  .on("mouseleave", mouseleave2)
   .style('fill',function(d){
    ////console.log(d);
          const date1 = d.Tweet_Timestamp;
const date2 = d.date;
const diffTime = Math.abs(date2 - date1);

const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
////console.log(date1,date2,diffDays);

if(diffDays<=1){
  return "#4169e1";
}
else if(diffDays>1 && diffDays<=7){
  return "#1e90ff";
}
else if(diffDays>7 && diffDays<=14){
  return "#87cefa";
}
else if(diffDays>14 && diffDays<=30){
  return "#87ceeb";
}
else{
  return "#b0c4de";
}
       });
    
  })
;



  count =0;
    pies.append('text')
    .style('fill', '#000000')
    .style("font-size", "11px")
    .style("font-weight", "bold")
    .attr("transform", "translate(0," + 2 + ")")
    .attr("text-anchor", "middle")
    .html(function(d, i){
      ////console.log(d.data.count);
      if(i===0){count=0;}
      if(i<4){count += parseInt(d.data.count); }
      if(i===4){return count+parseInt(d.data.count);}
      else {return ""}} ); 

	}
    //------------------------------------

const heatMap = (data)=>{
	const margin = {top: 10, right: 5, bottom: 60, left: 50},
	width = 350 - margin.left - margin.right,
	height = 200 - margin.top - margin.bottom;
  
  // append the svg object to the body of the page
  var svg = d3.select("#my_heatmapviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");
  
  //Read the data

	var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);
	// Labels of row and columns -> unique identifier of the column called 'Category' and 'Emotion'
	const myGroups = Array.from(new Set(data.map(d => d.Category)))
	const myVars = Array.from(new Set(data.map(d => d.Emotion)))
	//console.log(myGroups);
	//console.log(myVars);
	// Build X scales and axis:333
	const x = d3.scaleBand()
	  .range([ 0, width ])
	  .domain(myGroups)
	  .padding(0.05);
	svg.append("g")
	  .style("font-size", 15)
	  .attr("transform", `translate(0, ${height})`)
	  //.attr("transform", "rotate(-65)")
	  .call(d3.axisBottom(x))
	  .selectAll("text")
			  .style("text-anchor", "end")
			  // .attr("dx", "-.8em")
			  // .attr("dy", ".15em")
			  .attr("transform", "rotate(-35)" )
  
	  svg.select(".domain").remove()
	  for(let i=0;i<=7;i++){
		svg.select("line").remove()
	  }
	  //svg.select("line").remove()
  
  
	// Build Y scales and axis:
	const y = d3.scaleBand()
	  .range([ height, 0 ])
	  .domain(myVars)
	  .padding(0.05);
	svg.append("g")
	  .style("font-size", 15)
  
	  .call(d3.axisLeft(y).tickSize(0))
	  .select(".domain").remove();
  
  
	// Build color scale
	const myColor = d3.scaleSequential()
	  .interpolator(d3.interpolateInferno)
	  .domain([25,0])
	  //console.log(myColor(0))
  
  
  let tooltip = d3.select("#my_heatmapviz")
			  .append("div")
			  .style("position", "absolute")
			  .style("width","auto")
			  .style("height","auto")
			  .style("text-align","center")
			  .style("z-index", "10")
			  .style("visibility", "hidden")
			  .style("padding", "15px")
			  .style("background", "black")
			  .style("border", "2px")
			  .style("margin", "5px")
			  .style("border-radius", "8px")
			  .style("color", "white")
			  .style("font-family","sans-serif")
			  .style("font-size","15px")
			  .style("line-height","20px")
			  .style("pointer-events","none");
	// Three function that change the tooltip when user hover / move / leave a cell
	const mouseover = function(event,d) {
	  tooltip
		.style("opacity", 1)
	  d3.select(this)
		.style("stroke", "black")
		.style("stroke-width", 4)
		.style("opacity", 1)
	}
  
	const mousemove = function(event,d) {
  
		div.transition()
		  .duration(20)
		  .style("opacity",1);
		  div.html("There are "+ d.Count+" events which are "+d.Category+" and "+d.Emotion)
		  .style("font-weight","bold")
		  .style("left", (event.pageX) + "px")
		  .style("top", (event.pageY - 28) + "px");
		// tooltip.style("visibility", "hidden");
		// tooltip.style("top", (event.pageY)+"px").style("left",(event.pageX)+"px");
	}
	
	const mouseleave = function(event,d) {
	  div
		.style("opacity", 0)
	  d3.select(this)
		.style("stroke", "black")
		.style("stroke-width", 2)
		.style("opacity", 0.8)
  
		div.transition()
		  .duration(100)
		  .style("opacity", 0);
	}
  
	// add the squares
	svg.selectAll()
	  .data(data, function(d) { return d.Category+':'+d.Emotion;})
	  .join("rect")
		.attr("x", function(d) { return x(d.Category) })
		.attr("y", function(d) { return y(d.Emotion) })
		.attr("rx", 4)
		.attr("ry", 4)
		.attr("width", x.bandwidth() )
		.attr("height", y.bandwidth() )
		.style("fill", function(d) { return myColor(d.Count)} )
		.style("stroke-width", 2)
		.style("stroke", "black")
		.style("opacity", 0.8)
	  .on("mouseover", mouseover)
	  .on("mousemove", mousemove)
	  .on("mouseleave", mouseleave)
  }
  
  // Add title to graph
  // svg.append("text")
  //         .attr("x", 0)
  //         .attr("y", -50)
  //         .attr("text-anchor", "left")
  //         .style("font-size", "22px")
  //         .text("A d3.js heatmap");
  //
  // // Add subtitle to graph
  // svg.append("text")
  //         .attr("x", 0)
  //         .attr("y", -20)
  //         .attr("text-anchor", "left")
  //         .style("font-size", "14px")
  //         .style("fill", "grey")
  //         .style("max-width", 400)
  //         .text("A short description of the take-away message of this chart.");
 
