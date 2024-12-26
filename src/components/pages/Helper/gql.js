import {gql} from '@apollo/client'

export const sendHelperEmailM = gql`
    mutation sendHelperEmail($id: String!, $text: String!, $category: String!, $rating: Float!, $dateUp: String!) {
        sendHelperEmail(id: $id, text: $text, category: $category, rating: $rating, dateUp: $dateUp)
    }
`