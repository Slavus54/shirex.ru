import Home from '@/assets/geo/location-home.png'
import Dot from '@/assets/geo/location-dot.png'

const MapPicker = ({isHome = false}) => <img src={isHome ? Home : Dot} className='icon' /> 

export default MapPicker