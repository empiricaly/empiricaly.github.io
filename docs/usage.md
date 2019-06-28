---
id: usage
title: Usage
---

`create-empirica-app` requires Node.js >= 8. If you don't already have Node.js
8+ setup, we recommend you use the official installer:
https://nodejs.org/en/download/.

You will also need Meteor, for which you can follow the instructions at
https://www.meteor.com/install.

Then you can simply run the following command, where `my-experiment` is the name
of the experiment you wish to create:

```sh
npx create-empirica-app my-experiment
```

It will create a directory called `my-experiment` inside the current folder.<br>
Inside that directory, it will generate the initial project structure and
install the transitive dependencies:

```
my-experiment
├── .meteor
├── README.md
├── node_modules
├── package.json
├── package-lock.json
├── .gitignore
├── public
├── client
│   ├── main.html
│   ├── main.js
│   ├── main.css
│   ├── game
│   │   └── ...
│   ├── intro
│   │   └── ...
│   └── exit
│       └── ...
└── server
    ├── main.js
    ├── callbacks.js
    └── bots.js
```

No configuration or complicated folder structures, just the files you need to
build your app. Once the installation is done, you can open your project folder:

```sh
cd my-experiment
```

Inside the newly created project, you can run the standard `meteor` command to
start you app locally:

```sh
meteor
```

`meteor` runs the app in development mode.<br> Open
[http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make changes to the code.<br> You will
see the build errors in the console.

## Updating Empirica Core

As new versions of Empirica become available, you might want to update the
version you are using in your app. To do so, simply run:

```sh
meteor update empirica:core
```
