class __C__ {
  it('text from transformTags should not specify tags', function() {
    const input = '<input value="&lt;script&gt;alert(1)&lt;/script&gt;">';
    const want = '<u class="inlined-input">&lt;script&gt;alert(1)&lt;/script&gt;</u>';
    // Runs the sanitizer with a policy that turns an attribute into
    // text.  A policy like this might be used to turn inputs into
    // inline elements that look like the original but which do not
    // affect form submissions.
    const got = sanitizeHtml(
      input,
      {
        allowedTags: [ 'u' ],
        allowedAttributes: { '*': [ 'class' ] },
        transformTags: {
          input: function (tagName, attribs) {
            return {
              tagName: 'u',
              attribs: { class: 'inlined-input' },
              text: attribs.value
            };
          }
        }
      });
    assert.equal(got, want);
  });

}
