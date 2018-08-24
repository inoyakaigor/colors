const colors = [
    'hsla(211, 100%, 59%, 1)',
    'hsla(4, 100%, 65%, 1)',
    'hsla(44, 100%, 61%, 1)',
    'hsla(288, 74%, 54%, 1)',
    'hsla(182, 52%, 51%, 1)',
    'hsla(345, 64%, 49%, 1)',
    'hsla(35, 100%, 59%, 1)',
    'hsla(315, 77%, 67%, 1)',
    'hsla(257, 100%, 59%, 1)',
    'hsla(0, 93%, 78%, 1)',
    'hsla(53, 68%, 69%, 1)',
    'hsla(269, 52%, 53%, 1)',
    'hsla(96, 55%, 53%, 1)',
    'hsla(32, 100%, 49%, 1)',
    'hsla(53, 100%, 50%, 1)',
    'hsla(215, 51%, 56%, 1)',
    'hsla(59, 55%, 53%, 1)',
    'hsla(326, 80%, 56%, 1)',
    'hsla(65, 99%, 48%, 1)',
    'hsla(270, 56%, 31%, 1)',
]

const ERRORS = {
    'ru-RU': {
        'parameter': 'Переданный параметр color не задан, либо задан не верно. Текущее значение:',
        'format': 'Неверный формат цвета. Проверьте правильность передаваемых значений. Теукщее значение:'
    },
    'en-US': {
        'parameter': 'The color parameter is undefined or wrong. This should be rgba(…) or hsla(…). Current value:',
        'format': 'Wrong color format! Check the color value. Current value:'
    }
}

const getError = error => {
    let lang = 'en-US'
    if (navigator && navigator.language)
        if (ERRORS[navigator.language])
            lang = navigator.language

    return ERRORS[lang][error]
}

const COLORS = new Proxy(colors, {
    get: (target, prop) => {
        if (target[prop]) return target[prop]
        let newColor
        let hue
        let lightness

        let i = 0
        while (true) {
            if (++i > 9999) {
                throw new Error('Достигнут лимит комбинаций цветов')
            }

            hue = Math.ceil(Math.random()*36)*10
            lightness = Math.ceil(Math.random()*70+15)
            if (target.includes(`hsla(${hue}, 100%, ${lightness}%, 1)`)) {
                hue = lightness = undefined
                continue
            } else {
                newColor = target[prop] = `hsla(${hue}, 100%, ${lightness}%, 1)`
                break
            }
        }
        return newColor
    }
})

export const getTransparentColor = (color, opacity = 0.5) => {
    if (!/rgba|hsla/.test(color))
        throw new Error(`${getError('parameter')} ${color}`)
    const type = color.match(/rgba|hsla/g)[0]
    let digits = color.match(/\d+/g).slice(0, 3)
    if (/hsla/.test(color))
        digits = digits.map((digit, index) => {
            if (index == 0) return digit
            return `${digit}%`
        })
    if (digits.length < 3)
        throw new Error(`${getError('format')} ${color}`)

    return type + '(' + [...digits, opacity].join(', ') + ')'
}

export default COLORS