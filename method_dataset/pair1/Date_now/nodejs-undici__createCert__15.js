  const createCert = (cn, issuer, keyLength = 2048) => {
    const keys = forge.pki.rsa.generateKeyPair(keyLength)
    const cert = forge.pki.createCertificate()
    cert.publicKey = keys.publicKey
    cert.serialNumber = '' + Date.now()
    cert.validity.notBefore = new Date()
    cert.validity.notAfter = new Date()
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 10)

    const attrs = [{
      name: 'commonName',
      value: cn
    }]
    cert.setSubject(attrs)
    const isCa = issuer === undefined
    cert.setExtensions([{
      name: 'basicConstraints',
      cA: isCa
    }, {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    }, {
      name: 'extKeyUsage',
      serverAuth: true,
      clientAuth: true,
      codeSigning: true,
      emailProtection: true,
      timeStamping: true
    }, {
      name: 'nsCertType',
      client: true,
      server: true,
      email: true,
      objsign: true,
      sslCA: isCa,
      emailCA: isCa,
      objCA: isCa
    }])

    const alg = forge.md.sha256.create()
    if (issuer !== undefined) {
      cert.setIssuer(issuer.certificate.subject.attributes)
      cert.sign(issuer.privateKey, alg)
    } else {
      cert.setIssuer(attrs)
      cert.sign(keys.privateKey, alg)
    }
    return {
      privateKey: keys.privateKey,
      publicKey: keys.publicKey,
      certificate: cert
    }
  }
