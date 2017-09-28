(function () {

  'strict';

  (function init() {

    d3.queue()
      .defer(d3.csv, 'data/results.csv')
      .defer(d3.csv, 'data/demographics.csv')
      .await(function (error, results, demographics) {

        if (error) { throw error; }

        results.length = 10;
        demographics.length = 10;

        results = transform(results);
        demographics = transform(demographics);

        var correlations = correlate(results, demographics);

        // draw(data);
      });
  })();

  function transform(data) {

    var map = {};

    data.forEach(function (row) {

      data.columns.forEach(function (column) {

        var value = isNaN(row[column]) ? row[column] : parseFloat(row[column]);

        map[column] = map[column] || [];
        map[column].push(value);
      });
    });

    return map;
  }

  function correlate(results, demographics) {

    var correlations = [];

    Object.keys(results).forEach(function (res) {

      Object.keys(demographics).forEach(function (dem) {

        if (res !== 'id' && res !== 'name' && res !== 'state' &&
          dem !== 'id' && dem !== 'name' && dem !== 'state') {

          correlations.push({
            correlation: ss.sampleCorrelation(results[res],demographics[dem]),
            regression: ss.linearRegression(results[res],demographics[dem]),
            xName: dem,
            xValues: demographics[dem],
            xDomain: d3.extent(demographics[dem]),
            yName: res,
            yValues: results[res],
            yDomain: d3.extent(results[res])
          });
        }
      });
    });

    correlations.sort(function (a, b) {

      return d3.ascending(a.correlation, b.correlation);
    });

    return correlations;
  }
})();
