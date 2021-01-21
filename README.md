# ababa

Dependencies
 - python
 - make
 - gcc/g++
 - npm

Dependencies except npm may not be needed, depending on how node-gyp decides to handle building `better-sqlite3` for your operating system.

```
> npm install
> npm install better-sqlite3 # this is already in package.json, but for some reason doesn't install with the previous command ¯\_(ツ)_/¯
```