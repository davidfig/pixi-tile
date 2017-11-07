const PIXI = require('pixi.js')
const RenderSheet = require('yy-rendersheet')
const Random = require('yy-random')

const TEXTURES = 30
const DOTS = 30

let _map, _width, _height, _size, _sheet

function create(width, height, size)
{
    _size = size
    _width = width
    _height = height
    _sheet = new RenderSheet()
    for (let i = 0; i < TEXTURES; i++)
    {
        _sheet.add(i, draw, measure)
    }
    for (let i = 0; i < DOTS; i++)
    {
        _sheet.add('dots-' + i, drawDots, measure)
    }
    _sheet.render()
    _map = []
    for (let y = 0; y < width / size; y++)
    {
        for (let x = 0; x < height / size; x++)
        {
            const entry = [_sheet.getTexture(Random.get(TEXTURES))]
            if (Random.chance(0.2))
            {
                entry.push(_sheet.getTexture('dots-' + Random.get(DOTS)))
            }
            _map[x + y * _width] = entry
        }
    }
}

function get(x, y)
{
    if (x >= 0 && y >= 0 && x <= _width / _size && y <= _height / _size)
    {
        return _map[x + y * _width]
    }
}

function draw(c)
{
    c.beginPath()
    c.fillStyle = '#' + Random.color().toString(16)
    c.fillRect(0, 0, _size, _size)
}

function drawDots(c)
{
    const dots = Random.get(10)
    c.fillStyle = '#ffffff'
    for (let i = 0; i < dots; i++)
    {
        c.beginPath()
        const radius = Random.get(_size * 0.1, true)
        c.arc(Random.range(radius, _size - radius), Random.range(radius, _size - radius), radius, 0, PIXI.PI_2)
        c.fill()
    }
}

function measure()
{
    return { width: _size, height: _size }
}

module.exports = {
    create,
    get
}