
 google.load("visualization", "1", {packages:["corechart"]});

      google.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ['Year', 'Tesla', 'Comp'],
          ['2015',  23677,  13846],
          ['2016',  12138,  9005],
          ['2017',  11540,  8560],
          ['2018',  10950,  9187],
          ['2019',  10336,  9719]
        ]);

        var data2 = google.visualization.arrayToDataTable([
          ['Year', 'Tesla', 'Comp'],
          ['2015',  88134,  68134],
          ['2016',  69046,  59046],
          ['2017',  61775,  51775],
          ['2018',  54656,  34656],
          ['2019',  47681,  27681]
        ]);

        var options = {
          title: 'Tesla vs. Comp Total Annual Costs ($Dollars)',
          curveType: 'function',
          colors: ['#bf0021','black'],
          backgroundColor: '#809BBF',
          legend: { position: 'bottom', alignment: 'center', textStyle: {fontSize: 16} }
        };

        var options2 = {
          title: 'Tesla vs. Comp Total Depreciation ($Dollars)',
          curveType: 'function',
          colors: ['#bf0021','black'],
          backgroundColor: '#809BBF',
          legend: { position: 'bottom', alignment: 'center', textStyle: {fontSize: 16} }
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);

        var chart2 = new google.visualization.LineChart(document.getElementById('chart2_div'));

        chart2.draw(data2, options2);
      }