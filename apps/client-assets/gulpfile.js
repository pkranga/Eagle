/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
"use strict";

const gulp = require("gulp");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const jsonminify = require('gulp-jsonminify');
const del = require("del");

const outputPath = "./dist/";

// uglify all javascript code
function uglifyScripts() {
    return gulp.src("./assets/**/*.js")
        .pipe(uglify())
        .pipe(gulp.dest(outputPath));
}

// minimize all jsons
function minimizeJSON() {
    return gulp.src(["./assets/**/*.json"])
        .pipe(jsonminify())
        .pipe(gulp.dest(outputPath));
}

// minimize all css
function minimizeCss() {
    return gulp.src("./assets/**/*.css")
        .pipe(cssnano())
        .pipe(gulp.dest(outputPath));
}

// minimize & optimize image formats: jpg, png, svg, gif
function minimizeImages() {
    return gulp.src("./assets/**/*.+(jpg|png|svg|gif)")
        .pipe(
            imagemin([
                imagemin.jpegtran({
                    progressive: true
                }),
                imagemin.gifsicle({
                    interlaced: true
                }),
                imagemin.optipng({
                    optimizationLevel: 5
                }),
                imagemin.svgo({
                    plugins: [{
                            removeViewBox: true
                        },
                        {
                            cleanupIDs: false
                        }
                    ]
                })
            ])
        )
        .pipe(gulp.dest(outputPath));
}

// transfer everything to destination
function transfer() {
    return gulp.src("./assets/**")
        .pipe(gulp.dest(outputPath));
}

// clean content inside dist folder
const clean = () => del(["dist/**"]);

// execute all tasks like transfer, minimizing images
const build = gulp.series(
    clean,
    transfer,
    uglifyScripts,
    minimizeJSON,
    minimizeCss,
    minimizeImages,
);

exports.default = build;