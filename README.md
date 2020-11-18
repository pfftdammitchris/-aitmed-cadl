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
| `signature(message: string)` | `a` | Sth |
| `verifySignature(signature: string, pkSign: string)` | `boolean` | Sth |