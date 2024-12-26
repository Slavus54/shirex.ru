import React, {useState, useMemo, useContext, useEffect, useLayoutEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useParams} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {AppContext} from '@/context/AppContext'
import {codus} from '@/shared/libs/libs'
import {changeTitle} from '@/utils/notifications'
import {updateProfileInfo, getTownsFromStorage, onInitMapStyle} from '@/utils/storage'
import FormPagination from '@/shared/UI/FormPagination'
import MapPicker from '@/shared/UI/MapPicker'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import DraftFormWrapper from '@/components/hoc/DraftFormWrapper'
import {createCompanyM} from './gql'
import {CURRENCY, SEARCH_PERCENT, VIEW_CONFIG, MAP_ZOOM, token} from '@/env/env'
import {COMPANY_TYPES, COMPANY_FORMATS, CAPITALIZATION_DEFAULT_VALUE} from './env'
import {ContextType, TownType, MapType} from '@/env/types'

const CreateCompany: React.FC = () => {
    const {id} = useParams()
    const {account} = useContext<ContextType>(AppContext)

    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('')

    const [state, setState] = useState({
        category: COMPANY_TYPES[0], 
        format: COMPANY_FORMATS[0], 
        capitalization: CAPITALIZATION_DEFAULT_VALUE, 
        url: '',
        region: towns[0].translation,
        cords: towns[0].cords
    })

    const {category, format, capitalization, url, region, cords} = state

    useLayoutEffect(() => {
        changeTitle('Новая Компания')
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

    useMemo(() => {
        if (isNaN(capitalization)) {
            setState({...state, capitalization: CAPITALIZATION_DEFAULT_VALUE})
        }
    }, [capitalization])

    const [createCompany] = useMutation(createCompanyM, {
        onCompleted() {
            setIsLoading(false)
            updateProfileInfo(null)
        }
    })

    const onCreate = () => {
        createCompany({
            variables: {
                name: account.name, id, title, category, format, capitalization, url, region, cords
            }
        })
        
        setIsLoading(true)
    }

    return (
        <ComponentLoadingWrapper 
            component={
                <FormPagination items={[
                    <>
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Название фирмы...' type='text' /> 

                        <h5 className='pale'>Капитализация компании (млн. {CURRENCY})</h5>
                                    
                        <input value={capitalization} onChange={e => setState({...state, capitalization: parseInt(e.target.value)})} placeholder='Размер оборота' type='text' />

                        <input value={url} onChange={e => setState({...state, url: e.target.value})} placeholder='URL' type='text' /> 

                        <div className='items little'>
                            <select value={category} onChange={e => setState({...state, category: e.target.value})}>
                                {COMPANY_TYPES.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                                {COMPANY_FORMATS.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div>        

                        <DraftFormWrapper title={title} setTitle={setTitle} />               
                    </>,
                    <>
                        <h5 className='pale'>Выберите регион</h5>

                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Регион' type='text' />
                        
                        <ReactMapGL mapStyle={onInitMapStyle()} onClick={e => setState({...state, cords: codus.cords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker />
                            </Marker>
                        </ReactMapGL> 

                        <button onClick={onCreate}>Создать</button>
                    </>
                ]}>
                    <h2>Новая Компания</h2>
                </FormPagination>  
            }
            isLoading={isLoading}
            isAppShell={false}
            text='Компания создаётся'
        />
    )
}

export default CreateCompany