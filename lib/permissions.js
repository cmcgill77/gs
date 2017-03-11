// check that the userId specified owns the documents
// probably redundant once search permissions are implemented but may come in handy so keeping for now
ownsDocument = function(userId, doc) {
  return doc && doc.userId === userId;
}
