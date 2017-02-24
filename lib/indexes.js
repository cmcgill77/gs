
SourcesIndex = new EasySearch.Index({
    collection: Sources,
    fields: ['author'],
    engine: new EasySearch.MongoDB(),
  });

  // Template.searchBox.helpers({
  //   sourcesIndex: () => SourcesIndex
  // });
