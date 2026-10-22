const fs = require('fs');
const crypto = require('crypto');
try {
    const cert = fs.readFileSync('d:/gaming application/Lavachat/temp_cert_verify.bin');
    const shasum = crypto.createHash('sha1');
    shasum.update(cert);
    console.log(shasum.digest('base64'));
} catch (e) {
    console.error(e);
}
