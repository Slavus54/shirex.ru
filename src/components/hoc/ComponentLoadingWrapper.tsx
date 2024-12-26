import AppShell from "@/shared/UI/AppShell"
import Loading from "@/shared/UI/Loading"

const ComponentLoadingWrapper = ({component = null, isLoading = false, type = 'search', isAppShell = true, text = 'Загрузка'}) => isLoading ? 
        (isAppShell ? <AppShell type={type} /> : <Loading label={text} />) 
    : 
        component

export default ComponentLoadingWrapper 