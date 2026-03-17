function __method_wrapper__() {
        new Promise(resolve => {
          const overWrites = {}
          let refNode
          if (
            !node.hasOwnProperty(`url`) &&
            node.hasOwnProperty(`identifier`)
          ) {
            // consider as imageReference node
            refNode = node
            node = definitions(refNode.identifier)
            // pass original alt from referencing node
            overWrites.alt = refNode.alt
            if (!node) {
              // no definition found for image reference,
              // so there's nothing for us to do.
              return resolve()
            }
          }
          const fileType = getImageInfo(node.url).ext

          // Only attempt to convert supported extensions
          if (isRelativeUrl(node.url) && supportedExtensions[fileType]) {
            return generateImagesAndUpdateNode(
              node,
              resolve,
              inLink,
              overWrites
            ).then(rawHTML => {
              if (rawHTML) {
                // Replace the image or ref node with an inline HTML node.
                if (refNode) {
                  node = refNode
                }
                node.type = `html`
                node.value = rawHTML
              }

              return resolve(node)
            })
          } else {
            // Image isn't relative so there's nothing for us to do.
            return resolve()
          }
        })

}
