const { src, dest, series, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const htmlmin = require("gulp-htmlmin");
const autoprefixer = require("gulp-autoprefixer");
const cleanCss = require("gulp-clean-css");
const image = require("gulp-image");
const babel = require("gulp-babel");
const notify = require("gulp-notify");
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();

const clean = () => {
  return del(["dist"]);
};

const stylesScss = () => {
  return src("src/styles/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCss({ level: 2 }))
    .pipe(concat("style.css"))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/styles"))
    .pipe(browserSync.stream());
};

const htmlMinify = () => {
  return src("**/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
};

const stylesNorm = () => {
  return src("src/vendor/normalize.css")
    .pipe(concat("normalize.css"))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCss({ level: 2 }))
    .pipe(dest("dist/styles"))
    .pipe(browserSync.stream());
};

const favicon = () => {
  return src(
    ["src/image/favicon.ico", "src/image/favicon.png", "src/image/favicon.svg"],
    { allowEmpty: true },
  ).pipe(dest("dist/image"));
};

const scripts = () => {
  return src(["src/js/main.js"])
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(concat("app.js"))
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
};

const images = () => {
  return src(
    [
      "src/image/**/*.jpg",
      "src/image/**/*.png",
      "src/image/**/*.svg",
      "src/image/**/*.jpeg",
    ],
    { encoding: false },
  )
    .pipe(image())
    .pipe(dest("dist/image"));
};

const fonts = () => {
  return src("src/fonts/**/*.{woff,woff2}", { encoding: false }) // Берём оба формата
    .pipe(dest("dist/fonts"));
};

// Наблюдение за изменениями
const watchFiles = () => {
  browserSync.init({
    server: { baseDir: "dist" },
  });

  watch("src/**/*.html", htmlMinify);
  watch("src/styles/**/*.scss", stylesScss); // Теперь следит за SCSS
  watch("src/vendor/normalize.css", stylesNorm);
  watch("src/js/**/*.js", scripts);
  watch("src/image/favicon.*", favicon);
  watch("src/fonts/**/*.{woff,woff2}", fonts);
};

const build = series(
  clean,
  fonts,
  favicon,
  htmlMinify,
  stylesScss,
  scripts,
  stylesNorm,
  images,
);

exports.clean = clean;
exports.stylesScss = stylesScss;
exports.htmlMinify = htmlMinify;
exports.scripts = scripts;
exports.images = images;
exports.stylesNorm = stylesNorm;
exports.favicon = favicon;
exports.fonts = fonts;

exports.default = series(
  clean,
  fonts,
  favicon,
  htmlMinify,
  stylesScss,
  scripts,
  stylesNorm,
  images,
  watchFiles,
  build,
);
exports.build = build;
