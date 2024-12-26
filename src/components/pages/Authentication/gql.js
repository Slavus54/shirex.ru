import {gql} from '@apollo/client'

export const registerProfileM = gql`
    mutation registerProfile($name: String!, $email: String!, $password: String!, $region: String!, $cords: ICord!, $image: String!, $timestamp: String!) {
        registerProfile(name: $name, email: $email, password: $password, region: $region, cords: $cords, image: $image, timestamp: $timestamp) {
            shortid
            name
            region
            token
        }
    }
`

export const loginProfileM = gql`
    mutation loginProfile($name: String!, $password: String!, $timestamp: String!, $ip: String!, $token: String!) {
        loginProfile(name: $name, password: $password, timestamp: $timestamp, ip: $ip, token: $token) {
            shortid
            name
            region
            token
        }
    }
`

export const resetProfilePasswordM = gql`
    mutation resetProfilePassword($name: String!, $password: String!) {
        resetProfilePassword(name: $name, password: $password)
    }
`