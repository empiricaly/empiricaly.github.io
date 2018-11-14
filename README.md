This repository contains the website and documentation for
[Empirica](https://github.com/empiricaly/meteor-empirica-core). It is hosted at
https://empirica.ly. The website source is on the `gh-pages` branch, and the
generated/deployed website is on master (because that's what Github Pages wants
to host the website).

We are very thankful for contributions to our documentation, even if just fixing
typos. We do require that you follow the _standard_ Github process with fork +
pull request. If you are not familiar with it, check out
[this short guide](https://gist.github.com/Chaser324/ce0505fbed06b947d962).

# What's In This Document

- [Getting Started](#getting-started)
- [Directory Structure](#directory-structure)
- [Editing Content](#editing-content)
- [Adding Content](#adding-content)
- [Full Documentation](#full-documentation)

# Getting Started

When you make changes locally, you will want to test them before pushing them
with a pull request. In this section, we will install the necessary components
to run a local version of the website.

You’ll need to have Node.js >= 8 on your local development machine. If you don't
already have Node.js 8+ setup, we recommend you use the official installer:
https://nodejs.org/en/download/.

1. Make sure all the dependencies for the website are installed:

```sh
# The code building the website is all in the website dir
$ cd website
# Install dependencies
$ npm install
```

2. Run your dev server:

```sh
# Start the site
$ npm run start
```

This should open a new browser window with the app, you're ready to edit.

## Directory Structure

The file structure should look something like this

```
empiricaly.github.io/
  docs/
    api.md
    usage.md
    ...
  website/
    blog/
      2018-12-11-something-something.md
      2020-10-24-the-future.md
    core/
    node_modules/
    pages/
    static/
      css/
      img/
    package.json
    sidebar.json
    siteConfig.js
```

# Editing Content

## Editing an existing docs page

Edit docs by navigating to `docs/` and editing the corresponding document:

`docs/doc-to-be-edited.md`

```markdown
---
id: page-needs-edit
title: This Doc Needs To Be Edited
---

Edit me...
```

For more information about docs, click [here](https://docusaurus.io/docs/en/navigation)

## Editing an existing blog post

Edit blog posts by navigating to `website/blog` and editing the corresponding post:

`website/blog/post-to-be-edited.md`

```markdown
---
id: post-needs-edit
title: This Blog Post Needs To Be Edited
---

Edit me...
```

For more information about blog posts, click [here](https://docusaurus.io/docs/en/adding-blog)

# Adding Content

## Adding a new docs page to an existing sidebar

1. Create the doc as a new markdown file in `/docs`, example `docs/newly-created-doc.md`:

```md
---
id: newly-created-doc
title: This Doc Needs To Be Edited
---

My new content here..
```

2. Refer to that doc's ID in an existing sidebar in `website/sidebar.json`:

```javascript
// Add newly-created-doc to the Getting Started category of docs
{
  "docs": {
    "Getting Started": [
      "quick-start",
      "newly-created-doc" // new doc here
    ],
    ...
  },
  ...
}
```

For more information about adding new docs, click [here](https://docusaurus.io/docs/en/navigation)

## Adding a new blog post

Create the blog post with the format `YYYY-MM-DD-My-Blog-Post-Title.md` in `website/blog`:

`website/blog/2018-05-21-New-Blog-Post.md`

```markdown
---
author: Frank Li
authorURL: https://twitter.com/foobarbaz
authorFBID: 503283835
title: New Blog Post
---

Lorem Ipsum...
```

For more information about blog posts, click [here](https://docusaurus.io/docs/en/adding-blog)

# Full Documentation

This website was created with [Docusaurus](https://docusaurus.io/).
Full documentation can be found on the [website](https://docusaurus.io/).
