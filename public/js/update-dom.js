var d3 = d3

var UpdateDom = function() {
  var self = {
     x: d3.scale.linear()
      .domain([0, 150]) // max value of data
      .range([0, 200]) // mapping to pixel sizes.
    , y: d3.scale.ordinal()
      .domain([10])
      .rangeBands([0, 24])
    , ramp: d3.scale.linear().domain([1,100,200]).range(['#D80000', '#CE5100', '#00D002'])
  }

  function fakeDynamicData() {
    var type = ['best', 'worst']
      , randomType = function() { return type[Math.floor(Math.random() * 2)] }
      , randomIndex = function() { return Math.floor(Math.random() * 4) }
      , randomValue = function() { return (Math.random() * 150).toFixed(2)}

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
    var imageSelector = selector.find('.avatar')
      , nameSelector = selector.find('.name')
      , name = data.firstName + ' ' + data.lastName


    if (!matched(nameSelector.text(), name)) {
      nameSelector.fadeOut(function() {
        $(this).text(name)
      }).fadeIn()
    }

    if (!imageSelector.attr('src')) {
      imageSelector.attr('src', 'http://img.clockte.ch/70x70.png')
    }

    if (!matched(imageSelector.attr('src'), data.image)) {
      imageSelector.fadeOut(function() {
        $(this).attr('src', data.image)
      }).fadeIn()
    }

  }

  function onUpdate(event, type, index, data) {
    var value = +data.time // cast time to a float
      , selector = $('.' + type + ' .employee:eq(' + index + ')')
      , chart = d3.select(selector.find('svg')[0])

    updateInfo(selector, data)

    chart.selectAll('rect')
      .data([value])
      .transition()
      .duration(1000)
      .attr('width', self.x)
      .style('fill', self.ramp(value))

    chart.selectAll('text')
      .data([value.toFixed(2) + ' hours logged'])
      .transition()
      .duration(1000)
      .attr('x', 0)
      .attr('y', function(d) { return self.y(d) + self.y.rangeBand() / 2; })
      .attr('dx', 5 ) // padding-right
      .attr('dy', '.35em') // vertical-align: middle
      .attr('text-anchor', 'start') // text-align: right
      .style('fill', '#FCFCFC')
      .text(String)

  }

  function onCreate(event, type, index, data) {
    var value = +data.time // cast time to a float
      , selector = $('.' + type + ' .employee:eq(' + index + ')')

    updateInfo(selector, data)

    var chart = d3.select(selector[0]).append('p').append('svg')
      .attr('class', 'chart')
      .attr('width', 200)
      .attr('height', 20)

    chart.selectAll('rect')
      .data([value])
      .enter().append('rect')
      .attr('y', function(d, i) { return i * 20; })
      .attr('width', self.x)
      .attr('height', 20)
      .style('fill', self.ramp(value))

    // Adding text to graphs

    chart.selectAll('rect')
      .data([value])
      .enter().append('rect')
      .attr('y', self.y)
      .attr('width', self.x)
      .attr('height', self.y.rangeBand())

    chart.selectAll('text')
      .data([value.toFixed(2) + ' hours logged'])
      .enter().append('text')
      .attr('x', 0)
      .attr('y', function(d) { return self.y(d) + self.y.rangeBand() / 2; })
      .attr('dx', 5 ) // padding-right
      .attr('dy', '.35em') // vertical-align: middle
      .attr('text-anchor', 'start') // text-align: right
      .style('fill', '#FCFCFC')
      .text(String)
  }

  init()

  return self
}