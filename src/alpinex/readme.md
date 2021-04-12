# AplineX

Its just a kind of a custom made microframework using which you can write native dom elements using jsx syntax.
The origins of the framework lies in the codebase of [mkdocs-material](https://github.com/squidfunk/mkdocs-material/blob/master/src/assets/javascripts/utilities/h/index.ts) by @squidfunk.

## History
Here is a bit of its history of this framework.
Initially, I liked the idea of using jsx syntax for native dom elements. So, I just copied [this file](https://github.com/squidfunk/mkdocs-material/blob/master/src/assets/javascripts/utilities/h/index.ts) from mkdocs-material and started using this. 

Then, I came to realize that this doesn't work with svg elements to I modified to file to support for svg elements.

Then, I liked the alpine transitions so I added x-transition and x-show directives from alpine and after adding that
I thought It would be great if you can just add x-on event binding syntax too. 

So this is how this kind of microframework was born.
