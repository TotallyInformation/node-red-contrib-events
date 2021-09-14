These folders contain the source for each node's Editor code (html file).

It splits the code into the 3 `script` sections in a node's html. The JavaScript, the Editor panel definition and the help panel definition.
The build process re-assembles this.

This makes it much easier to apply proper linting and type checking.

See the `gulpfile.js` file for the processes used to do the build. `gulp build` or `gulp watch` will do the work.