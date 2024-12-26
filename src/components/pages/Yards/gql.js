import {gql} from '@apollo/client'

// query

export const getYardsQ = gql`
    query {
        getYards {
            shortid
            name
            title
            category
            landscape
            format
            region
            cords {
                lat
                long
            }
        }
    }
`

// mutations

export const createYardM = gql`
    mutation createYard($name: String!, $id: String!, $title: String!, $category: String!, $landscape: String!, $format: String!, $square: Float!, $region: String!, $cords: ICord!, $seeds: String!, $status: String!, $damage: Float!) {
        createYard(name: $name, id: $id, title: $title, category: $category, landscape: $landscape, format: $format, square: $square, region: $region, cords: $cords, seeds: $seeds, status: $status, damage: $damage) 
    }
`

export const getYardM = gql`
    mutation getYard($id: String!) {
        getYard(id: $id) {
            shortid
            name
            title
            category
            landscape
            format
            square
            region
            cords {
                lat
                long
            }
            seeds
            status
            damage
            mowings {
                shortid
                name
                text
                height
                image
                dateUp
                likes
            }
            equipments {
                shortid
                name
                title
                category
                rating
            }
        }
    }
`

export const manageYardMowingM = gql`
    mutation manageYardMowing($name: String!, $id: String!, $option: String!, $text: String!, $height: Float!, $image: String!, $dateUp: String!, $likes: String!, $collId: String!) {
        manageYardMowing(name: $name, id: $id, option: $option, text: $text, height: $height, image: $image, dateUp: $dateUp, likes: $likes, collId: $collId)
    }
`

export const updateYardInformationM = gql`
    mutation updateYardInformation($name: String!, $id: String!, $seeds: String!, $status: String!, $damage: Float!) {
        updateYardInformation(name: $name, id: $id, seeds: $seeds, status: $status, damage: $damage)
    }
`

export const publishYardEquipmentM = gql`
    mutation publishYardEquipment($name: String!, $id: String!, $title: String!, $category: String!, $rating: Float!) {
        publishYardEquipment(name: $name, id: $id, title: $title, category: $category, rating: $rating)
    }
`