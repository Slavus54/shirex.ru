import {useContext} from 'react'
import ImageLook from '../UI/ImageLook'
import {AppContext} from '@/context/AppContext'
import {updateProfileInfo} from '@/utils/storage'
import ExitImage from '@/assets/exit.png'
import {ContextType} from '@/env/types'

const Exit = () => {
    const {account, accountUpdate} = useContext<ContextType>(AppContext)

    const onExit = () => {
        accountUpdate(false, {shortid: '', name: '', token: account.token})
        updateProfileInfo(null)
    }

    return <ImageLook onClick={onExit} src={ExitImage} className='exit icon' alt='exit' />
}

export default Exit