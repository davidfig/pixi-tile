# pixi-viewport
A simple scrolling multi-layer tile library for use with pixi.js and pixi-viewport.

## Simple Example
```js
    const PIXI = require('pixi.js)
    const Viewport = require('pixi-viewport')
    const Tiles = require('pixi-tiles)

    // ...setup PIXI and a stage 

    const tileContainer = stage.addChild(new PIXI.Container())

    // create a viewport for the tiles
    const viewport = new Viewport(container, 
    {
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 1000,
        worldHeight: 1000
    })
    viewport
        .drag()
        .pinch()
        .decelerate()
        .start()

    // returns textures[] from a tiles map for the (x, y) location
    function getTextures(x, y)
    {
        return map(x, y)
    }

    const tiles = new Tiles(tilesContainer, viewport, 20, 20, getTextures)

    // add tiles to the update loop
    viewport.interval(tiles.update.bind(tiles))
```

## Live Example
https://davidfig.github.io/pixi-tiles/

## Installation

    npm i pixi-tiles

## API Reference
## license  
MIT License  
(c) 2017 [YOPEY YOPEY LLC](https://yopeyopey.com/) by [David Figatner](https://twitter.com/yopey_yopey/)
