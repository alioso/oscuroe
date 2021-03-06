var _ = require('lodash');
var Promise = require('bluebird');
var arraySort = require('array-sort');

enduro.templating_engine.registerHelper('performer', function (options) {
  
  var performer_entries
  
  return enduro.api.pagelist_generator.get_cms_list()
  .then((pagelist) => {
    
    var get_content_promises = []

    performer_entries = _.chain(pagelist.structured.performer)
    .filter((o) => { return typeof o === 'object' && o.hidden !== true }).value() // filter pages only
    
    for (page_id in performer_entries) {
      var page = performer_entries[page_id]
      
      function get_content (page) {
        get_content_promises.push(enduro.api.flat.load(page.fullpath).then((content) => { page.performer_entry = content }))
      }
      
      get_content(page)
    }
    
    return Promise.all(get_content_promises)
  })
  .then(() => {
    const sorted = 'performer_entry.weight';
    return options.fn(arraySort(performer_entries, sorted));
  })
})