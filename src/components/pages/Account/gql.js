import {gql} from '@apollo/client'

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

export const updateProfilePersonalInfoM = gql`
    mutation updateProfilePersonalInfo($id: String!, $name: String!, $image: String!) {
        updateProfilePersonalInfo(id: $id, name: $name, image: $image)
    }
`

export const updateProfileGeoInfoM = gql`
    mutation updateProfileGeoInfo($id: String!, $region: String!, $cords: ICord!) {
        updateProfileGeoInfo(id: $id, region: $region, cords: $cords)
    }
`

export const updateProfilePasswordM = gql`
    mutation updateProfilePassword($id: String!, $current_password: String!, $new_password: String!, $points: Float!) {
        updateProfilePassword(id: $id, current_password: $current_password, new_password: $new_password, points: $points)
    }
`

export const updateProfileEmailM = gql`
    mutation updateProfileEmail($id: String!, $email: String!) {
        updateProfileEmail(id: $id, email: $email)
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

export const manageProfileActM = gql`
    mutation manageProfileAct($id: String!, $option: String!, $text: String!, $category: String!, $format: String!, $level: String!, $respect: String!, $collId: String!) {
        manageProfileAct(id: $id, option: $option, text: $text, category: $category, format: $format, level: $level, respect: $respect, collId: $collId)
    }
`