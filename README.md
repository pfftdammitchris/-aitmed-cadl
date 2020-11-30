## README [English](#En)| [中文](#中文)

# En

# CADL class and utilities

This package contains the CADL class used to process CADL objects in addition to
utility functions used to validate the CADL YAML files.

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

-InvalidDestination -when page jump destination is not a valid page
-UnableToRetrieveYAML -when something goes wrong in retrieving the yaml file
form S3 -UnableToParseYAML -if there is a parsing error

## To run the CADL test page UI locally run the following command

```
    npm run start:test
```

## To update the @aitmed/cadl package run

```
    git checkout master
    git pull origin master
```

```
    npm run publish:public
```

# 中文

http://note.youdao.com/noteshare?id=b380665992fc6adbf8c467c92a3f10da&sub=56C107CEA22149F38DB5A36E619F71C9
密码：UP4M
