export const utilService = {
    makeId,
    getRandomIntInclusive,
    debounce
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}

function debounce(func, wait) {
    let timeout

    return function executedFunction(...args) {
        clearTimeout(timeout)
        timeout = setTimeout(()=>{
            func(...args)
        }, wait)
    }
}
