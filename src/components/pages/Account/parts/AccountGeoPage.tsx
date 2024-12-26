import React, {useState, useEffect, useMemo} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import {codus} from '@/shared/libs/libs'
import {updateProfileInfo, getTownsFromStorage, onInitMapStyle, onSetMapStyle} from '@/utils/storage'
import {buildNotification} from '@/utils/notifications'
import MapPicker from '@/shared/UI/MapPicker'
import ComponentLoadingWrapper from '@/components/hoc/ComponentLoadingWrapper'
import {updateProfileGeoInfoM} from '../gql'
import {SEARCH_PERCENT, MAP_STYLES, MAP_ZOOM, VIEW_CONFIG, token} from '@/env/env'
import {AccountPropsType, Cords, TownType, MapType} from '@/env/types'

const AccountGeoPage: React.FC<AccountPropsType> = ({profile}) => {
    const [view, setView] = useState<MapType>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(getTownsFromStorage())

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [distance, setDistance] = useState<number>(0)
    const [style, setStyle] = useState<string>(onInitMapStyle() ?? MAP_STYLES[0].style)
    const [region, setRegion] = useState<string>(profile.region)
    const [cords, setCords] = useState<Cords>({lat: profile.cords.lat, long: profile.cords.long})
    const [isHome, setIsHome] = useState<boolean>(cords.lat === profile.cords.lat)

    useEffect(() => {
        if (region.length !== 0) {
            let result = towns.find(el => codus.search(el.translation, region, SEARCH_PERCENT, true))

            if (result !== undefined) {
                setRegion(result.translation)
                setCords(result.translation === profile.region ? profile.cords : result.cords)               
            }
        }
    }, [region])

    useMemo(() => {
        let result: number = codus.haversine(profile.cords.lat, profile.cords.long, cords.lat, cords.long)

        if (result !== 0) {
            result = codus.round(result, 2)
        }
       
        setDistance(result)

        setIsHome(cords.lat === profile.cords.lat)
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: MAP_ZOOM})
    }, [cords])

    useMemo(() => {
        onSetMapStyle(style)
    }, [style])

    const [updateProfileGeoInfo] = useMutation(updateProfileGeoInfoM, {
        onCompleted(data) {
            buildNotification(data.updateProfileGeoInfo)
            updateProfileInfo(null)
        }
    })

    const onReset = () => {
        setRegion(profile.region)
        setCords(profile.cords)
    }
  
    const onUpdate = () => {
        updateProfileGeoInfo({
            variables: {
                id: profile.shortid, region, cords
            }
        })

        setIsLoading(true)
    }
    
    return <ComponentLoadingWrapper 
        component={
            <>
                <h2>Местоположение</h2>

                <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Регион' type='text' />

                <h5 className='pale'>Дистанция: {distance} км от текущей локации</h5>

                <ReactMapGL mapStyle={style} onClick={e => setCords(codus.cords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                    {!isHome &&
                        <Marker latitude={profile.cords.lat} longitude={profile.cords.long}>
                        <MapPicker isHome={true}  />
                        </Marker>
                    }
                    
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker isHome={isHome}  />
                    </Marker>              
                </ReactMapGL>

                <div className='items little'>
                    <button onClick={onReset}>Сбросить</button>
                    <button onClick={onUpdate}>Обновить</button>
                </div>

                <h2>Стилизация карты</h2>

                <select value={style} onChange={e => setStyle(e.target.value)}>
                    {MAP_STYLES.map(el => <option value={el.style}>{el.title}</option>)}
                </select>
            </>   
        }
        isLoading={isLoading}
        isAppShell={false}
        text='Ваши геоданные обновляются'
    />
}

export default AccountGeoPage