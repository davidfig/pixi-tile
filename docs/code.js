const PIXI = require('pixi.js')
const Renderer = require('yy-renderer')
const Viewport = require('pixi-viewport')

const TileMap = require('./tilemap')
const Tiles = require('..')

let _renderer, _viewport

const WIDTH = 5000
const HEIGHT = 5000

const TILE_SIZE = 50

function tiles()
{
    TileMap.create(WIDTH, HEIGHT, TILE_SIZE)
    const container = _renderer.addChild(new PIXI.Container())
    const tiles = new Tiles(container, _viewport, TILE_SIZE, TILE_SIZE, TileMap.get, { debug: true })

    _viewport.interval(
        function (elapsed)
        {
            tiles.update(elapsed)
            _renderer.update(elapsed)
        }
    )
}

function viewport()
{
    _viewport = new Viewport(_renderer.stage, { div: _renderer.div })
    _viewport
        .drag()
        .wheel()
        .pinch()
        .decelerate()
        .start()
    resize()
}

function resize()
{
    _renderer.resize()
    _viewport.resize(window.innerWidth, window.innerHeight, WIDTH, HEIGHT)
}

window.onload = function ()
{
    _renderer = new Renderer({ debug: 'fps', alwaysRender: true, fpsOptions: { side: 'bottom-left' } })
    viewport()
    tiles()
    window.addEventListener('resize', resize)

    require('./highlight')('https://github.com/davidfig/pixi-tiles')
}