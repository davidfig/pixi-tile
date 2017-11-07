const PIXI = require('pixi.js')
const Counter = require('yy-counter')

module.exports = class Tiles
{
    /**
     * @param {PIXI.Container||PIXI.particles.ParticleContainer} container to hold the tiles
     * @param {Viewport} viewport from pixi-viewport
     * @param {number} width of tile
     * @param {number} height of tile
     * @param {function} tiles(x, y) should return texture[] where (x, y) is the coordinates in the tile map (i.e., the world coordinates divided by the tiles' width/height)
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
        if (this.debug) this.counter = new Counter({ side: 'bottom-left', background: 'rgba(0,0,0,0.5)' })
    }

    resize()
    {
        this.last = {}
    }

    sprite()
    {
        const sprite = this.container.addChild(new PIXI.Sprite())
        sprite.width = this.tileWidth
        sprite.height = this.tileHeight
        return sprite
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
            const left = this.viewport.left
            const top = this.viewport.top
            const xStart = left - left % this.tileWidth
            const yStart = top - top % this.tileHeight
            const xIndex = xStart / this.tileWidth
            const yIndex = yStart / this.tileHeight
            let i = 0
            for (let y = 0; y < this.rows; y++)
            {
                for (let x = 0; x < this.columns; x++)
                {
                    const tiles = this.tiles(xIndex + x, yIndex + y)
                    if (tiles)
                    {
                        for (let texture of tiles)
                        {
                            let sprite
                            if (i === this.container.children.length)
                            {
                                sprite = this.sprite()
                            }
                            else
                            {
                                sprite = this.container.children[i++]
                            }
                            sprite.texture = texture
                            sprite.visible = true
                            sprite.position.set(xStart + x * this.tileWidth, yStart + y * this.tileHeight)
                            display++
                        }
                    }
                }
            }
            for (let j = i; j < this.container.children.length; j++)
            {
                this.container.children[j].visible = false
            }
            this.last.x = container.x
            this.last.y = container.y
            this.last.scaleX = container.scale.x
            this.last.scaleY = container.scale.y
            if (this.debug)
            {
                let count = 0
                for (let i = 0; i < this.container.children.length; i++)
                {
                    count += this.container.children[i].visible ? 0 : 1
                }
                this.counter.log(display + ' tiles with ' + count + ' empty' + ' using ' + this.container.children.length + ' sprites')
            }
        }
    }
}