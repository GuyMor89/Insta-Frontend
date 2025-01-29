export const utilService = {
    makeId,
    getRandomIntInclusive,
    debounce,
    formatDate,
    animateCSS
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
        timeout = setTimeout(() => {
            func(...args)
        }, wait)
    }
}

function formatDate(ms) {
    const timeValue = typeof ms === "string"
        ? (isNaN(ms) ? Date.parse(ms) : Number(ms))
        : ms
    const date = new Date(timeValue)

    // Format the date and time
    const dateOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }

    const shortDateOptions = {
        month: 'short',
        day: 'numeric'
    }

    const mediumDateOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }

    const shortYearOptions = {
        year: 'numeric',
    }

    const hourOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }

    const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(date)
    const formattedShortDate = new Intl.DateTimeFormat('en-US', shortDateOptions).format(date)
    const formattedMediumDate = new Intl.DateTimeFormat('en-US', mediumDateOptions).format(date)
    const formattedShortYear = new Intl.DateTimeFormat('en-US', shortYearOptions).format(date)
    const formattedHour = new Intl.DateTimeFormat('en-US', hourOptions).format(date)

    // Calculate relative time (e.g., "1 day ago")
    const now = new Date()
    const timeDifference = now - date
    const seconds = Math.floor(timeDifference / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)

    const timeStampYear = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(date)
    const currentYear = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(new Date())

    let relativeTime
    if (days > 7 && timeStampYear !== currentYear) {
        relativeTime = formattedMediumDate
    } else if (days > 7) {
        relativeTime = formattedShortDate
    } else if (days > 0) {
        relativeTime = `${days}d`
    } else if (hours > 0) {
        relativeTime = `${hours}h`
    } else if (minutes > 0) {
        relativeTime = `${minutes}m`
    } else {
        relativeTime = `Just now`
    }

    return { shortDate: formattedShortDate, shortHour: formattedHour, mediumDate: formattedMediumDate, shortYear: formattedShortYear, formattedDate, relativeTime }
}


function animateCSS(el, animation = 'bounce') {
    const prefix = 'animate__'
    return new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`
        el.classList.add(`${prefix}animated`, animationName)
        function handleAnimationEnd(event) {
            event.stopPropagation()
            el.classList.remove(`${prefix}animated`, animationName)
            resolve('Animation ended')
        }

        el.addEventListener('animationend', handleAnimationEnd, { once: true })
    })
}
