var d3 = d3

var UpdateDom = function() {

  var rangeHeight = $(window).innerHeight() * 0.47
    , self = {
     x: d3.scale.linear()
      .domain([0, 38]) // max value of data
      .range([0, rangeHeight]) // mapping to pixel sizes.
    , y: d3.scale.ordinal()
      .domain([10])
      .rangeBands([0, 24])
    , ramp: d3.scale.linear().domain([1,15,38]).range(['#D80000', '#CE5100', '#00D002'])
  }

  function init() {
    $(document).bind('create', onCreate);
    $(document).bind('update', onUpdate);
  }

  function matching(item, previous) {
    if (item === previous) {
      return true
    }
    return false
  }

  function updateInfo(selector, data) {
    var avatarSelector = selector.find('.js-avatar')
      , hoursSelector = selector.find('.js-hours')
      , initials = data.firstName.charAt(0) + data.lastName.charAt(0)

    hoursSelector.text([(+data.time).toFixed(0) + ' HR'])

    if (data.image === null) {
      avatarSelector
        .attr('data-initials', initials)
        .css('opacity', 1)
      return
    }

    function hide() {
      avatarSelector.css('opacity', 0)
    }

    function show(delay) {
      var img = $('<img>');
      img.one('load', function () {
        setTimeout(function () { // wait for fade
          avatarSelector
            .css('background-image', 'url(' + data.image + ')')
            .css('opacity', 1)
          img = null // prevent leak?
        }, delay || 500)
      })
      .attr('src', data.image)
    }

    if (!matching(avatarSelector.css('background-image'), 'url(' + data.image + ')')) {
      hide()
      if (matching(avatarSelector.css('background-image'), 'none')) {
        show(Math.ceil(Math.random() * 5) * 100) // randomised max 500ms delay
      } else {
        show()
      }
    }
  }

  function onUpdate(event, type, index, data, maxTimeFromHighestEmployee) {
    var value = (+data.time).toFixed(0) // cast time to a float
      , selector = $('.js-employee-list--' + type + ' .js-employee:eq(' + index + ')')
      , graph = selector.find('.js-graph')
      , chart = d3.select(graph.find('svg')[0])

    self.x.domain([0, maxTimeFromHighestEmployee])

    updateInfo(selector, data)

    setTimeout(function () {
      chart.selectAll('rect')
        .data([value])
        .transition()
        .duration(1000)
        .attr('height', self.x)
        .style('fill', self.ramp(value))
    }, 500)
  }

  function onCreate(event, type, index, data, maxTimeFromHighestEmployee) {
    var value = (+data.time).toFixed(0) // cast time to a float
      , selector = $('.js-employee-list--' + type + ' .js-employee:eq(' + index + ')')
      , graph = selector.find('.js-graph')

    self.x.domain([0, maxTimeFromHighestEmployee])

    updateInfo(selector, data)

    var chart = d3.select(graph[0]).append('svg')
      .attr('class', 'chart')
      .attr('width', '100%')
      .attr('height', rangeHeight)

    chart.selectAll('rect')
      .data([value])
      .enter().append('rect')
      .attr('y', function(d, i) { return i * 20; })
      .attr('width', '100%')
      .transition()
      .duration(1000)
      .attr('height', self.x)
      .style('fill', self.ramp(value))
  }

  init()

  return self
}
