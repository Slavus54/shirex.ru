import {gql} from '@apollo/client'

// query

export const getOrganizationsQ = gql`
    query {
        getOrganizations {
            shortid
            name
            title
            category
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

export const createOrganizationM = gql`
    mutation createOrganization($name: String!, $id: String!, $title: String!, $category: String!, $format: String!, $region: String!, $cords: ICord!, $image: String!) {
        createOrganization(name: $name, id: $id, title: $title, category: $category, format: $format, region: $region, cords: $cords, image: $image)
    }
`

export const getOrganizationM = gql`
    mutation getOrganization($id: String!) {
        getOrganization(id: $id) {
            shortid
            name
            title
            category
            format
            region
            cords {
                lat
                long
            }
            image
            opinions {
                shortid
                name
                text
                employee
                level
                dateUp
                likes
            }
            rates {
                shortid
                name
                salary
                ratio
                percent
            }
        }
    }
`

export const manageOrganizationOpinionM = gql`
    mutation manageOrganizationOpinion($name: String!, $id: String!, $option: String!, $text: String!, $employee: String!, $level: String!, $dateUp: String!, $likes: String!, $collId: String!) {
        manageOrganizationOpinion(name: $name, id: $id, option: $option, text: $text, employee: $employee, level: $level, dateUp: $dateUp, likes: $likes, collId: $collId)
    }
`

export const updateOrganizationPhotographyM = gql`
    mutation updateOrganizationPhotography($name: String!, $id: String!, $image: String!) {
        updateOrganizationPhotography(name: $name, id: $id, image: $image)
    }
`

export const publishOrganizationRateM = gql`
    mutation publishOrganizationRate($name: String!, $id: String!, $salary: Float!, $ratio: Float!, $percent: Float!) {
        publishOrganizationRate(name: $name, id: $id, salary: $salary, ratio: $ratio, percent: $percent)
    }
`