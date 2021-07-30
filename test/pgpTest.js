const openpgp = require('openpgp');
const fs = require('fs/promises');

(async () => {
    const publicKeyArmored = await fs.readFile('./test_public.asc',{encoding:'utf-8'});
    const privateKeyArmored = await fs.readFile('./test_SECRET.asc',{encoding:'utf-8'}); // encrypted private key

    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    const privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });

    const unsignedMessage = await openpgp.createCleartextMessage({ text: 'Hello, World11!' });
    const cleartextMessage = await openpgp.sign({
        message: unsignedMessage, // CleartextMessage or Message object
        signingKeys: privateKey
    });
    console.log(cleartextMessage); // '-----BEGIN PGP SIGNED MESSAGE ... END PGP SIGNATURE-----'

    const signedMessage = await openpgp.readCleartextMessage({
        cleartextMessage // parse armored message
    });
    const verificationResult = await openpgp.verify({
        message: signedMessage,
        verificationKeys: publicKey
    });
    const { verified, keyID ,signature} = verificationResult.signatures[0];
    try {
        await verified; // throws on invalid signature
        let signatureObj = await signature;
        let packets = signatureObj.packets[0];
        console.log('Signed by key id ' + keyID.toHex(),verificationResult.data);
    } catch (e) {
        throw new Error('Signature could not be verified: ' + e.message);
    }
})();

function Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while(i < len) {
        c = array[i++];
        switch(c >> 4)
        {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
            // 0xxxxxxx
            out += String.fromCharCode(c);
            break;
            case 12: case 13:
            // 110x xxxx   10xx xxxx
            char2 = array[i++];
            out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
            break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }

    return out;
}
