
console.log('graph loaded');

google.load("visualization", "1.1", {packages:["bar"]});
      google.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Performance', 'Tesla', 'Comp'],
          ['Horsepower', 1000, 400],
          ['Torque', 1170, 460],
          ['2016', 660, 1120],
          ['2017', 1030, 540]
        ]);

        var options = {
          chart: {
            title: 'Company Performance',
            subtitle: 'Sales, Expenses, and Profit: 2014-2017',
          }
        };

        var chart = new google.charts.Bar(document.getElementById('chart_div'));

        chart.draw(data, options);
    }