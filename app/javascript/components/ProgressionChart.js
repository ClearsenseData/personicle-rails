import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
// import sample_events from "../sample_data/sample_events"
import useGoogleCharts from './useGoogleCharts'


function ProgressionChart ({user_data}) {
  
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

        function findWeekNum (currentdate) {
            currentdate = new Date(currentdate);
            var oneJan = new Date(currentdate.getFullYear(),0,1);
            var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
            var result = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
            // console.log(`The week number of the current date (${currentdate}) is ${result}.`);
            return result;
        }
        function getDuration(startTime, endTime){
            var startTime = Date.parse(startTime)
            var endTime = Date.parse(endTime)
            return endTime - startTime
        }
        // let events = sample_events["sample_events"];
        // console.log(events);
        // Create the data table.
        var totalDuration = {}; // shows total duration for separate events over
        var weeklyDurations = {};
        var uniqueActivities = new Set();
            
        
            user_data.forEach(event => {
                var weekNum = findWeekNum(event.table.start_time);
                var yearNum = (new Date(event.table.start_time)).getFullYear();
                // console.log(yearNum)
                var year_week = yearNum.toString() + "_" + weekNum.toString();
                // console.log(year_week);
                uniqueActivities = uniqueActivities.add(event.table.event_name);
                // console.log(uniqueActivities)
                if (year_week in weeklyDurations)
                    {
                        totalDuration = weeklyDurations[year_week];
                    }
                 // We want total Duration for all events everyday
                else {
                    totalDuration = {}
                    }
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
                                totalDuration[event.table.event_name] = totalDurationInMins(duration)
                            }
                        } 
                    // console.log(totalDuration);
                    // console.log(year_week)
                    weeklyDurations[year_week] = totalDuration;
                }
                
            );
            // console.log(weeklyDurations)
            var data = new google.visualization.DataTable();
        //  ['Week', 'Walk', 'Run', 'Sport', 'Treadmill']
            data.addColumn({ type: 'string', id: 'Week in the Year', label: 'Week in the Year'});
            for (const activity of uniqueActivities) {
                data.addColumn( {type: 'number', id: activity, label: activity} )
                // console.log(activity);
            }

            var columnsTable = new google.visualization.DataTable();
            columnsTable.addColumn('number', 'colIndex');
            columnsTable.addColumn('string', 'colLabel');
            var initState= {selectedValues: []};
            // put the columns into this data table (skip column 0)
            for (var i = 1; i < data.getNumberOfColumns(); i++) {
                columnsTable.addRow([i, data.getColumnLabel(i)]);
                // you can comment out this next line if you want to have a default selection other than the whole list
                initState.selectedValues.push(data.getColumnLabel(i));
                // console.log(i, data.getColumnLabel(i));
            }
            // console.log(initState);
            // you can set individual columns to be the default columns (instead of populating via the loop above) like this:
            // initState.selectedValues.push(data.getColumnLabel(4));
        
            for (const year_week in weeklyDurations) {
              
                var dataRow = [];
                dataRow.push(year_week);
                for (const activity of uniqueActivities) {
                   
                    if (activity in weeklyDurations[year_week]) {
                        
                        dataRow.push(weeklyDurations[year_week][activity]);
                    }
                    else {
                        dataRow.push(0);
                    }
                }
                // console.log(dataRow)
                data.addRow(dataRow);
            }
                // console.log(data);
                // console.log(weeklyDurations);

        // Set chart options
        var options = {
            title: 'Total Time Spent Doing Various Activities Per Week',
            width: '100%',
            height: '50%',
            vAxis: {title: 'Total Duration'},
            hAxis: 
                {title: 'Event',
                showTextEvery: 2},
            legend: {position: 'left'},
            seriesType: 'bars'
        
        };

        // Create a range slider, passing some options
        var columnFilter = new google.visualization.ControlWrapper({
          'controlType': 'CategoryFilter',
          'containerId': 'combo_filter_div',
          'dataTable': columnsTable,
          options: {
            filterColumnLabel: 'colLabel',
            ui: {
                label: 'Columns',
                allowTyping: false,
                allowMultiple: true,
                allowNone: false,
                // selectedValuesLayout: 'belowStacked'
            }
        },
        state: initState
        });

      // Create a Bar chart, passing some options
      var comboChartOptions = {
        // title: '',
        width: '100%',
        height: '50%',
        vAxis: {title: 'Total Duration'},
        hAxis: 
            {title: 'Event',
            showTextEvery: 2},
        legend: {position: 'left'},
        seriesType: 'bars'
     
    };

      var combo_chart = new google.visualization.ChartWrapper({
        'chartType': 'ComboChart',
        'containerId': 'combo_chart_div',
        'dataTable': data,
        'options': comboChartOptions,
       
      });

    function setChartView () {
        var state = columnFilter.getState();
        var row;
        var view = {
            columns: [0]
        };
        // console.log(state);
        for (var i = 0; i < state.selectedValues.length; i++) {
            row = columnsTable.getFilteredRows([{column: 1, value: state.selectedValues[i]}])[0];
    
            // console.log("Data push===" + columnsTable.getValue(row, 0));
            view.columns.push(columnsTable.getValue(row, 0));
        }
        // sort the indices into their original order
        view.columns.sort(function (a, b) {
            return (a - b);
        });
        combo_chart.setView(view);
        combo_chart.draw();
    }
    google.visualization.events.addListener(columnFilter, 'statechange', setChartView);
    setChartView();
    columnFilter.draw();

    function resize () {
        //   console.log("called resize");
        //   const chart = new google.visualization.ComboChart(document.getElementById('combo_chart_div'));
    
        comboChartOptions.width = 1.0 * window.innerWidth;
        comboChartOptions.height = 0.5 * window.innerHeight;
        columnFilter.draw(data, options);
        setChartView();
        }
    
        window.onload = resize;
        window.onresize = resize;
    
}


//     // Instantiate and draw our dashboard and chart, passing in some options.
//     var dashboard = new google.visualization.Dashboard(document.getElementById('combo_dashboard_div'));
//     dashboard.bind(categoryFilter, comboChart);
//     dashboard.draw(data,options);

    
//   }

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
      <div id="combo_dashboard_div">
        <div id="combo_filter_div"></div>
        <div id="combo_chart_div" className={!google ? 'd-none' : ''}/>
      </div>
    </>
  )
}
  export default ProgressionChart; 