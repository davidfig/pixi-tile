const Counter = require('yy-counter')
const exists = require('exists')

const Factory = require('./factory')

module.exports = class Tiles
{
    /**
     * @param {[PIXI.Container]|PIXI.Container[]} container to hold the tiles
     * @param {Viewport} viewport from pixi-viewport
     * @param {number} width of tile
     * @param {number} height of tile
     * @param {function|function[]} tiles (x, y) should return { texture: PIXI.Texture, tint, flipX, flipY } where (x, y) is the coordinates in the tile map (i.e., the world coordinates divided by the tile's width/height)
     * @param {object} [options]
     * @param {boolean} [options.debug] add a debug panel to see sprite usage
     */
    constructor(container, viewport, tileWidth, tileHeight, tiles, options)
    {
        options = options || {}
        if (Array.isArray(container))
        {
            this.containers = container
            this.tiles = tiles
        }
        else
        {
            this.containers = [container]
            this.tiles = [tiles]
        }
        this.viewport = viewport
        this.tileWidth = tileWidth
        this.tileHeight = tileHeight
        this.debug = options.debug
        this.last = {}
        this.sprites = new Factory()
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
                this.columns = Math.floor(this.viewport.worldScreenWidth / this.tileWidth) + 4
                this.rows = Math.floor(this.viewport.worldScreenHeight / this.tileHeight) + 4
            }
            this.animate = []
            for (let container of this.containers)
            {
                container.removeChildren()
            }
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
                    for (let i = 0; i < this.containers.length; i++)
                    {
                        const container = this.containers[i]
                        const tiles = this.tiles[i](xIndex + x, yIndex + y)
                        if (tiles)
                        {
                            for (let tile of tiles)
                            {
                                const sprite = container.addChild(this.sprites.get(tile.texture))
                                sprite.tile = tile
                                sprite.scale.x = tile.flipX ? -1 : 1
                                sprite.scale.y = tile.flipY ? -1 : 1
                                sprite.tint = exists(tile.tint) ? tile.tint : 0xffffff
                                sprite.rotation = exists(tile.rotate) ? tile.rotate : 0
                                sprite.position.set(xStart + x * this.tileWidth + this.tileWidth / 2, yStart + y * this.tileHeight + this.tileHeight / 2)
                                if (tile.animate)
                                {
                                    this.animate.push(sprite)
                                }
                                display++
                            }
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
                let length = 0
                for (let container of this.containers)
                {
                    length += container.children.length
                }
                this.counter.log(display + ' tiles with ' + this.sprites.length + ' empty' + ' using ' + length + ' sprites.' )
            }
        }
    }

    updateAnimate()
    {
        for (let animate of this.animate)
        {
            animate.texture = animate.tile.texture
        }
    }
}