import {default as pointInsidePolygon} from 'point-in-polygon';

var w = 1600;
var h = 600;

var TIME_UNIT = 1000

var body = d3.select("body");

var timeDisplay = body.append("div");
timeDisplay
    .attr("class", "timeDisplay");

var svg = d3.select("body").append("svg");
svg
    .attr("width", w)
    .attr("height", h);

var projection = d3.geo.albersUsa()
    .translate([1000, h/2])
    .scale([2500]);

var EarthquakeRenderer = {

    run: function() {
        this.init();
        d3.json(
            "data/california.json",
            this.handleGeoJSONLoaded.bind(this)
        );
    },

    handleGeoJSONLoaded: function(json) {
        this._geoJSON = json;
        this.render();
    },

    init: function() {
    },

    render: function() {
        var path = d3.geo.path()
            .projection(projection);
        svg.selectAll("path")
            .data(this._geoJSON.features)
            .enter()
            .append("path")
            .attr("d", path);

        d3.csv(
            "data/california_earthquakes.csv",
            this.handleEarthquakeLoader.bind(this)
        );
    },

    handleEarthquakeLoader: function(input_data) {
        var data = this.filterEarthquakesByMagnitude(input_data, 2);
        data = this.filterEarthquakesInsideCalifornia(data);
        this.processData(data);
        this.updateTimeRange();
    },

    update: function(data) {
        var updateSelection = svg.selectAll("circle")
            .data(data, row => row.time);
        console.log('updating....');

        // Add new elements
        updateSelection
            .enter()
            .append("circle")
            .transition()
            .duration(TIME_UNIT)
            .ease("circle")
            // Note: we can't use arrow functions here because `this` will be bound
            // to the current context, d3 tries to override it, but it won't
            // have any effect
            .each("start", function() {
                d3.select(this)
                    .attr("r", 0)
                    .style("opacity", 0.25);
            })
            .attr("cx", d => projection([d.lon, d.lat])[0])
            .attr("cy", d => projection([d.lon, d.lat])[1])
            .attr("r",  d => {
                var intensity = Math.pow(10, d.intensity);
                return Math.sqrt(intensity * 0.0004);
            })
            .style("fill", "red")
            .style("stroke", "red")
            .style("opacity", 0.50);

        updateSelection
            .exit()
            .transition()
            .duration(TIME_UNIT)
            .ease("circle")
            .attr("r", 0);

        var dateStr = this.formatTimestamp(this._currentStart);
        timeDisplay.text(() => dateStr);
    },

    updateTimeRange: function() {
        var currentEnd = this._currentStart + this.getStepSize();
        var newData = this.filterEarthquakesByPeriod(
            this._data,
            this._currentStart,
            currentEnd
        );
        this._currentStart = currentEnd;
        this.update(newData);
        if (this._currentStart < this._endTime) {
            window.setTimeout(this.updateTimeRange.bind(this), TIME_UNIT);
        }
    },

    processData: function(data) {
        this._data = [];
        this._startTime = Math.pow(2, 53) - 1;
        this._endTime = 0;
        data.forEach(
            row => {
                var time = new Date(row.date).getTime();
                this._data.push({
                    time: time,
                    lat: row.lat,
                    lon: row.lon,
                    intensity: row.intensity
                });
                this._startTime = Math.min(this._startTime, time);
                this._endTime = Math.max(this._endTime, time);
            },
            this
        );
        this._currentStart = this._startTime;
    },

    getStepSize: function() {
        return (this._endTime - this._startTime)/50;
    },

    filterEarthquakesByPeriod: function(data, startTime, endTime) {
        return data.filter(
            row => row.time >= startTime && row.time < endTime
        );
    },

    filterEarthquakesByMagnitude: function(data, magnitude) {
        return data.filter(row => row.intensity > magnitude);
    },

    filterEarthquakesInsideCalifornia: function(data) {
        var polygon = this.getPolygonFromGeoJSON();
        var pointsInsideCalifornia = data.filter(row => {
            var point = projection([row.lon, row.lat]);
            return pointInsidePolygon(point, polygon);
        });
        return pointsInsideCalifornia;
    },

    getPolygonFromGeoJSON: function() {
        var coordinates = this._geoJSON.features[0].geometry.coordinates[0];
        var polygon = coordinates.map((data) => projection(data));
        return polygon;
    },

    formatTimestamp: function(timestamp) {
        var date = new Date(timestamp);
        var yyyy = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();
        var dateStr = yyyy + '/' + mm + '/' + dd;
        return dateStr;
    }
};

EarthquakeRenderer.run();
