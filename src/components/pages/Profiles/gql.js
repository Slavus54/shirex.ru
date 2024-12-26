import {gql} from '@apollo/client'

// query

export const getProfilesQ = gql`
    query {
        getProfiles {
            shortid
            name
            region
            cords {
                lat
                long
            }
        }
    }
`


// mutations

export const getProfileM = gql`
    mutation getProfile($id: String!) {
        getProfile(id: $id) {
            shortid
            name
            email
            password
            region
            cords {
                lat
                long
            }
            image
            timestamp
            skills {
                shortid
                text
                category
                rate
                image
                likes
            }
            posts {
                shortid
                text
                category
                territory
                image
                rating
                dateUp
            }
            acts {
                shortid
                text
                category
                format
                level
                respect
            }
            components {
                shortid
                title
                url
            }
        }
    }
`


export const manageProfileSkillM = gql`
    mutation manageProfileSkill($id: String!, $option: String!, $text: String!, $category: String!, $rate: Float!, $image: String!, $likes: String!, $collId: String!) {
        manageProfileSkill(id: $id, option: $option, text: $text, category: $category, rate: $rate, image: $image, likes: $likes, collId: $collId)
    }
`

export const manageProfilePostM = gql`
    mutation manageProfilePost($id: String!, $option: String!, $text: String!, $category: String!, $territory: String!, $image: String!, $rating: Float!, $dateUp: String!, $collId: String!) {
        manageProfilePost(id: $id, option: $option, text: $text, category: $category, territory: $territory, image: $image, rating: $rating, dateUp: $dateUp, collId: $collId)
    }
`