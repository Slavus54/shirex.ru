import React, {useState, useContext, useMemo} from 'react'
import {AppContext} from '@/context/AppContext'
import {ID_SIZE} from '../../env/env'
import {ContextType, LikeButtonProps} from '@/env/types'

const LikeButton: React.FC<LikeButtonProps> = ({onClick, dependency = null, likes = '', setCounter = null, toLikeText = 'Нравится', likeExistText = ''}) => {
    const [counter] = useState<number>(Math.floor(likes.length / ID_SIZE))
    const {account} = useContext<ContextType>(AppContext)

    const [isAlreadyLiked, setIsAlreadyLiked] = useState<boolean>(false)

    useMemo(() => {
        if (dependency !== null) {
            let isLiked = likes.includes(account.shortid)
            
            setCounter(counter)
            setIsAlreadyLiked(isLiked)
        }
    }, [dependency])

    const onLike = () => {
        setCounter(counter + 1)

        setTimeout(() => {
            setIsAlreadyLiked(!isAlreadyLiked)
        }, 1e2)
       
        onClick()
    }

    return isAlreadyLiked ? <span>{likeExistText}</span> : <button onClick={onLike}>{toLikeText}</button>
}

export default LikeButton