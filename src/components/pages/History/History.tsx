import React, {useState, useLayoutEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {codus} from '@/shared/libs/libs'
import {changeTitle} from '@/utils/notifications'
import {onInitHistory, onDeleteAllHistory} from '@/utils/storage'

const History: React.FC = () => {
    const [pages] = useState<any[]>(onInitHistory())

    const nagivate = useNavigate()

    useLayoutEffect(() => {
        changeTitle('История посещений')
    }, [])

    const onDelete = () => {
        onDeleteAllHistory()
        nagivate('/')
    }

    return (
        <>    
            <h2>История посещений</h2>

            <div className='items half'>
                {pages.map(el => 
                    <div onClick={() => nagivate(`/${el.type}/${el.id}`)} className='item part'>
                        {codus.short(el.title)}Особняк Петухова
                        <small>{el.type}building</small>
                    </div>
                )}
            </div>

            <h5 className='pale'>Можете очистить всю историю ваших посещений</h5>

            <button onClick={onDelete}>Удалить</button>
        </>
    )
}

export default History