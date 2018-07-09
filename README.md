[![npm package](https://img.shields.io/npm/v/split-me.svg)](https://www.npmjs.com/package/split-me)
![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

# SplitMe - Universal Splitter

`SplitMe` is a universal splitter built with [Stencil](http://stenciljs.com). It can be embedded in projects using any framework or even plain HTML.

See a [Live Demo](https://alesgenova.github.io/split-me/).

## Basic Usage

Add the `SplitMe` script tag to your `index.html`:
```
<script src="https://unpkg.com/split-me/dist/split-me.js"></script>
```

Use the `split-me` tag anywhere you like. Set the number of slots in the splitter through the `n` attribute. Set the order the inner elements through the `slot` attribute:

```html
<split-me n="2">
  <div slot="0" class="fill" style="background-color: red;"></div>
  <div slot="1" class="fill" style="background-color: green;"></div>
</split-me>

<style>
  .fill {
    height: 100%;
    width: 100%;
  }
</style>
```

## Advanced Usage
### Attributes:
- `n : number` Set the number of slots in the splitter 
- `d : "horizontal" | "vertical"` Set the direction of the splitter
- `fixed : boolean` Prevent slots from being resized.
- `sizes : string` Set the initial size of the slots by using a comma separated array with percentages or fractions. For example: `sizes="0.33, 0.67"` or `sizes="50%, 25%, 25%"`


Splitters can be arbitrarily nested into each other to achieve any layout.

```html
<split-me n="3" sizes="0.3, 0.3, 0.4">
  <div slot="0" class="fill red"></div>
  <div slot="1" class="fill green"></div>
  <split-me slot="2" n="2" d="vertical" fixed>
      <div slot="0" class="fill blue"></div>
      <div slot="1" class="fill magenta"></div>
  </split-me>
</split-me>
```

## TODO

- ~~Prevent resizing~~
- ~~Specify initial sizes~~
- Specify minimum and maximum sizes
- Customizable splitter style
