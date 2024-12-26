import {codus} from "@/shared/libs/libs"
import {ID_DEFAULT_SIZE} from "@/env/env"

export const onDownloadImage = content => {
    let link = document.createElement('a')

    link.setAttribute('download', 'shirex-image_' + codus.id(ID_DEFAULT_SIZE))
    link.setAttribute('href', content)

    link.click()
}