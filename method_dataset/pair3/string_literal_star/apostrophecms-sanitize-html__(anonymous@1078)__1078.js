class __C__ {
  it('Should allow a specific style from global', function() {
    assert.equal(
      sanitizeHtml('<span style=\'color: yellow; text-align: center; font-family: helvetica\'></span>', {
        allowedTags: false,
        allowedAttributes: {
          span: [ 'style' ]
        },
        allowedStyles: {
          '*': {
            color: [ /yellow/ ],
            'text-align': [ /center/ ]
          },
          span: {
            color: [ /green/ ],
            'font-family': [ /helvetica/ ]
          }
        }
      }), '<span style="color:yellow;text-align:center;font-family:helvetica"></span>'
    );
  });

}
