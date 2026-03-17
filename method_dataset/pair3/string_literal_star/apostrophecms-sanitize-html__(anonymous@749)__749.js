function __method_wrapper__() {
  it('should allow transform on all tags using \'*\'', function () {
    assert.equal(
      sanitizeHtml(
        '<p>Text</p>',
        {
          allowedTags: [ 'p' ],
          allowedAttributes: { p: [ 'style' ] },
          transformTags: {
            '*': function (tagName, attribs) {
              return {
                tagName: tagName,
                attribs: {
                  style: 'text-align: center'
                }
              };
            }
          }
        }
      ),
      '<p style="text-align:center">Text</p>'
    );
  });

}
