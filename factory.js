const PIXI = require('pixi.js')

module.exports = class Factory
{
    constructor(count, preset)
    {
        this.array = preset || []
        this.released = []
    }

    get(texture)
    {
        let sprite
        if (this.array.length)
        {
            sprite = this.array.pop()
            sprite.texture = texture
        }
        else
        {
            sprite = new PIXI.Sprite(texture)
            sprite.anchor.set(0.5)
        }
        this.released.push(sprite)
        return sprite
    }

    release()
    {
        while (this.released.length)
        {
            this.array.push(this.released.pop())
        }
    }

    get length()
    {
        return this.array.length
    }
}