import {gql} from '@apollo/client'

// query

export const getFamiliesQ = gql`
    query {
        getFamilies {
            shortid
            name
            title
            category
            religion
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

export const createFamilyM = gql`
    mutation createFamily($name: String!, $id: String!, $title: String!, $category: String!, $religion: String!, $century: String!, $region: String!, $cords: ICord!, $honor: Float!) {
        createFamily(name: $name, id: $id, title: $title, category: $category, religion: $religion, century: $century, region: $region, cords: $cords, honor: $honor)
    }
`

export const getFamilyM = gql`
    mutation getFamily($id: String!) {
        getFamily(id: $id) {
            shortid
            name
            title
            category
            religion
            century
            region
            cords {
                lat
                long
            }
            honor
            notes {
                shortid
                title
                category
                relative
                image
                dateUp
                likes
            }
            questions {
                shortid
                name
                text
                format
                reply
                isAnswered
            }
        }
    }
`

export const manageFamilyNoteM = gql`
    mutation manageFamilyNote($name: String!, $id: String!, $option: String!, $title: String!, $category: String!, $relative: String!, $image: String!, $dateUp: String!, $likes: String!, $collId: String!) {
        manageFamilyNote(name: $name, id: $id, option: $option, title: $title, category: $category, relative: $relative, image: $image, dateUp: $dateUp, likes: $likes, collId: $collId)
    }
`

export const giveFamilyHonorM = gql`
    mutation giveFamilyHonor($name: String!, $id: String!, $honor: Float!) {
        giveFamilyHonor(name: $name, id: $id, honor: $honor)
    }
`

export const manageFamilyQuestionM = gql`
    mutation manageFamilyQuestion($name: String!, $id: String!, $option: String!, $text: String!, $format: String!, $reply: String!, $isAnswered: Boolean!, $collId: String!) {
        manageFamilyQuestion(name: $name, id: $id, option: $option, text: $text, format: $format, reply: $reply, isAnswered: $isAnswered, collId: $collId)
    }
`