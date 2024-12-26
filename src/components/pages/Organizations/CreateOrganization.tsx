import React, {useState, useMemo, useContext, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {AppContext} from '@/context/AppContext'
import {codus} from '@/shared/libs/libs'
import {changeTitle} from '@/utils/notifications'
import {updateProfileInfo, getTownsFromStorage, onInitMapStyle} from '@/utils/storage'
import {classHandler} from '@/utils/css'
import FormPagination from '@/shared/UI/FormPagination'
import MapPicker from '@/shared/UI/MapPicker'
import ImageLoader from '@/shared/UI/ImageLoader'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import DraftFormWrapper from '@/components/hoc/DraftFormWrapper'
import {createOrganizationM} from './gql'
import {SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {ORGANIZATION_TYPES, FORMATS} from './env'
import {ContextType, TownType, MapType} from '@/env/types'

const CreateOrganization: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        category: ORGANIZATION_TYPES[0], 
        format: FORMATS[0], 
        region: towns[0].translation,
        cords: towns[0].cords
    })

    const {category, format, region, cords} = state

    useLayoutEffect(() => {
        changeTitle('Новая Организация')
    }, [])

    useEffect(() => {
        if (region.length !== 0) {
            let result = towns.find(el => codus.search(el.translation, region, SEARCH_PERCENT))

            if (result !== undefined) {
                setState({...state, region: result.translation, cords: result.cords})
            }
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    const [createOrganization] = useMutation(createOrganizationM, {
        onCompleted() {
            setIsLoading(false)
            updateProfileInfo(null)
        }
    })

    const onCreate = () => {
        createOrganization({
            variables: {
                name: account.name, id, title, category, format, region, cords, image
            }
        })
        
        setIsLoading(true)
    }

    return (
        <ComponentLoadingWrapper 
            component={
                <FormPagination items={[
                    <>
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Название организации...' type='text' /> 

                        <h5 className='pale'>Выберите тип учереждения</h5>

                        <div className='items small'>
                            {ORGANIZATION_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                        </div>  

                        <ImageLoader setImage={setImage} />

                        <DraftFormWrapper title={title} setTitle={setTitle} />        
                    </>,
                    <>
                        <h5 className='pale'>Выберите масштаб и регион на карте</h5>

                        <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                            {FORMATS.map(el => <option value={el}>{el}</option>)}
                        </select>      

                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Регион' type='text' />
                        
                        <ReactMapGL mapStyle={onInitMapStyle()} onClick={e => setState({...state, cords: codus.cords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker />
                            </Marker>
                        </ReactMapGL> 

                        <button onClick={onCreate}>Создать</button>   
                    </>
                ]}>
                    <h2>Новая Организация</h2>
                </FormPagination>  
            }
            isLoading={isLoading}
            isAppShell={false}
            text='Организация создаётся'
        />
    )
}

export default CreateOrganization