//indexes for easy-search are defined here
//TODO create some search indexes / components for posts by source and feeds?

import { Index, MongoDBEngine } from 'meteor/easy:search'

// On Client and Server
SourcesIndex = new Index({
  collection: Sources,
  fields: ['author'],
  defaultSearchOptions: {
    sortBy: 'newest',
  },
  engine: new MongoDBEngine({
    selector: function (searchObject, options, aggregation) {
      // retrieve the default selector
      const selector = this.defaultConfiguration()
        .selector(searchObject, options, aggregation)

      // options.search.userId contains the userId of the logged in user
      selector.createdBy = options.search.userId

      return selector
    },
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

ListIndex = new Index({
  collection: Posts,
  fields: ['body'],
  defaultSearchOptions: {
    sortBy: 'newest',
    limit: 12
  },
  engine: new MongoDBEngine({
    selector: function (searchObject, options, aggregation) {
      // retrieve the default selector
      const selector = this.defaultConfiguration()
        .selector(searchObject, options, aggregation)

      // options.search.userId contains the userId of the logged in user
      selector.userId = options.search.userId

      return selector
    },
    sort: function (searchObject, options) {
      const sortBy = options.search.props.sortBy

      // return a mongo sort specifier
      if ('verificationScore' === sortBy) {
        return {
          verificationScore: -1,
        }
      } else if ('newest' === sortBy) {
        return {
          submitted: -1,
        }
      } else {
        throw new Meteor.Error('Invalid sort by prop passed')
      }
    },
  }),
})
