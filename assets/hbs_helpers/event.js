var _ = require('lodash');
var Promise = require('bluebird');
var arraySort = require('array-sort');

enduro.templating_engine.registerHelper('event', function (options) {
  
  var event_entries
  
  return enduro.api.pagelist_generator.get_cms_list()
  .then((pagelist) => {
    
    var get_content_promises = []

    event_entries = _.chain(pagelist.structured.event)
    .filter((o) => { return typeof o === 'object' && o.hidden !== true }).value() // filter pages only
    
    for (page_id in event_entries) {
      var page = event_entries[page_id]
      
      function get_content (page) {
        get_content_promises.push(enduro.api.flat.load(page.fullpath).then((content) => { page.event_entry = content }))
      }
      
      get_content(page)
    }
    
    return Promise.all(get_content_promises)
  })
  .then(() => {
    const sorted = 'event_entry.$date_value';
    return options.fn(arraySort(event_entries, sorted));
  })
})