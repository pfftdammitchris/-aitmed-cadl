README  [English](#En)| [中文](#中文)
---
# En
# CADL class and utilities

This package contains the CADL class used to process CADL objects in addition to utility functions used to validate the CADL YAML files.

## To build the validation UI run the following:

```
//to install the dependencies
    npm i

//to build the bundle.js in the public directory
    npm run build
```

## To run the CADL validation UI locally run the following command

```
    npm run start:val_ui
```

then navigate to http://localhost:5000/

### Expect the following errors if a CADL Object is invalid

-InvalidDestination
-when page jump destination is not a valid page
-UnableToRetrieveYAML
-when something goes wrong in retrieving the yaml file form S3
-UnableToParseYAML
-if there is a parsing error

## To run the CADL test page UI locally run the following command

```
    npm run start:test
```

## To update the @aitmed/cadl package run

```
    npm run publish:public
```

# 中文
http://note.youdao.com/noteshare?id=b380665992fc6adbf8c467c92a3f10da&sub=56C107CEA22149F38DB5A36E619F71C9
密码：UP4M

## Methods That Can Be Accessed Through CADL/NOODL:

| Method                                                             | Returns                                             | Description                                                                         |
| ------------------------------------------------------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------------- |
| builtInFns.string                                              |                                                     |                                                                                     |
| `.generateAKey()`                                                  | `{sk:Uint8Array, pk:Uint8Array}`                    | Generates a keyPair for assymetric encryption/decryption                            |
| `.aKeyCheck(publicKey:Uint8Array,secretKey:Uint8Array)`            | `boolean`                                           | Checks if the keyPair is a valid one                                                |
| `.aKeyEncrypt(secretKey:Uint8Array, data:Uint8Array)`              | `Uint8Array`                                        | Assymetrically encrypts the given data using a secret key from a valid keyPair      |
| `.aKeyDecrypt: (publicKey: Uint8Array, encryptedData: Uint8Array)` | `Uint8Array`                                        | Decrypts the assymetrically encrypted data using the publicKey from a valid keyPair |
| `.generateSKey()`                                                  | `Uint8Array`                                        | Generates a secretKey for symetrical encryption/decryption                          |
| `.sKeyEncrypt(secretKey: Uint8Array, data: Uint8Array)`            | `Uint8Array`                                        | Symetrically encrypts data using a secretKey                                        |
| `.sKeyDecrypt(secretKey: Uint8Array, encryptedData: Uint8Array)`   | `Uint8Array`                                        | Decrypts the symetrically encrypted data using the secretKey it was encrypted with  |
| `.uint8ArrayToBase64(data: Uint8Array)`                            | `string`                                            | Encodes Uint8Array value to base64 string                                           |
| `.base64ToUint8Array(data: string)`                                | `Uint8Array`                                        | Decodes string value to Uint8Array                                                  |
| `.uTF8ToUint8Array(data: string)`                                  | `Uint8Array`                                        | Decodes string and returns Uint8Array                                               |
| `.uint8ArrayToUTF8(data: Uint8Array)`                              | `string`                                            | Encodes Uint8Array or Array of bytes into string                                    |                                                               |
| builtInFns.object                                              |                                                     |                                                                                     |
| `.remove({ object, key })`                                                  | `{sk:Uint8Array, pk:Uint8Array}`                    | Generates a keyPair for assymetric encryption/decryption                            |
| `.set({ object: any, key: any, value: any })` | `{sk:Uint8Array, pk:Uint8Array}` | Generates a keyPair for assymetric encryption/decryption |