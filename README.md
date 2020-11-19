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

# MAIN CADL/NOODL Documentation

### CADL - Lvl 2.5 SDK. 
This layer is connected to Lvl 2 SDK and noodl-ui-dom. The primary function of CADL is to parse and translate a noodl yaml file. CADL can resolve references in noodl file by replacing short-handed variables (marked by ., .., etc.) with ful variables. It will then go through noodl file, parse it, and replace any functions with Lvl 2 API commands as appropriate.

CADL is created in the frontend web layer. On creation, its constructor will be provided with aspectRation, cadlVersion, and configUrl as parameters. CADL will have access to a store, which is created using provided parameters of env and configUrl. This store will have access to Lvl 2 SDK, and implements Lvl 2 SDK's setters and getters. Inside of CADL constructor, several properties of store will be redirected, and store's noodlInstance will refer to the CADL.

An integral part of CADL is the root. When CADL is created, initRoot() function is called, and two things are attached to the empty root: an empty actions {} object, and an array of builtIn functions, which include things like createNewAccount, signIn, uploadDocument, etc. This process is completed within the CADL layer. 

Implementation of CADL relies on a few important functions, which are supported by an array of helper functions. The important ones are:

#### CADL.init() 
This function is called to initialize the CADL. This function can take three parameters (BaseDataModel, BaseCSS, and BasePage), but generally none are provided. A config variable is declared and assigned the variable retrieved from Lvl 2 SDK using loadConfig(), and config is destructured and assigned to the proper variables in CADL. From config, cadlBaseUrl is retrieved, and is used to locate cadlEndpointUrl. Using the cadlEndpointUrl we get cadlEndpoint, which contains baseUrl, assetsUrl, and preload. These are vital assets for parsing the noodl file.

The variable preload can be destructured to receive BasePage, BaseCSS, and BaseDataModel. These are the base elements in a noodl file; there are separate 'pages' in noodl that needs processing as well, such as SignIn, SignUp, and DocumentDetails, but these are the big three ones. For each of these pages, they are first retrieved using this.getPage() method, then processed down using this.processPopulate() method, and finally set into state using this.newDispatch() method. The key here is the processPopulate() method, which translates variables that start with ['.', '..', '=', '~'] into their fully expanded values using a recurssive algorithm. Once this process completes, these fully parsed objects/functions/variables are updated into root through state control dispatches.

After the above steps are completed, init() function checks for any items stored in local storage 'Global', and repeats the above parsing process. This process is not detected when the web first renders.

#### CADL.initPage()
This is another important method of CADL. Once the app starts, each page in noodl will need to be rendered separately, and that is the primary function of initPage(). This function is called in frontend code in src/index.js, and by createPreparePage() function. This function takes three parameters: pageName, an empty array denoted skip, and options. pageName variable is self-explanatory; I'm not sure what purpose skip[] does; the most notable thing about options is that once destructured, it contains a variable called evolve, and that must be true in order for the page to be rendered, otherwise the page will return. The evolve variable is invoked in frontend code, builtIn functions goto and goBack. 

After the processing and evaluating are finished, initPage() then proceeds to process noodl page in a fashion similar to init(), using processPopulate(), but also dispatch method. 

#### CADL.processPopulate()
This function is the primary function that handles the resolution of noodl files by processing references of variables in noodl files and replacing them with their fully extended form. This is specifically being done with the populateKeys() method, which recursively goes through the noodl file, find any symbols that signifies a referencing variable, and replace that variable with its fully extended form.

The function takes in five parameters: source, lookFor, skip, pageName, withFns. 
-source: the source page of noodl, written in yml format
-lookFor: an array of symbols to look out for, these symbols denote variables at current directory, parent directory, etc. that must be identified and have related variables resolved
-skip: items to skip while parsing through yml file
-withFns: a boolean true or false
-pageName: name of the noodl page

## Methods That Can Be Accessed Through CADL/NOODL:

### These functions can be accessed through builtInFns, which are attached to root as root.builtIn

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
| `.has({ object: any, key: any })` | `boolean` | Checks if input object contains a value at specified key |
| **builtInFns.eccNaCl** | | |
| `.signature(message: string)` | `string` | Uses level2SDK.utilServices.signature to encrypt the input string and generate an encrypted signature |
| `.verifySignature(signature: string, pkSign: string)` | `boolean` | Uses level2SDK.utilServices.verifySignature to verify if the signature is valid |
| `.decryptAES({ key, message })` | `string` | ??? Decrypts message with the provided key through level2SDK.utilServices.sKeyDecrypt |
| `.skCheck({ pk, sk })` | `boolean` | Uses level2SDK.utilServices.aKeyCheck to check if the provided secret key is valid |
| `.generateESAK({ pk: string })` | `string` | Generates a symmetric key through level2SDK.utilServices.generateSKey and encrypts the key with level2SDK.utilServices.aKeyEncrypt |
| `.decryptESAK({ esak: Uint8Array \| string, publicKey: string, secretKey: string })` | `string` | Decrypt the encrypted session access key with public key and secret key |
| `.isEdgeEncrypted({ id: string })` | `boolean` | Asynchronous function. Checks if an edge is encrypted, i.e. it has a besak or eesak |
| `.getSAKFromEdge({ id: string })` | `string` | Asynchronous function. Retrieves the edge by id, decrypts its attached besak or eesak, and returns it if exists, otherwise returns an empty string  |
| `.encryptData({ esak: Uint8Array \| string, publicKey: string, data: Uint8Array })` | `Uint8Array` | Encrypts data with esak and returns encrypted data in Uint8Array format |
| `.decryptData({ esak: Uint8Array \| string, publicKey: string, secretKey: string, data: Uint8Array })` | `Uint8Array` | Decrypts the esak with provided public key and secret key |
| **builtInFns.ecos** | | |
| `.shareDoc({ sourceDoc, targetEdgeID })` | `object` | Share a document with a target edge by making a copy of the document as a Note object, then creating a new Document and pass in targetEdgeID as the document's edge_id |
| **Access directly from builtInFns** | | |
| `.createNewAccount({ name })` | `object` | Asynchronous function. Name is destructured to include phoneNumber, password, and userName. These credentials will be verified, and the function then calls Account.create. Account.create data will be returned. |
| `.signIn({ phoneNumber, password, verificationCode })` | `object` | Asynchronous function. Calls Account.login to complete login procedure. Account.login's returned data will be returned. |
| `.loginByPassword(password)` | `None` | Asynchronous function. Calls Account.loginByPassword |
| `.storeCredentials({ pk, sk, esk, userId })` | `None` | Stores provided credentials in local storage |
| `.SignInOk()` | `boolean` | Calls Account.getStatus |
| `.uploadDocument({ title, tags = [], content, type, dataType = 0 })` | `<Record<string, any>>` | Calls Document.create and returns the response |


### These are services functions that can be accessed through main CADL/NOODL

| **Account** | | |
| `.requestVerificationCode()` | `string` | Returns a date-time string associated with the given number. |

requestVerificationCode():
	-Input: phone_number
	-Output: Promise
	-Checks for store.noodlInstance, which is CADL
	-If true, then check if timer reaches 60 seconds
	-Must wait for 60 seconds to make another request for same number
	-If all goes well, will call store.level2SDK.Account.requestVerificationCode
	-Returns a response

create():
	-Input:	phone_number, password, verification_code, userName
	-Output: userVertex
	-Calls store.level2SDK.Account.createUser to create a new account
	-Saves the returned data as userVertex and returns it

login():
	-Input: phone_number, password, verification_code
	-Output: userVertex, or just user
	-Login is a two step process
	-First logs in using phone number and verification code, loginByVerificationCode()
	-If returned response is valid, then logs in by password, loginByPassword()

loginByPassword():
	-Calls store.level2SDK.Account.login()
	-Use store.level2SDK.Account.getStatus() to fetch user_id, and retrieve userVertex
	-Return userVertex to fetch user_vertex, and return it as user

loginByVerificationCode():
	-Calls store.level2SDK.Account.loginNewDevice()

Other functions:
logout(), updatePassword(), updatePasswordByVerificationCode(), updateProfile(), retrieve(), remove(), getStatus(), verifyUserPassword()

==>Document 


