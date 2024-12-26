import {useNavigate} from 'react-router-dom'
import ImageLook from "./ImageLook"
import {HELPER_ICON} from '@/env/env'

const Helper = () => {
    const navigate = useNavigate()

    return <ImageLook onClick={() => navigate('/helper')} src={HELPER_ICON} className='icon helper' />
}

export default Helper