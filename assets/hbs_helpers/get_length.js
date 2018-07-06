enduro.templating_engine.registerHelper('get_length', function (obj) {
  const initialLength = obj.length - 1;
  return 12 / initialLength;
});   