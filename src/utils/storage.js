import {codus} from '@/shared/libs/libs'
import {TOWNS_API_ENDPOINT, TOWN_BORDER_FROM, TOWN_BORDER_TO, TOWNS_API_KEY, SESSION_INFO_KEY, ACCOUNT_INFO_KEY, PROFILE_URL, ACCOUNT_LOCATION_KEY, IP_API_KEY, ACOOUNT_HISTORY_KEY, HISTORY_PAGES_LIMIT, ACOOUNT_DRAFT_KEY, DRAFT_TYPES, DEFAULT_TEST_AWARD, ACCOUNT_TEST_KEY, ACCOUNT_MAP_KEY, MAP_STYLES} from '@/env/env'

export const checkStorageData = (key) => localStorage.getItem(key) === null

// Towns API

export const getTownsFromServer = async () => {
    let data = await fetch(TOWNS_API_ENDPOINT)
    let result = await data.json()

    result = result.slice(TOWN_BORDER_FROM, TOWN_BORDER_TO)

    localStorage.setItem(TOWNS_API_KEY, JSON.stringify(result || []))
}

export const getTownsFromStorage = () => {
    return checkStorageData(TOWNS_API_KEY) ? [] : JSON.parse(localStorage.getItem(TOWNS_API_KEY))
}

// Current Session 

export const createSession = ({name, region, dateUp}) => localStorage.setItem(SESSION_INFO_KEY, JSON.stringify({name, region, dateUp}))

export const getSession = () => checkStorageData(SESSION_INFO_KEY) ? null : JSON.parse(localStorage.getItem(SESSION_INFO_KEY))

// Profile

export const updateProfileInfo = (profile) => localStorage.setItem(ACCOUNT_INFO_KEY, JSON.stringify(profile))

export const getProfileInfo = () => {
    return checkStorageData(ACCOUNT_INFO_KEY) ? null : JSON.parse(localStorage.getItem(ACCOUNT_INFO_KEY))
}

export const onGetProfileFromServer = async (name = '') => {
    let data = await fetch(PROFILE_URL, {
        method: 'POST',
        body: JSON.stringify({name}),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    data = await data.json()

    return data
}

// Location

export const onInitLocation = async () => {
    const data = checkStorageData(ACCOUNT_LOCATION_KEY)

    if (data) {
        await fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=${IP_API_KEY}`).then(res => res.json()).then(info => {
            if (!info.error) {
                localStorage.setItem(ACCOUNT_LOCATION_KEY, JSON.stringify(info))
            }
        })
    }

    return data ? null : JSON.parse(localStorage.getItem(ACCOUNT_LOCATION_KEY))
}

// History

export const onInitHistory = () => {
    let data = checkStorageData(ACOOUNT_HISTORY_KEY)
    let result = []

    if (data) {
        localStorage.setItem(ACOOUNT_HISTORY_KEY, JSON.stringify([]))
    } else {
        result = JSON.parse(localStorage.getItem(ACOOUNT_HISTORY_KEY))
    }

    return result
}

export const onAppendPageToHistory = (id = '', title = '', type = 'block', dateUp = '') => {
    let data = JSON.parse(localStorage.getItem(ACOOUNT_HISTORY_KEY))

    if (data && data.length < HISTORY_PAGES_LIMIT) {
        let page = data.find(el => el.id === id)

        if (page === undefined) {
            localStorage.setItem(ACOOUNT_HISTORY_KEY, JSON.stringify([...data, {id, title, type, dateUp}]))
        }
    }
}

export const onDeleteAllHistory = () => localStorage.setItem(ACOOUNT_HISTORY_KEY, JSON.stringify([]))

// Draft

export const onInitDrafts = () => {
    let data = checkStorageData(ACOOUNT_DRAFT_KEY)

    if (data) {
        localStorage.setItem(ACOOUNT_DRAFT_KEY, JSON.stringify(new Array(DRAFT_TYPES.length).fill(null).map((_, idx) => {
            return {title: '', type: DRAFT_TYPES[idx], dateUp: ''}
        })))
    }
}

export const onGetDraftType = pathname => {
    let type = DRAFT_TYPES.find(el => pathname.includes(el))

    return type !== undefined ? type : ''
}

export const onCreateDraft = (title = '', pathname = '', dateUp = '') => {
    let data = JSON.parse(localStorage.getItem(ACOOUNT_DRAFT_KEY))

    if (data) {
        let type = onGetDraftType(pathname)
       
        let result = data.map(el => {
            if (el.type === type) {
                return {title: title !== el.title && title.length !== 0 ? title : el.title, type, dateUp}
            } else {
                return el
            }
        })

        localStorage.setItem(ACOOUNT_DRAFT_KEY, JSON.stringify(result))
    }
}   

export const onGetDraft = pathname => {
    let data = JSON.parse(localStorage.getItem(ACOOUNT_DRAFT_KEY))
    let result = null

    if (data) {
        let type = onGetDraftType(pathname)
      
        result = data.find(el => el.type === type)
    }

    return result
}

// Test

export const onInitTest = () => {
    let data = checkStorageData(ACCOUNT_TEST_KEY)
    let result = null

    if (data) {
        localStorage.setItem(ACCOUNT_TEST_KEY, JSON.stringify({points: 0, percent: 0, length: 0}))
    } else {
        result = JSON.parse(localStorage.getItem(ACCOUNT_TEST_KEY))
    }

    return result
}

export const onUpdateTest = (isRight = true) => {
    let data = JSON.parse(localStorage.getItem(ACCOUNT_TEST_KEY))
    let piece = (isRight ? 1e2 : 0)
    let points = data.points
    let length = data.length + 1
    let percent = data.length === 0 ? piece : codus.round((data.percent * data.length + piece) / length)

    if (isRight) {
        points += DEFAULT_TEST_AWARD
    }
    
    let result = {points, percent, length}

    localStorage.setItem(ACCOUNT_TEST_KEY, JSON.stringify(result))

    return result
}

// Map

export const onInitMapStyle = () => {
    const data = checkStorageData(ACCOUNT_MAP_KEY)

    if (data) {
        localStorage.setItem(ACCOUNT_MAP_KEY, JSON.stringify(MAP_STYLES[0].style))
    }

    return JSON.parse(localStorage.getItem(ACCOUNT_MAP_KEY))
}

export const onSetMapStyle = style => localStorage.setItem(ACCOUNT_MAP_KEY, JSON.stringify(style))