const openpgp = require('openpgp');
const fs = require('fs/promises');
const request = require('request');
const { v4: uuidv4 } = require('uuid');

(async () => {
    const publicKeyArmored = await fs.readFile('./{{public_key}}.asc',{encoding:'utf-8'});
    const privateKeyArmored = await fs.readFile('./{{private_key}}.asc',{encoding:'utf-8'}); // encrypted private key

    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    const privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });
    let uuid = uuidv4();
    let player_uuid = uuidv4();
    let timestamp = Math.round(Date.now()/1000);
    const unsignedMessage = await openpgp.createCleartextMessage({ text: `
    uuid:`+uuid+`
    timestamp:`+timestamp+`
    player_uuid:`+player_uuid+`
    points:`+'0.5'+`
    comment: 
    ` });
    const cleartextMessage = await openpgp.sign({
        message: unsignedMessage, // CleartextMessage or Message object
        signingKeys: privateKey
    });
    //console.log(cleartextMessage); // '-----BEGIN PGP SIGNED MESSAGE ... END PGP SIGNATURE-----'
    request.put('http://127.0.0.1:3000/v1/submit/new',{
        form:{
            message:cleartextMessage
        }
    },function (err, httpResponse, body){
        console.log( body)
    })
    // const signedMessage = await openpgp.readCleartextMessage({
    //     cleartextMessage // parse armored message
    // });
    // let keyid = signedMessage.getSigningKeyIDs();
    //
    // console.log(keyid[0].toHex())
    //
    // const verificationResult = await openpgp.verify({
    //     message: signedMessage,
    //     verificationKeys: publicKey
    // });
    // const { verified, keyID ,signature} = verificationResult.signatures[0];
    // try {
    //     await verified; // throws on invalid signature
    //     let signatureObj = await signature;
    //     let packets = signatureObj.packets[0];
    //     console.log('Signed by key id ' + keyID.toHex(),verificationResult.data);
    // } catch (e) {
    //     throw new Error('Signature could not be verified: ' + e.message);
    // }
})();
