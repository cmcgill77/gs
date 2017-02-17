Template.postsList.rendered = function () {

  $('.show-btn').on('click', function () {
  $('div.card-reveal[data-rel=' + $(this).data('rel') + ']').slideToggle('slow');
  });

  $('.card-reveal .close').on('click', function() {
  $('div.card-reveal[data-rel=' + $(this).data('rel') + ']').slideToggle('slow');
  });

  this.$('[data-toggle="tooltip"]').tooltip();
  this.$('[data-toggle="popover"]').popover();

}

Template.postsList.helpers({
  postsWithRank: function() {
    return this.posts.map(function(post, index, cursor) {
      post._rank = index;
      return post;
    });
  }
});
