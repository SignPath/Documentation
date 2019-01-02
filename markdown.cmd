@if "%1"=="/all" goto all
@if not "%~x1"==".md" goto wrongext
call markdown-it %1 -o %1.raw.html --typographer
cat %~p0head.html %1.raw.html %~p0foot.html >%1.html
del %1.raw.html
@goto end

rem  TODO: add to %appdata%\npm\node_modules\markdown-it\bin\markdown-it.js after md = require('..')({ ... });
rem  md.use(require('markdown-it-imsize'), { autofill: true });
rem  md.use(require("markdown-it-admonition"));
rem  md.use(require("markdown-it-toc-and-anchor").default, {tocFirstLevel: 2, tocLastLevel: 3, anchorLinkBefore: false});

:wrongext
@echo wrong extension "%~x1", must be ".md"
@exit /b 1

:all
@echo off
for %%d in (code-signing documentation features) do @for /r %%f in (%%d\*.md) do echo %%f && call markdown.cmd %%f

:end