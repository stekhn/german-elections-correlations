(function () {

  'strict';

  // Settings
  var width = 170;
  var height = 170;

  var margin = {
    top: 10,
    right: 20,
    bottom: 20,
    left: 25
  };

  (function init() {

    d3.queue()
      .defer(d3.csv, 'data/btw17-results.csv')
      .defer(d3.csv, 'data/btw17-stats.csv')
      .await(function (error, results, stats) {

        var correlations;

        if (error) { throw error; }

        results = transform(results);
        stats = transform(stats);

        correlations = correlate(results, stats);

        draw(correlations);
      });
  })();

  function transform(data) {

    var map = {};

    data.forEach(function (row) {

      data.columns.forEach(function (column) {

        var value = isNaN(row[column]) ? row[column] : parseFloat(row[column]);

        // Handle empty values
        if (value === '' || value === '.' || value === '–' || value === '-99') {

          value = undefined;
        }

        map[column] = map[column] || [];
        map[column].push(value);
      });
    });

    return map;
  }

  function correlate(results, stats) {

    var correlations = [];

    Object.keys(results).forEach(function (r) {

      Object.keys(stats).forEach(function (s) {

        // Correlate all datasets which are not id, name or state
        if (r !== 'id' && r !== 'name' && r !== 'state' &&
          s !== 'id' && s !== 'name' && s !== 'state') {

          var correlation = ss.sampleCorrelation(results[r],stats[s]);

          correlations.push({
            correlation: correlation,
            xName: r,
            xDomain: d3.extent(results[r]),
            yName: s,
            yDomain: d3.extent(stats[s]),
            values: pairValues(results[r], stats[s], stats.state)
          });
        }
      });
    });

    // Sort correlations by their coefficient
    correlations.sort(function (a, b) {

      return d3.descending(Math.abs(a.correlation), Math.abs(b.correlation));
    });

    // Limit displayed results to 50, because of performance issues
    correlations.length = 50;

    return correlations;
  }

  function draw(correlations) {

    var vis, div;

    vis = d3.select('#vis');

    div = vis.selectAll('.chart')
        .data(correlations)
        .enter()
      .append('div')
        .attr('class', 'chart');

    div.append('p')
        .text(function (d) {
          return d.yName + ', Korrelation: ' +
            (Math.round(d.correlation * 100) / 100);
        });

    div.append('svg')
        .each(handleEach);
  }

  function handleEach(d) {

    var x, y, xAxis, yAxis, group;

    var svg = d3.select(this);

    x = d3.scaleLinear()
      .range([0, width])
      .domain([0, d.xDomain[1]]);

    y = d3.scaleLinear()
      .range([height, 0])
      .domain(d.yDomain[0] > 0 ? [0, d.yDomain[1]] : d.yDomain);

    xAxis = d3.axisBottom(x)
        .ticks(4);

    yAxis = d3.axisLeft(y)
        .ticks(4);

    group = svg
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    group.append('g')
        .call(yAxis);

    group.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
      .append('text')
        .attr('x', width)
        .attr('y', -6)
        .attr('text-anchor', 'end')
        .attr('fill', 'black')
        .text(d.xName);

    group.append('g')
        .attr('fill', function (e) { return getColor(e.xName); })
      .selectAll('circle')
        .data(d.values)
        .enter()
      .append('circle')
        .attr('r', 3)
        .attr('fill-opacity', .5)
        .attr('stroke', function (e) { return e.e ? '#000' : 'none'; })
        .attr('stroke-opacity', .75)
        .attr('cx', function (e) { return x(e.x); })
        .attr('cy', function (e) { return y(e.y); });
  }

  function pairValues(results, stats, states) {

    var values = [];

    results.forEach(function (result, i) {

      if (result && stats[i]) {

        values.push({
          x: result,
          y: stats[i],
          e: isEastGermany(states[i])
        });
      }
    });

    return values;
  }

  function isEastGermany(state) {

    var east = [
      'Brandenburg',
      'Mecklenburg-Vorpommern',
      'Sachsen',
      'Sachsen-Anhalt',
      'Thüringen'
    ];

    return east.indexOf(state) > -1;
  }

  function getColor(party) {

    party = party.replace(' (%)', '');

    var colors = {
      'AfD': '#129ee6',
      'Union': '#121212',
      'FDP': '#ffdd00',
      'SPD': '#d71f1d',
      'Grüne': '#0a8000',
      'Linke': '#be3075'
    };

    return colors[party];
  }
})();
