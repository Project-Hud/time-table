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
    var $formattedDate = $('.js-time-table-formatted-date')

    self.getData(function(data) {
      var maxTimeFromHighestEmployee = data.employees[0].time > 38 ? (+data.employees[0].time).toFixed(0) : 38
      $formattedDate.text(data.formattedDate)

      checkIfUpdated(data.employees.slice(0,4), cache, 'best', maxTimeFromHighestEmployee)
      checkIfUpdated(data.employees.slice(-4), cache, 'worst', maxTimeFromHighestEmployee)
    })
  }

  function checkIfUpdated(data, comparison, type, maxTimeFromHighestEmployee) {
    type = type || 'event'
    data.forEach(function(value, index) {
      if (typeof comparison[type][index] === 'undefined') {
        cache[type][index] = value
        //console.log('create: ', type, index, value)
        $(document).trigger('create', [type, index, value, maxTimeFromHighestEmployee])
      } else if (value.id !== comparison[type][index].id
        || value.time !== comparison[type][index].time
        || value.image !== comparison[type][index].image) {

        cache[type][index] = value
        //console.log('update: ', type, index, value)
        $(document).trigger('update', [type, index, value, maxTimeFromHighestEmployee])
      }
    })
  }


  self.getData = function(cb) {
    $.get(dataSource, function(data) {
      if (data && data.employees) {
        cb(data)
      } else {
        return false
      }
    })
  }

  init()

  return self
}