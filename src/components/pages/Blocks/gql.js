import {gql} from '@apollo/client'

// query

export const getBlocksQ = gql`
    query {
        getBlocks {
            shortid
            name
            title
            category
            region
            cords {
                lat
                long
            }
        }
    }
`

// mutations

export const createBlockM = gql`
    mutation createBlock($name: String!, $id: String!, $title: String!, $category: String!, $buildings: [String]!, $region: String!, $cords: ICord!, $territory: String!, $url: String!, $card: String!, $amount: Float!, $role: String!, $weekday: String!) {
        createBlock(name: $name, id: $id, title: $title, category: $category, buildings: $buildings, region: $region, cords: $cords, territory: $territory, url: $url, card: $card, amount: $amount, role: $role, weekday: $weekday)
    }
`

export const getBlockM = gql`
    mutation getBlock($id: String!) {
        getBlock(id: $id) {
            shortid
            name
            title
            category
            buildings
            region
            cords {
                lat
                long
            }
            territory
            url
            card
            amount
            members {
                shortid
                name
                role
                weekday
            }
            tasks {
                shortid
                name
                text
                category
                progress
                image
                likes
                dateUp
            }
            items {
                shortid
                name
                title
                format
                building
                isCommon
            }
        }
    }
`

export const manageBlockStatusM = gql`
    mutation manageBlockStatus($name: String!, $id: String!, $option: String!, $role: String!, $weekday: String!) {
        manageBlockStatus(name: $name, id: $id, option: $option, role: $role, weekday: $weekday)
    }
`

export const updateBlockAmountRateM = gql`
    mutation updateBlockAmountRate($name: String!, $id: String!, $amount: Float!) {
        updateBlockAmountRate(name: $name, id: $id, amount: $amount)
    }
`

export const offerBlockPlaceM = gql`
    mutation offerBlockPlace($name: String!, $id: String!, $territory: String!, $url: String!) {
        offerBlockPlace(name: $name, id: $id, territory: $territory, url: $url) 
    }
`

export const publishBlockItemM = gql`
    mutation publishBlockItem($name: String!, $id: String!, $title: String!, $format: String!, $building: String!, $isCommon: Boolean!) {
        publishBlockItem(name: $name, id: $id, title: $title, format: $format, building: $building, isCommon: $isCommon)
    }
`

export const manageBlockTaskM = gql`
    mutation manageBlockTask($name: String!, $id: String!, $option: String!, $text: String!, $category: String!, $progress: Float!, $image: String!, $likes: String!, $dateUp: String!, $collId: String!) {
        manageBlockTask(name: $name, id: $id, option: $option, text: $text, category: $category, progress: $progress, image: $image, likes: $likes, dateUp: $dateUp, collId: $collId)
    }
`