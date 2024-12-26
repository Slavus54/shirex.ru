import {gql} from '@apollo/client'

// query

export const getWalkingsQ = gql`
    query {
        getWalkings {
            shortid
            name
            title
            category
            level
            region
            cords {
                lat
                long
            }
            dateUp
            time
        }
    }
`

// mutations

export const createWalkingM = gql`
    mutation createWalking($name: String!, $id: String!, $title: String!, $category: String!, $level: String!, $region: String!, $cords: ICord!, $dateUp: String!, $time: String!, $opus: String!) {
        createWalking(name: $name, id: $id, title: $title, category: $category, level: $level, region: $region, cords: $cords, dateUp: $dateUp, time: $time, opus: $opus)
    }
`

export const getWalkingM = gql`
    mutation getWalking($id: String!) {
        getWalking(id: $id) {
            shortid
            name
            title
            category
            level
            region
            cords {
                lat
                long
            }
            dateUp
            time
            opus
            locations {
                shortid
                name
                title
                category
                cords {
                    lat
                    long
                }
                image
                dateUp
                likes
            }
            topics {
                shortid
                name
                text
                format
                duration
            }
        }
    }
`

export const manageWalkingLocationM = gql`
    mutation manageWalkingLocation($name: String!, $id: String!, $option: String!, $title: String!, $category: String!, $cords: ICord!, $image: String!, $dateUp: String!, $likes: String!, $collId: String!) {
        manageWalkingLocation(name: $name, id: $id, option: $option, title: $title, category: $category, cords: $cords, image: $image, dateUp: $dateUp, likes: $likes, collId: $collId)
    }
`

export const updateWalkingOpusM = gql`
    mutation updateWalkingOpus($name: String!, $id: String!, $opus: String!) {
        updateWalkingOpus(name: $name, id: $id, opus: $opus)
    }
`

export const offerWalkingTopicM = gql`
    mutation offerWalkingTopic($name: String!, $id: String!, $text: String!, $format: String!, $duration: Float!) {
        offerWalkingTopic(name: $name, id: $id, text: $text, format: $format, duration: $duration)
    }
`