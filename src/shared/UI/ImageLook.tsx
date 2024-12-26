import {useState, useRef, useMemo, useLayoutEffect} from 'react'
import {onDownloadImage} from '@/utils/features'
import {ImageLookProps} from '@/env/types'

const ImageLook: React.FC<ImageLookProps> = ({src, isScale = false, className = 'photo', color = '', onClick = () => {}, alt = 'photo'}) => {
    const [scale, setScale] = useState<number>(1)
    const element = useRef(null)

    useLayoutEffect(() => {
        let image = element.current

        if (color !== '' && image && className === 'photo') {
            image.style.boxShadow = `0px 0px 3px 1px ${color}`
        }
    }, [])

    useMemo(() => {
        let image = element.current

        if (isScale && image) {
            image.style.transform = `scale(${scale})`
        }
    }, [scale])

    const onScale = e => {
        let delta = scale + e.deltaY * -1e-3

        setScale(Math.max(.25, delta < 3 ? delta : 1))
    }

    return (
        <div className='center'>
            <img onWheel={e => onScale(e)} src={src} onClick={onClick} onDoubleClick={() => onDownloadImage(src)} className={className} alt={alt} ref={element} loading='lazy' />
        </div>
    )
}

export default ImageLook