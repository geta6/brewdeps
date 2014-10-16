# brewdeps

![](https://travis-ci.org/geta6/brewdeps.png?branch=master)

homebrew dependency checker.


## install

```
npm -g i brewdeps
```


## example

```
$ brewdeps

:

sqlite
------
packages require sqlite:
python

sqlite requires:
readline

:

$ brewdeps xz

xz
-----
packages require xz:
cairo, coreutils, gettext, glib, imagemagick, libpng, the_silver_searcher

```
