
console.log('graph loaded');

google.load("visualization", "1.1", {packages:["corechart"]});

      google.setOnLoadCallback(drawChart);

      function drawChart(chart_data) {
        var data = google.visualization.arrayToDataTable([['Year', 'Tesla', 'Comp'],
          ['2015', 1500, 2000],
          ['2016', 1500, 2000],
          ['2017', 1500, 2000],
          ['2018', 1500, 2000],
          ['2019', 1500, 2000]]);

        // var options = {
        //   width: 900,
        //   height: 500,
        //   backgroundColor: '#809BBF',
        //   chart: {
        //     title: 'Performance',
        //     subtitle: 'Tesla vs Comp Performance Statistics',
        //   }
        // };

         var options = {
          width: 900,
          height: 500,
          title: 'Tesla vs. Comp Total Annual Costs ($Dollars)',
          curveType: 'function',
          colors: ['#bf0021','black'],
          backgroundColor: '#809BBF'
        };

        // var chart = new google.charts.Bar(document.getElementById('chart_div'));

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);

        // chart.draw(data, options);
    }

    // var data2 = [['Performance', 'Tesla', 'Comp'],
    //       ['Horsepower', 99999, 400],
    //       ['Torque', 9999, 460],
    //       ['0-60', 660, 19120],
    //       ['Turn Radius', 1030, 540],
    //       ['Air Drag', 1030, 5940],
    //       ['Curb Weight', 1030, 5940]];

    function reDrawChart(chart_data) {
      console.log('chart redrawn with:', chart_data);
        var data = google.visualization.arrayToDataTable(chart_data);
         var options = {
          width: 900,
          height: 500,
          title: 'Tesla vs. ' + compCar.make +  ' Annual Costs ($)',
          colors: ['#bf0021','black'],
          backgroundColor: '#809BBF'
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

        chart.draw(data, options);
    }