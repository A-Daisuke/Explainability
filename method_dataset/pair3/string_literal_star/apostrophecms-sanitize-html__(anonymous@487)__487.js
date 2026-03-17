function __method_wrapper__() {
  it('should allow all classes that are allowlisted for a single tag or all tags', function() {
    assert.equal(
      sanitizeHtml(
        '<p class="nifty simple dippy">whee</p><div class="simple dippy nifty"></div>',
        {
          allowedTags: [ 'p', 'div' ],
          allowedClasses: {
            '*': [ 'simple' ],
            p: [ 'nifty' ],
            div: [ 'dippy' ]
          }
        }
      ),
      '<p class="nifty simple">whee</p><div class="simple dippy"></div>'
    );
  });

}
