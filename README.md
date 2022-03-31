<h1 align="center"> YASM Media!!🌟 (Beta) </h1> <br>
<p align="center">
    <img alt="YASM" title="YASM" src="https://firebasestorage.googleapis.com/v0/b/yasm-react.appspot.com/o/assets%2Fpng%2Fg1003.png?alt=media" width="250">
</p>

<p align="center">
  Coolest and hippest place to join! Built with React and NodeJS
</p>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
- [Features](#features)
- [Feedback](#feedback)
- [Contributors](#contributors)
- [Build Process](#build-process)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

A pretty fast and reliable social media app where you can meet new people, share memories or just go crazy and follow people lives as they happen!

**Available on all major browers and coming soon to Android and iOS**

<p align="center">
  <img src = "https://i.ibb.co/S63NztP/shotsnapp-1624101503-127.png" width=450>
</p>

## Features

A few of the things you can do on YASM:

* View user posts
* Like and comment on images you like
* Follow other people
* And more to be implemented.

## Feedback

Feel free to [file an issue](https://github.com/khatrivarun/yasm/issues/new/choose). Feature requests are always welcome. If you wish to contribute, please take a quick look at the [guidelines](./CONTRIBUTING.md)!

## Contributors

Please refer the [contribution guidelines](./CONTRIBUTING.md) for exact details on how to contribute to this project.

## Build Process

Here are the instructions on how to build and run this project on your respective systems.

- Clone the project on your system via GitHub.
- Make sure you have [docker](https://www.docker.com/products/docker-desktop) installed on your system since the whole build process depends on [docker](https://www.docker.com/products/docker-desktop) itself.
- Create a [firebase project](https://console.firebase.google.com/) and fetch the web keys and save it as `firebase.env`, format as specified by [this file](./firebase.example.env)
- Create an [algolia project](https://www.algolia.com/) and create a new file named `algolia.env` and fill in the API keys as specified by [this format](/algolia.example.env)
- Run `docker compose -f docker-compose.yml up --build` to build and run a development version of the application.
- Open up `localhost:3000` on browser to open up the website. If you want to communicate with the API, you can use the endpoint `localhost:5000` to access the same.
