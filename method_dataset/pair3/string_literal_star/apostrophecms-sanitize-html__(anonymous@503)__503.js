function __method_wrapper__() {
  it('should allow classes that match wildcards for a single tag or all tags', function() {
    assert.equal(
      sanitizeHtml(
        '<p class="nifty- nifty-a simple dippy dippy-a-simple">whee</p>',
        {
          allowedTags: [ 'p' ],
          allowedClasses: {
            '*': [ 'dippy-*-simple' ],
            p: [ 'nifty-*' ]
          }
        }
      ),
      '<p class="nifty- nifty-a dippy-a-simple">whee</p>'
    );
  });

}
