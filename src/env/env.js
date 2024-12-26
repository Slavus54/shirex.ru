export const PROJECT_TITLE = 'ShireX.ru'
export const APP_NODE = 'app'

export const token = 'pk.eyJ1Ijoic2xhdnVzNTQiLCJhIjoiY2toYTAwYzdzMWF1dzJwbnptbGRiYmJqNyJ9.HzjnJX8t13sCZuVe2PiixA'

export const TOWNS_API_KEY = 'towns'
export const SESSION_INFO_KEY = 'session'
export const ACCOUNT_INFO_KEY = 'account'
export const ACCOUNT_COOKIE_KEY = 'profile'
export const ACCOUNT_LOCATION_KEY = 'location'
export const ACOOUNT_HISTORY_KEY = 'history'
export const ACOOUNT_DRAFT_KEY = 'draft'
export const ACCOUNT_TEST_KEY = 'test'
export const ACCOUNT_MAP_KEY = 'map-style'

export const PROJECT_ICON = 'https://img.icons8.com/color/48/peter-the-great.png'
export const MAP_ICON = 'https://img.icons8.com/color/48/google-maps-new.png'
export const INFO_ICON = 'https://img.icons8.com/ios/50/help.png'
export const HELPER_ICON = 'https://img.icons8.com/ios/50/technical-support.png'
export const CURRENCY = '₽'

export const VIEW_CONFIG = {
    latitude: 0,
    longitude: 0,
    width: '42rem',
    height: '20rem',
    zoom: 13
} 

// Common API

export const WEBSERVER_BASE_URL = 'https://shirex-server.vercel.app'
export const DOMAIN_BASE_URL = 'https://shirex-ru.vercel.app'
export const WEBSERVER_URL = `${WEBSERVER_BASE_URL}/graphql`
export const PROFILE_URL = `${WEBSERVER_BASE_URL}/get-profile`
export const TOWNS_API_ENDPOINT = 'https://towns-api.vercel.app/towns'
export const IP_API_KEY = '4799bf2d4642434aa73b4eeafc72ae0d'

export const DRAFT_TYPES = ['block', 'yard', 'road', 'building', 'walking', 'company', 'organization', 'family']
export const TERRITORY_TYPES = ['ЕС', 'США', 'Япония', 'Корея']

export const MAP_STYLES = [ 
    {
        title: 'Улица',
        style: 'mapbox://styles/mapbox/satellite-streets-v12'
    },
    {
        title: 'Контраст',
        style: 'mapbox://styles/mapbox/outdoors-v12'
    },
    {
        title: 'Светлая',
        style: 'mapbox://styles/mapbox/light-v11'
    },
    {
        title: 'Темная',
        style: 'mapbox://styles/mapbox/dark-v11'
    }    
]

// static pages API

export const REFORMS_URL = 'https://docs.google.com/document/d/1pkeNTvz2bHXVrDS9cljq5OHCuqKm-h-x/edit?usp=sharing&ouid=117030529749607431211&rtpof=true&sd=true'
export const REFORMS_ICON = 'https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-papyrus-history-flaticons-flat-flat-icons.png'
export const ACTION_TYPES = ['Уборка', 'Пост', 'Изделие']

// numbers

export const SEARCH_PERCENT = 60
export const INITIAL_PERCENT = 50
export const PAGINATION_LIMIT = 3
export const TIME_PART = 30
export const COLLECTION_LIMIT = 10
export const MAP_ZOOM = 16
export const DATES_LENGTH = 4
export const ID_SIZE = 16
export const ID_DEFAULT_SIZE = 8
export const TOWN_BORDER_FROM = 89
export const TOWN_BORDER_TO = 312
export const HISTORY_PAGES_LIMIT = 12
export const DEFAULT_TEST_AWARD = 2