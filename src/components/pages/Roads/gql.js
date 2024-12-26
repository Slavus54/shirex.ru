import {gql} from '@apollo/client'

// query

export const getRoadsQ = gql`
    query {
        getRoads {
            shortid
            name
            title
            category
            material
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

export const createRoadM = gql`
    mutation createRoad($name: String!, $id: String!, $title: String!, $category: String!, $material: String!, $format: String!, $lines: Float!, $region: String!, $cords: ICord!, $daypart: String!, $rating: Float!, $traffic: Float!) {
        createRoad(name: $name, id: $id, title: $title, category: $category, material: $material, format: $format, lines: $lines, region: $region, cords: $cords, daypart: $daypart, rating: $rating, traffic: $traffic)
    }
`

export const getRoadM = gql`
    mutation getRoad($id: String!) {
        getRoad(id: $id) {
            shortid
            name
            title
            category
            material
            format
            lines
            region
            cords {
                lat
                long
            }
            daypart
            rating
            traffic
            damages {
                shortid
                name
                text
                category
                cords {
                    lat
                    long
                }
                image
                dateUp
                likes
            }
            waypoints {
                shortid
                name
                title
                format
                level
            }
        }
    }
`

export const manageRoadDamageM = gql`
    mutation manageRoadDamage($name: String!, $id: String!, $option: String!, $text: String!, $category: String!, $cords: ICord!, $image: String!, $dateUp: String!, $likes: String!, $collId: String!) {
        manageRoadDamage(name: $name, id: $id, option: $option, text: $text, category: $category, cords: $cords, image: $image, dateUp: $dateUp, likes: $likes, collId: $collId)
    }
`

export const updateRoadInformationM = gql`
    mutation updateRoadInformation($name: String!, $id: String!, $daypart: String!, $rating: Float!, $traffic: Float!) {
        updateRoadInformation(name: $name, id: $id, daypart: $daypart, rating: $rating, traffic: $traffic)
    }
`

export const updateRoadConstructionM = gql`
    mutation updateRoadConstruction($name: String!, $id: String!, $material: String!, $lines: Float!) {
        updateRoadConstruction(name: $name, id: $id, material: $material, lines: $lines)
    }
`

export const addRoadWaypointM = gql`
    mutation addRoadWaypoint($name: String!, $id: String!, $title: String!, $format: String!, $level: String!) {
        addRoadWaypoint(name: $name, id: $id, title: $title, format: $format, level: $level)
    }
`