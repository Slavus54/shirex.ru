import {gql} from '@apollo/client'

// query

export const getBuildingsQ = gql`
    query {
        getBuildings {
            shortid
            name
            title
            category
            architecture
            century
            region
            cords {
                lat
                long
            }
        }
    }
`

// mutations

export const createBuildingM = gql`
    mutation createBuilding($name: String!, $id: String!, $title: String!, $category: String!, $architecture: String!, $century: String!, $region: String!, $cords: ICord!, $status: String!, $photography: String!, $rating: Float!, $change: String!)  {
        createBuilding(name: $name, id: $id, title: $title, category: $category, architecture: $architecture, century: $century, region: $region, cords: $cords, status: $status, photography: $photography, rating: $rating, change: $change) 
    }
`

export const getBuildingM = gql`
    mutation getBuilding($id: String!) {
        getBuilding(id: $id) {
            shortid
            name
            title
            category
            architecture
            century
            region
            cords {
                lat
                long
            }
            status
            photography
            rating
            change
            photos {
                shortid
                name
                title
                category
                image
                likes
            }
            facts {
                shortid
                name
                text
                format
                dateUp
            }
        }
    }
`

export const manageBuildingPhotoM = gql`
    mutation manageBuildingPhoto($name: String!, $id: String!, $option: String!, $title: String!, $category: String!, $image: String!, $likes: String!, $collId: String!)  {
        manageBuildingPhoto(name: $name, id: $id, option: $option, title: $title, category: $category, image: $image, likes: $likes, collId: $collId) 
    }
`

export const updateBuildingInformationM = gql`
    mutation updateBuildingInformation($name: String!, $id: String!, $status: String!, $photography: String!, $rating: Float!, $change: String!)  {
        updateBuildingInformation(name: $name, id: $id, status: $status, photography: $photography, rating: $rating, change: $change) 
    }
`

export const publishBuildingFactM = gql`
    mutation publishBuildingFact($name: String!, $id: String!, $text: String!, $format: String!, $dateUp: String!)  {
        publishBuildingFact(name: $name, id: $id, text: $text, format: $format, dateUp: $dateUp) 
    }
`