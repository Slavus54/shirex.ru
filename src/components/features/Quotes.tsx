import {useState} from 'react'
import quotes from '@/api/quotes.json'

const Quotes = () => {
    const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)])

    return (
        <div className='quote-item'>
            <p>{quote.text}</p>
            <b>{quote.author}</b>
        </div>
    )
}

export default Quotes