import React from 'react'

// Context API

export interface UserCookieType {
    shortid: string
    name: string
    token: string
}

export interface ContextType {
    account: any 
    accountUpdate: any
} 

export type ContextPropsType = {
    children: React.ReactNode
}

// Routing

export interface RouteItem {
    title: string
    url: string
    component: any
    isUserAuth: boolean
    inMenuExist: boolean
}

export interface RouterNavigatorPropsType {
    url: string
    isOnMap?: boolean
    children: any
}

export interface CollectionPropsType {
    params: {
        id: string
    }
}

// Account

export interface AccountPart {
    url: string
    component: any
}

export interface AccountPropsType {
    profile: any
}

export interface AccountCollectionType {
    shortid: string
    title: string
    url: string
}

export interface AccountComponentType {
    title: string
    url: string
}

// API

export interface TownType {
    title: string
    translation: string
    domain: string
    cords: Cords
}

// Mapbox 

export interface MapType {
    latitude: number
    longitude: number
    width: string
    height: string
    zoom: number
}

export interface Cords {
    lat: number
    long: number
}

// HOC

export interface DraftFormType {
    title: string
    setTitle: any
}

// UI

export interface SimpleTriggerProps {
    onClick: any
}

export interface LikeButtonProps {
    onClick: any
    dependency: any 
    likes: string
    setCounter?: any
    toLikeText?: string 
    likeExistText?: string
}

export interface CounterViewProps {
    num: number
    setNum: any 
    part?: number
    min?: number
    max?: number
    children: any
    selector?: string
}

export interface DataPaginationProps {
    items?: any[]
    setItems: any
    label?: string
}

export interface FormPaginationProps {
    children: any
    items: any[]
}

export interface ImageLoaderProps {
    setImage: any
}

export interface ImageLookProps {
    src: string
    isScale?: boolean
    className?: string
    onClick?: any
    onDoubleClick?: any
    color?: string
    alt?: string
}

export interface LoadingPropsType {
    label: string
}