</br>
<div align="center">
  <img src="https://raw.githubusercontent.com/cer10ty/hncode/master/public/images/HNCode.png" alt="HNCode Logo" height="250px" width="250px"></img>
</div>
</br>
<div align="center">
  <h1>HNCode</h1>
  <h2>Visual Studio Code Extension to browse Hacker News (code style)</h2>
</div>
</br>

## Features

* Browse the front page of Hacker News (top stories).
* Browse any self post.
* Go to any external links from the extension window.
* View the comments for a post.

## Requirements

This extension requires Visual Studio Code 1.38.0 or later to work properly.

## Extension Settings

This extension contributes the following settings:

* `hncode.title`: Set the title of Hacker News window.
* `hncode.requestTimeout`: Set the timeout for requests in milliseconds (ms).
* `hncode.limitation`: Set the amount of items to be loaded on the front page.

## Known Issues

* Child comments are not being displayed yet.
* Formatting may be messed up in certain comment sections.

## Release Notes

### 0.0.5

*   NEW: Display parent comments when clicking on "x comments", like in HN.
*   NEW: Display self posts when clicking on the link.
*   NEW: URL information to the right of every post (except self), like in HN.
*   FIXED: Undefined comments should no longer be shown in any view.

### 0.0.1

Pre-alpha Release
