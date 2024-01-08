# liblogx

![logo](/src/x.ico)

This is a full-stack blog website made mostly in 2020. It uses Vue, hapi.js, and MongoDB.

## Setup
1. Install Node 14, e.g. via [nvm](https://github.com/nvm-sh/nvm#install--update-script).
2. Install and start a [`MongoDB`](https://www.mongodb.com/docs/manual/administration/install-community/#std-label-install-mdb-community-edition) server.
3. Edit the .env file as needed.
4. In the project's root directory, run the shell command `npm run setup` using Node 14.
5. Run `npm start`.
6. Connect to `http://localhost:${port number in .env}/` in a browser.

## Features

- Upload images and write posts in markdown
![Writing a post](showcase/create.png)
![A post](showcase/post.png)

- Edit posts
![Editing a post](showcase/edit.png)

- Syntax highlighting via [highlight.js](https://highlightjs.org/)
![Highlighted code](showcase/highlight%20and%20image.png)

- Switch between rendered and raw markdown view
![Raw markdown](showcase/markdown.png)

- Control user registration by requiring special keys
![Generating a key](showcase/key%20menu.png)
![Registration](showcase/register.png)

- Change UI and separate posts based on whether the user is privileged
![Post from a guest](showcase/guest%20post.png)

## License
[0-BSD](LICENSE)