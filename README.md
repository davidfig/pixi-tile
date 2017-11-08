# pixi-viewport
A simple scrolling multi-layer tile library for use with pixi.js and pixi-viewport.

## Simple Example
```js
    const PIXI = require('pixi.js')
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
```js
    /**
     * @param {PIXI.Container||PIXI.particles.ParticleContainer} container to hold the tiles
     * @param {Viewport} viewport from pixi-viewport
     * @param {number} width of tile
     * @param {number} height of tile
     * @param {function} tiles (x, y) should return { texture: PIXI.Texture, tint, flipX, flipY } where (x, y) is the coordinates in the tile map (i.e., the world coordinates divided by the tile's width/height)
     * @param {object} [options]
     * @param {boolean} [options.debug] add a debug panel to see sprite usage
     */
    constructor(container, viewport, tileWidth, tileHeight, tiles, options)
```
## license  
MIT License  
(c) 2017 [YOPEY YOPEY LLC](https://yopeyopey.com/) by [David Figatner](https://twitter.com/yopey_yopey/)
