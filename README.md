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
| **builtInFns.string** | | |
| `.formatUnixtime_en(unixTime: number)` | `string` | Returns a date-time string associated with the given number. |
| `.formatUnixtimeLT_en(unixTime: number)` | `string` | Return a time string associated with the given number. |
| `.formatDurationInSecond(unixTime: number)` | `string` | Returns the amount of time that has elapsed since Dec 31, 1969, 4:00 PM as a string |
| `.concat(stringArr: string[])` | `string` | Concatenate an array of strings into one string, and returns the string |
| `.equal({ string1, string2 })` | `boolean` | Compare the two input strings and returns true if they are equal, otherwise returns false |
| **builtInFns.object** | | |
| `.remove({ object, key })` | `object` | Creates a deep clone of the object, and removes the value in the deep clone at location specified by key |
| `.set({ object: any, key: any, value: any })` | `object` | Creates a deep clone of the object, and updates the deep clone at location specified by key with value |
| **builtInFns.eccNaCl** | | |
| `.signature(message: string)` | `string` | Uses level2SDK.utilServices.signature to encrypt the input string and generate an encrypted signature |
| `.verifySignature(signature: string, pkSign: string)` | `boolean` | Uses level2SDK.utilServices.verifySignature to verify if the signature is valid |
| `.decryptAES({ key, message })` | `string` | ??? Decrypts message with the provided key through level2SDK.utilServices.sKeyDecrypt |
| `.skCheck({ pk, sk })` | `boolean` | Uses level2SDK.utilServices.aKeyCheck to check if the provided secret key is valid |
| `.generateESAK({ pk: string })` | `string` | Generates a symmetric key through level2SDK.utilServices.generateSKey and encrypts the key with level2SDK.utilServices.aKeyEncrypt |
| `.decryptESAK({ esak: Uint8Array \| string, publicKey: string, secretKey: string })` | `string` | Decrypt the encrypted session access key with public key and secret key |
| `.isEdgeEncrypted({ id: string })` | `boolean` | Checks if an edge is encrypted, i.e. it has a besak or eesak |
| `.getSAKFromEdge({ id: string })` | `string` | Retrieves the edge by id, decrypts its attached besak or eesak, and returns it if exists, otherwise returns an empty string  |
| `.encryptData({ esak: Uint8Array \| string, publicKey: string, data: Uint8Array })` | `Uint8Array` | Encrypts data with esak and returns encrypted data in Uint8Array format |
| `.decryptData({ esak: Uint8Array \| string, publicKey: string, secretKey: string, data: Uint8Array })` | `Uint8Array` | Decrypts the esak with provided public key and secret key |
| **builtInFns.ecos** | | |
| `.shareDoc({ sourceDoc, targetEdgeID })` | `object` | Share a document with a target edge by making a copy of the document as a Note object, then creating a new Document and pass in targetEdgeID as the document's edge_id |