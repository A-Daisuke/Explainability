function __method_wrapper__() {
    validateOpenID() {
      let isValid = true
      if (!this.newAuthSettings.authOpenIDIssuerURL) {
        this.$toast.error('Issuer URL required')
        isValid = false
      }
      if (!this.newAuthSettings.authOpenIDAuthorizationURL) {
        this.$toast.error('Authorize URL required')
        isValid = false
      }
      if (!this.newAuthSettings.authOpenIDTokenURL) {
        this.$toast.error('Token URL required')
        isValid = false
      }
      if (!this.newAuthSettings.authOpenIDUserInfoURL) {
        this.$toast.error('Userinfo URL required')
        isValid = false
      }
      if (!this.newAuthSettings.authOpenIDJwksURL) {
        this.$toast.error('JWKS URL required')
        isValid = false
      }
      if (!this.newAuthSettings.authOpenIDClientID) {
        this.$toast.error('Client ID required')
        isValid = false
      }
      if (!this.newAuthSettings.authOpenIDClientSecret) {
        this.$toast.error('Client Secret required')
        isValid = false
      }
      if (!this.newAuthSettings.authOpenIDTokenSigningAlgorithm) {
        this.$toast.error('Signing Algorithm required')
        isValid = false
      }

      function isValidRedirectURI(uri) {
        // Check for somestring://someother/string
        const pattern = new RegExp('^\\w+://[\\w\\.-]+(/[\\w\\./-]*)*$', 'i')
        return pattern.test(uri)
      }

      const uris = this.newAuthSettings.authOpenIDMobileRedirectURIs
      if (uris.includes('*') && uris.length > 1) {
        this.$toast.error('Mobile Redirect URIs: Asterisk (*) must be the only entry if used')
        isValid = false
      } else {
        uris.forEach((uri) => {
          if (uri !== '*' && !isValidRedirectURI(uri)) {
            this.$toast.error(`Mobile Redirect URIs: Invalid URI ${uri}`)
            isValid = false
          }
        })
      }

      function isValidClaim(claim) {
        if (claim === '') return true

        const pattern = new RegExp('^[a-zA-Z][a-zA-Z0-9_-]*$', 'i')
        return pattern.test(claim)
      }
      if (!isValidClaim(this.newAuthSettings.authOpenIDGroupClaim)) {
        this.$toast.error('Group Claim: Invalid claim name')
        isValid = false
      }
      if (!isValidClaim(this.newAuthSettings.authOpenIDAdvancedPermsClaim)) {
        this.$toast.error('Advanced Permission Claim: Invalid claim name')
        isValid = false
      }

      return isValid
    },

}
