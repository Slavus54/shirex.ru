import {useState} from 'react' 
import {codus} from '../libs/libs'
import {ImageLoaderProps} from '@/env/types'

const ImageLoader: React.FC<ImageLoaderProps> = ({setImage}) => {
    const [isLoad, setIsLoad] = useState<boolean>(false)
    const [size, setSize] = useState<number>(0)

    const onLoad = (e: any) => {
        e.preventDefault()

        let reader = new FileReader()

        reader.onload = (file: any) => {
            setImage(file.target.result)
        }
    
        let file = e.target.files[0]

        reader.readAsDataURL(file)
        
        setSize(codus.round(file.size / 2**13, 2))
        setIsLoad(true)
    }

    return (
        <div className='loader'>
            <input onChange={e => onLoad(e)} type='file' id='loader' accept='image/*' required />
            <label htmlFor='loader' />
            <small>{isLoad ? 'Размер ' + size + ' Кб' : 'Загрузить'}</small>
        </div>
    )
}

export default ImageLoader