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
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import DraftFormWrapper from '@/components/hoc/DraftFormWrapper'
import {createFamilyM} from './gql'
import {SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {FAMILY_TYPES, RELIGIONS, CENTURIES, DEFALT_HONOR} from './env'
import {ContextType, TownType, MapType} from '@/env/types'

const CreateFamily: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')
    const [image, setImage] = useState<string>('')

    const [state, setState] = useState({
        category: FAMILY_TYPES[0], 
        religion: RELIGIONS[0], 
        century: CENTURIES[0],
        region: towns[0].translation,
        cords: towns[0].cords,
        honor: DEFALT_HONOR
    })

    const {category, religion, century, region, cords, honor} = state

    useLayoutEffect(() => {
        changeTitle('Новая Семья')
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

    const [createFamily] = useMutation(createFamilyM, {
        onCompleted() {
            setIsLoading(false)
            updateProfileInfo(null)
        }
    })

    const onCreate = () => {
        createFamily({
            variables: {
                name: account.name, id, title, category, religion, century, region, cords, honor
            }
        })
        
        setIsLoading(true)
    }

    return (
        <ComponentLoadingWrapper 
            component={
                <FormPagination items={[
                    <>
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Семейный род' type='text' />                         

                        <div className='items small'>
                            {FAMILY_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={classHandler(el, category)}>{el}</div>)}
                        </div>  

                        <h5 className='pale'>Религия и век основания</h5>

                        <div className='items little'>
                            <select value={religion} onChange={e => setState({...state, religion: e.target.value})}>
                                {RELIGIONS.map(el => <option value={el}>{el}</option>)}
                            </select>    
                            <select value={century} onChange={e => setState({...state, century: e.target.value})}>
                                {CENTURIES.map(el => <option value={el}>{el}</option>)}
                            </select>    
                        </div>

                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Регион' type='text' />
                        
                        <ReactMapGL mapStyle={onInitMapStyle()} onClick={e => setState({...state, cords: codus.cords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker />
                            </Marker>
                        </ReactMapGL> 

                        <button onClick={onCreate}>Создать</button>   

                        <DraftFormWrapper title={title} setTitle={setTitle} />        
                    </>
                ]}>
                    <h2>Новая Семья</h2>
                </FormPagination>  
            }
            isLoading={isLoading}
            isAppShell={false}
            text='Семья создаётся'
        />
    )
}

export default CreateFamily