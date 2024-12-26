export const classHandler = (element, toCompare, base = 'item label', piece = 'active') => {
    return element === toCompare ? base + ' ' + piece : base
}

export const onGetRatingChangeSelector = (prev = 1, current = 1) => prev > current ? 'change-less' : 'change-more'