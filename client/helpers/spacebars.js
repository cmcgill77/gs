//global helpers can go hoverDetail
//TODO:80 create global helpers to assign correct color-coding to UI elements instead of having individual helpers each time they are needed

UI.registerHelper('pluralize', function(n, thing) {
  // fairly stupid pluralizer
  if (n === 1) {
    return '1 ' + thing;
  } else {
    return n + ' ' + thing + 's';
  }
});
