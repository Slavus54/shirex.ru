const useRandomPercent = (min = 0, size = 1e2) => {
    const step = Math.floor(Math.random() * size)
    const value: number = step < min ? min : step
    
    return value
}   

export default useRandomPercent