var d3 = d3

var UpdateDom = function() {
  var self = {
     x: d3.scale.linear()
      .domain([0, 38]) // max value of data
      .range([0, 200]) // mapping to pixel sizes.
    , y: d3.scale.ordinal()
      .domain([10])
      .rangeBands([0, 24])
    , ramp: d3.scale.linear().domain([1,15,38]).range(['#D80000', '#CE5100', '#00D002'])
  }

  function fakeDynamicData() {
    var type = ['best', 'worst']
      , randomType = function() { return type[Math.floor(Math.random() * 2)] }
      , randomIndex = function() { return Math.floor(Math.random() * 4) }
      , randomValue = function() { return (Math.random() * 38).toFixed(2)}

    setInterval(function() {
      var data =
        { order: 20
        , id: '6151'
        , firstName: 'Sam'
        , lastName: 'Chatwin'
        , time: '' + randomValue()
      }
      $(document).trigger('update', [randomType(), randomIndex(), data])
    }, 2000);
  }

  function init() {
    // fakeDynamicData()
    $(document).bind('create', onCreate);
    $(document).bind('update', onUpdate);
  }

  function matched(item, previous) {
    if (item === previous) {
      return true
    }
    return false
  }

  function updateInfo(selector, data) {
    var imageSelector = selector.find('.js-avatar')
      , hoursSelector = selector.find('.js-hours')
      , initialsSelect = selector.find('.js-employee-initials')
      , name = data.firstName + ' ' + data.lastName
      , initials = data.firstName.charAt(0) + data.lastName.charAt(0)
      , time = +data.time

    // if (!imageSelector.attr('src')) {
    //   imageSelector.attr('src', 'http://img.clockte.ch/70x70.png')
    // }

    hoursSelector.text([time.toFixed(0) + ' HR'])
    initialsSelect.text(initials)

    if (!matched(imageSelector.attr('src'), data.image)) {
      imageSelector.fadeOut(function() {
        $(this).attr('src', data.image)
        $(this).attr('title', name)
      })

      if(data.image != null) {
        imageSelector.fadeIn()
      }
    }

  }

  function onUpdate(event, type, index, data) {
    var value = +data.time // cast time to a float
      , selector = $('.js-employee-list--' + type + ' .js-employee:eq(' + index + ')')
      , graph = selector.find('.js-graph')
      , chart = d3.select(graph.find('svg')[0])

    updateInfo(selector, data)

    chart.selectAll('rect')
      .data([value])
      .transition()
      .duration(1000)
      .attr('height', self.x)
      .style('fill', self.ramp(value))
  }

  function onCreate(event, type, index, data) {
    var value = +data.time // cast time to a float
      , selector = $('.js-employee-list--' + type + ' .js-employee:eq(' + index + ')')
      , graph = selector.find('.js-graph')

    updateInfo(selector, data)

    var chart = d3.select(graph[0]).append('svg')
      .attr('class', 'chart')
      .attr('width', 76)
      .attr('height', 500)

    chart.selectAll('rect')
      .data([value])
      .enter().append('rect')
      .attr('y', function(d, i) { return i * 20; })
      .attr('height', self.x)
      .attr('width', 76)
      .style('fill', self.ramp(value))
  }

  init()

  return self
}