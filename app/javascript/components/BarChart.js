import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
// import sample_events from "../sample_data/sample_events"
import useGoogleCharts from './useGoogleCharts'

function BarChart ({userSummary}) {
    // console.log(userSummary)
    const google = useGoogleCharts()
    const [chart, setChart] = useState(null);
    const [dimensions, setDimensions] = useState({ 
      height: 0,
      width: 0
    })
    useEffect(() => {
      if (google && !chart) {

        // Calculate total duration spent per activity in minutes
        function totalDurationInMins(duration) {
            var durationInMins = duration / (1000 * 60);
            return durationInMins;
        }

        function getDuration(startTime, endTime){
          var startTime = Date.parse(startTime)
          var endTime = Date.parse(endTime)
          return endTime - startTime
        }
        // let events = sample_events["sample_events"];

        // Create the data table.
        var totalDuration = {};
        const data = new google.visualization.DataTable();
        data.addColumn({ type: 'string', id: 'Events' });
        data.addColumn({ type: 'number', id: 'Duration' });
            userSummary.forEach(event => {
                if (event.table.event_name in totalDuration)
                    { 
                      if(event.table.parameters.duration != undefined){
                          totalDuration[event.table.event_name] = totalDuration[event.table.event_name] + totalDurationInMins(Math.trunc(event.table.parameters.table.duration));
                      } else {
                        var duration = getDuration(event.table.start_time,event.table.end_time)
                        totalDuration[event.table.event_name] = totalDuration[event.table.event_name] + totalDurationInMins(duration);
                      }
                    }
                else 
                    {
                      if(event.table.parameters.duration != undefined){
                        totalDuration[event.table.event_name] = totalDurationInMins(Math.trunc(event.table.parameters.table.duration))
                      } else {
                        var duration = getDuration(event.table.start_time,event.table.end_time)
                        totalDuration[event.table.event_name] = totalDurationInMins(duration);
                      }
                    } 
                   
                }
            );

            // console.log(totalDuration);
            
            for (const key in totalDuration) {
                // console.log(`${key}: ${totalDuration[key]}`);
                data.addRow([key, totalDuration[key]]);
              }

        // Set chart options
        var options = {
        title: 'Total Time Spent Doing Activity',
        legend: 'none',
        width: '100%',
        height: '100%',
        chartArea: {width: '100%'},
        hAxis: {title: 'Total Duration'},
        vAxis: {title: 'Event'},
        legend: {position: 'none'}
        };

        // Create a range slider, passing some options
        var categoryFilter = new google.visualization.ControlWrapper({
          'controlType': 'CategoryFilter',
          'containerId': 'dropdown_div',
          'options': {
            'filterColumnIndex': 0
          }
        });

      // Create a Bar chart, passing some options
      var barChartOptions = {
        width: '100%',
        height: '40%',
        legend: 'none'
    };

      var barChart = new google.visualization.ChartWrapper({
        'chartType': 'BarChart',
        'containerId': 'chart_div',
        'options': barChartOptions,
       
      });

    // Instantiate and draw our dashboard and chart, passing in some options.
    var dashboard = new google.visualization.Dashboard(document.getElementById('barchart_div'));
    dashboard.bind(categoryFilter, barChart);
    dashboard.draw(data,options);

    function resize () {
      // console.log("called barchart resize");
      const chart = new google.visualization.BarChart(document.getElementById('chart_div'));

      barChartOptions.width = 1.0 * window.innerWidth;
      //barChartOptions.height = .4 * window.innerHeight;
      dashboard.draw(data, options);
    }

    window.onload = resize;
    window.onresize = resize;
  }

    // // The select handler. Call the chart's getSelection() method
    // function selectHandler() {
    //   var selectedItem = chart.getSelection()[0];
    //   if (selectedItem) {
    //     var topping = data.getValue(selectedItem.row, 0);
    //     alert('The user selected ' + topping);
    //   }
    // }
    // // Listen for the 'select' event, and call my function selectHandler() when
    // // the user selects something on the chart.
    // google.visualization.events.addListener(chart, 'select', selectHandler);  
    
}, [google, chart]);

  return (
    <>
   
      {!google && <Spinner />}
      <div id="barchart_div">
        <div id="dropdown_div"></div>
        <div id="chart_div" className={!google ? 'd-none' : ''}/>
      </div>
    </>
  )
}
export default BarChart; 