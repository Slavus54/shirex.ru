const useRandomPlaceholder = (items = []) => {
    const text: string = items[Math.floor(Math.random() * items.length)]
    
    return [text]
}   

export default useRandomPlaceholder