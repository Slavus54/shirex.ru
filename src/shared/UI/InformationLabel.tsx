import {useState} from 'react'
import ImageLook from './ImageLook'
import {INFO_ICON} from '@/env/env'

const InformationLabel = ({text = ''}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (
        <div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)} className='info'>
            {isOpen ? <span>{text}</span> : <ImageLook src={INFO_ICON} className='mini-icon' />}   
        </div>
    )
}

export default InformationLabel