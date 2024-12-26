const useRandomTown = (towns = []) => {
    const index: number = Math.floor(Math.random() * towns.length)
    
    return [index]
}   

export default useRandomTown