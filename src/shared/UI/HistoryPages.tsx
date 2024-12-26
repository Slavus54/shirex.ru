import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {onInitHistory} from "@/utils/storage"

const HistoryPages: React.FC = () => {
    const [length] = useState<number>(onInitHistory().length)
    const [isEmptyPages] = useState<boolean>(!Boolean(length))

    const navigate = useNavigate()

    return (
        <div className='history'>
            {isEmptyPages ? 'Вы ещё не посетили ни одну страницу' : `Вы посетили ${length} страниц`}

            <button onClick={() => navigate('/history')} className='history-btn'>Подробнее</button> 
        </div>
    )   
}

export default HistoryPages