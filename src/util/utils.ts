export const dateToString = (date:Date|string):string => {
    const target:Date = typeof(date) != 'string' ? date : new Date(date);

    const now = Date.now(); 
    const diff = now - target.getTime();

    const thresh = {
        second: 1000, 
        minute: 1000 * 60, 
        hour: 1000 * 60 * 60, 
        day: 1000 * 60 * 60 * 24, 
        week: 1000 * 60 * 60 * 24 * 7
    }

    if(diff < thresh.second)
        return `less than a second ago`
    else if (diff < thresh.minute)
        return `${Math.ceil(diff / thresh.minute)} second(s) ago`
    else if (diff < thresh.hour)
        return `${Math.ceil(diff / thresh.hour)} minute(s) ago`
    else if (diff < thresh.day)
        return `${Math.ceil(diff / thresh.day)} hour(s) ago`
    else if (diff < thresh.week)
        return `${Math.ceil(diff / thresh.week)} day(s) ago`
    else return `${target.getDay()}, ${target.getMonth()} ${target.getDate()} ${target.getFullYear()}`
}