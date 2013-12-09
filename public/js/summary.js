var LiveTimeTable = function(dataSource) {
  var self = {}
    , cache = {}

  function init() {
    cache.best = {}
    cache.worst = {}

    processUpdate()
    setInterval(function() {
      processUpdate()
    }, 6000)
  }

  function processUpdate() {
    self.getData(function(data) {
      checkIfUpdated(data.slice(0,4), cache, 'best')
      checkIfUpdated(data.slice(-4), cache, 'worst')
    })
  }

  function checkIfUpdated(data, comparison, type) {
    type = type || 'event'
    data.forEach(function(value, index) {
      if (typeof comparison[type][index] === 'undefined') {
        cache[type][index] = value
        console.log('create: ', type, index, value)
        $(document).trigger('create', [type, index, value])
      } else if (value.id !== comparison[type][index].id
        || value.time !== comparison[type][index].time
        || value.image !== comparison[type][index].image) {

        cache[type][index] = value
        console.log('update: ', type, index, value)
        $(document).trigger('update', [type, index, value])
      }
    })
  }


  self.getData = function(cb) {
    $.get(dataSource, function(data) {
      if (data && data.employees) {
        cb(data.employees)
      } else {
        return false
      }
    })
  }

  init()

  return self
}