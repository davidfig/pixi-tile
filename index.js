const PIXI = require('pixi.js')
const Counter = require('yy-counter')

const Factory = require('./factory')

module.exports = class Tiles
{
    /**
     * @param {PIXI.Container||PIXI.particles.ParticleContainer} container to hold the tiles
     * @param {Viewport} viewport from pixi-viewport
     * @param {number} width of tile
     * @param {number} height of tile
     * @param {function} tiles(x, y) should return PIXI.Texture[] where (x, y) is the coordinates in the tile map (i.e., the world coordinates divided by the tile's width/height)
     * @param {object} [options]
     * @param {boolean} [options.debug] add a debug panel to see sprite usage
     */
    constructor(container, viewport, tileWidth, tileHeight, tiles, options)
    {
        options = options || {}
        this.container = container
        this.viewport = viewport
        this.tileWidth = tileWidth
        this.tileHeight = tileHeight
        this.debug = options.debug
        this.last = {}
        this.tiles = tiles
        this.sprites = new Factory()
        this.containers = new Factory()
        this.cache = {}
        if (this.debug) this.counter = new Counter({ side: 'bottom-left', background: 'rgba(0,0,0,0.5)' })
    }

    resize()
    {
        this.last = {}
    }

    update()
    {
        let display = 0
        const container = this.viewport.container
        if (this.last.x !== container.x || this.last.y !== container.y || this.last.scaleX !== container.scale.x || this.last.scaleY !== container.scale.y)
        {
            if (this.last.scaleX !== container.scale.x || this.last.scaleY !== container.scale.y)
            {
                this.columns = Math.floor(this.viewport.worldScreenWidth / this.tileWidth) + 2
                this.rows = Math.floor(this.viewport.worldScreenHeight / this.tileHeight) + 2
            }
            this.container.removeChildren()
            this.containers.release()
            this.sprites.release()
            const left = this.viewport.left
            const top = this.viewport.top
            const xStart = left - left % this.tileWidth
            const yStart = top - top % this.tileHeight
            const xIndex = xStart / this.tileWidth
            const yIndex = yStart / this.tileHeight
            for (let y = 0; y < this.rows; y++)
            {
                for (let x = 0; x < this.columns; x++)
                {
                    const tiles = this.tiles(xIndex + x, yIndex + y)
                    if (tiles)
                    {
                        for (let texture of tiles)
                        {
                            const sprite = this.container.addChild(this.sprites.get(texture))
                            sprite.position.set(xStart + x * this.tileWidth, yStart + y * this.tileHeight)
                            display++
                        }
                    }
                }
            }
            this.last.x = container.x
            this.last.y = container.y
            this.last.scaleX = container.scale.x
            this.last.scaleY = container.scale.y
            if (this.debug)
            {
                this.counter.log(display + ' tiles with ' + this.sprites.length + ' empty' + ' using ' + this.container.children.length + ' sprites.' )
            }
        }
    }
}