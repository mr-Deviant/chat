Usefull information
===

### Yeoman

Install AngularJS generator (this will automatically install Yeoman, Grunt and Bower)
`npm install -g generator-angular`

Change directory to current project directory
`cd my-project-folder`
 
Scaffold out a AngularJS project
`yo angular`

create Angular controller/directive/filter/service
`yo angular:controller myController`
`yo angular:directive myDirective`
`yo angular:filter myFilter`
`yo angular:service myService`

### Bower

Search for a dependency in the Bower registry.
`bower search <dep>`

Install one or more dependencies
`bower install --save <dep>..<depN>`

List out the dependencies you have installed for a project
`bower list`

Update a dependency to the latest version available
`bower update <dep>`

### Grunt

Injects your Bower dependencies into your RequireJS configuration (if you're using RequireJS)
`grunt bower`

Injects your dependencies into your index.html file (if you're not using RequireJS)
`grunt bower-install`

Preview an app you have generated (with Livereload).
`grunt serve`

Run the unit tests for an app.
`grunt test`

Build an optimized, production-ready version of your app.
`grunt`

### GIT

https://www.atlassian.com/git/tutorial/git-basics
https://www.kernel.org/pub/software/scm/git/docs/

git init <directory> - transform directory into a Git repository

git clone <repo> <directory> - clone the repository located at <repo> into the folder called <directory> on the local machine


Чтобы вытащить копию репозитории нужно сделать так:
git clone http://.....

Потом можно чтото поменять и закомитить себе в свою локальную историю изминения:
git commit -am "Last changes"

После этого нужно запихнуть на эталонный сервер командой
git push

Чтобы стянуть чьи-то изменения
git pull

Чтобы посмотреть список измененных файлов
git status

Чтобы посмотреть что конкретно было изменено
git diff

Чтобы отревертить измененный файл
git checkout путь/к/файлу




Github README.md syntax https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet