import { Index, MongoDBEngine } from 'meteor/easy:search'

// On Client and Server
SourcesIndex = new Index({
  collection: Sources,
  fields: ['author'],
  defaultSearchOptions: {
    sortBy: 'loc',
  },
  engine: new MongoDBEngine({
    sort: function (searchObject, options) {
      const sortBy = options.search.props.sortBy

      // return a mongo sort specifier
      if ('loc' === sortBy) {
        return {
          "levelOfConfidence.locValue": -1,
        }
      } else if ('newest' === sortBy) {
        return {
          lastPost: -1,
        }
      } else {
        throw new Meteor.Error('Invalid sort by prop passed')
      }
    },
  }),
})


// SourcesIndex = new EasySearch.Index({
//     collection: Sources,
//     fields: ['author'],
//     engine: new EasySearch.MongoDB(),
//   });
