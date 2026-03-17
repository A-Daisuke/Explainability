class __C__ {
  it('should sanitize styles correctly', function() {
    const sanitizeString = '<p dir="ltr"><strong>beste</strong><em>testestes</em><s>testestset</s><u>testestest</u></p><ul dir="ltr"> <li><u>test</u></li></ul><blockquote dir="ltr"> <ol> <li><u>test</u></li><li><u>test</u></li><li style="text-align: right"><u>test</u></li><li style="text-align: justify"><u>test</u></li></ol> <p><u><span style="color:#00FF00">test</span></u></p><p><span style="color:#00FF00"><span style="font-size:36px">TESTETESTESTES</span></span></p></blockquote>';
    const expected = '<p dir="ltr"><strong>beste</strong><em>testestes</em><s>testestset</s><u>testestest</u></p><ul dir="ltr"> <li><u>test</u></li></ul><blockquote dir="ltr"> <ol> <li><u>test</u></li><li><u>test</u></li><li style="text-align: right"><u>test</u></li><li style="text-align: justify"><u>test</u></li></ol> <p><u><span style="color:#00FF00">test</span></u></p><p><span style="color:#00FF00"><span style="font-size:36px">TESTETESTESTES</span></span></p></blockquote>';
    assert.equal(
      sanitizeHtml(sanitizeString, {
        allowedTags: false,
        allowedAttributes: {
          '*': [ 'dir' ],
          p: [ 'dir', 'style' ],
          li: [ 'style' ],
          span: [ 'style' ]
        },
        allowedStyles: {
          '*': {
            // Matches hex
            color: [ /#(0x)?[0-9a-f]+/i ],
            'text-align': [ /left/, /right/, /center/, /justify/, /initial/, /inherit/ ],
            'font-size': [ /36px/ ]
          }
        }
      }).replace(/ /g, ''), expected.replace(/ /g, '')
    );
  });

}
