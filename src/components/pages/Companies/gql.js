import {gql} from '@apollo/client'

// query

export const getCompaniesQ = gql`
    query {
        getCompanies {
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

export const createCompanyM = gql`
    mutation createCompany($name: String!, $id: String!, $title: String!, $category: String!, $format: String!, $capitalization: Float!, $url: String!, $region: String!, $cords: ICord!) {
        createCompany(name: $name, id: $id, title: $title, category: $category, format: $format, capitalization: $capitalization, url: $url, region: $region, cords: $cords)
    }
`

export const getCompanyM = gql`
    mutation getCompany($id: String!) {
        getCompany(id: $id) {
            shortid
            name
            title
            category
            format
            capitalization
            url
            region
            cords {
                lat
                long
            }
            reviews {
                shortid
                name
                text
                criterion
                rating
                image
                dateUp
                likes
            }
            products {
                shortid
                title
                category
                status
                cost
            }
        }
    }
`

export const manageCompanyReviewM = gql`
    mutation manageCompanyReview($name: String!, $id: String!, $option: String!, $text: String!, $criterion: String!, $rating: Float!, $image: String!, $dateUp: String!, $likes: String!, $collId: String!) {
        manageCompanyReview(name: $name, id: $id, option: $option, text: $text, criterion: $criterion, rating: $rating, image: $image, dateUp: $dateUp, likes: $likes, collId: $collId)
    }
`

export const updateCompanyInformationM = gql`
    mutation updateCompanyInformation($name: String!, $id: String!, $capitalization: Float!, $url: String!) {
        updateCompanyInformation(name: $name, id: $id, capitalization: $capitalization, url: $url)
    }
`

export const manageCompanyProductM = gql`
    mutation manageCompanyProduct($name: String!, $id: String!, $option: String!, $title: String!, $category: String!, $status: String!, $cost: Float!, $collId: String!) {
        manageCompanyProduct(name: $name, id: $id, option: $option, title: $title, category: $category, status: $status, cost: $cost, collId: $collId)
    }
`