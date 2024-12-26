// Static Pages

import Account from '@/components/head/Account'
import Welcome from '@/components/head/Welcome'
import History from '@/components/pages/History/History'
import Helper from '@/components/pages/Helper/Helper'

// Authentication's Components

import Register from '@/components/pages/Authentication/Register'
import Login from '@/components/pages/Authentication/Login'

// Block's Components

import CreateBlock from '@/components/pages/Blocks/CreateBlock'
import Blocks from '@/components/pages/Blocks/Blocks'
import Block from '@/components/pages/Blocks/Block'

// Yard's Components

import CreateYard from '@/components/pages/Yards/CreateYard'
import Yards from '@/components/pages/Yards/Yards'
import Yard from '@/components/pages/Yards/Yard'

// Road's Components

import CreateRoad from '@/components/pages/Roads/CreateRoad'
import Roads from '@/components/pages/Roads/Roads'
import Road from '@/components/pages/Roads/Road'

// Building's Components

import CreateBuilding from '@/components/pages/Buildings/CreateBuilding'
import Buildings from '@/components/pages/Buildings/Buildings'
import Building from '@/components/pages/Buildings/Building'

// Walking's Components

import CreateWalking from '@/components/pages/Walkings/CreateWalking'
import Walkings from '@/components/pages/Walkings/Walkings'
import Walking from '@/components/pages/Walkings/Walking'

// Company's Components

import CreateCompany from '@/components/pages/Companies/CreateCompany' 
import Companies from '@/components/pages/Companies/Companies'
import Company from '@/components/pages/Companies/Company'

// Organization's Components

import CreateOrganization from '@/components/pages/Organizations/CreateOrganization'
import Organizations from '@/components/pages/Organizations/Organizations'
import Organization from '@/components/pages/Organizations/Organization'

// Family's Components

import CreateFamily from '@/components/pages/Families/CreateFamily'
import Families from '@/components/pages/Families/Families'
import Family from '@/components/pages/Families/Family'

// Profile's Components

import Profiles from '@/components/pages/Profiles/Profiles'
import Profile from '@/components/pages/Profiles/Profile'

import {RouteItem} from './types'

export const items: RouteItem[] = [
    {
        title: 'Главная',
        url: '/',
        component: Account,
        isUserAuth: true,
        inMenuExist: true
    },
    {
        title: 'Главная',
        url: '/',
        component: Welcome,
        isUserAuth: false,
        inMenuExist: true
    },
    {
        title: '',
        url: '/history',
        component: History,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/helper',
        component: Helper,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: 'Кварталы',
        url: '/blocks',
        component: Blocks,
        isUserAuth: true,
        inMenuExist: true
    },
    {
        title: 'Газоны',
        url: '/yards',
        component: Yards,
        isUserAuth: true,
        inMenuExist: true
    },
    {
        title: 'Дороги',
        url: '/roads',
        component: Roads,
        isUserAuth: true,
        inMenuExist: true
    },
    {
        title: 'Здания',
        url: '/buildings',
        component: Buildings,
        isUserAuth: true,
        inMenuExist: true
    },
    {
        title: 'Прогулки',
        url: '/walkings',
        component: Walkings,
        isUserAuth: true,
        inMenuExist: true
    },
    {
        title: 'Компании',
        url: '/companies',
        component: Companies,
        isUserAuth: true,
        inMenuExist: true
    },
    {
        title: 'Организации',
        url: '/organizations',
        component: Organizations,
        isUserAuth: true,
        inMenuExist: true
    },
    {
        title: 'Семьи',
        url: '/families',
        component: Families,
        isUserAuth: true,
        inMenuExist: true
    },
    {
        title: 'Пользователи',
        url: '/profiles',
        component: Profiles,
        isUserAuth: true,
        inMenuExist: true
    },
    {
        title: '',
        url: '/register/:inviteName',
        component: Register,
        isUserAuth: false,
        inMenuExist: false
    },
    {
        title: '',
        url: '/login',
        component: Login,
        isUserAuth: false,
        inMenuExist: false
    },
    {
        title: '',
        url: '/profile/:id',
        component: Profile,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/create-block/:id',
        component: CreateBlock,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/block/:id',
        component: Block,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/create-yard/:id',
        component: CreateYard,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/yard/:id',
        component: Yard,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/create-road/:id',
        component: CreateRoad,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/road/:id',
        component: Road,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/create-building/:id',
        component: CreateBuilding,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/building/:id',
        component: Building,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/create-walking/:id',
        component: CreateWalking,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/walking/:id',
        component: Walking,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/create-company/:id',
        component: CreateCompany,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/company/:id',
        component: Company,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/create-organization/:id',
        component: CreateOrganization,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/organization/:id',
        component: Organization,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/create-family/:id',
        component: CreateFamily,
        isUserAuth: true,
        inMenuExist: false
    },
    {
        title: '',
        url: '/family/:id',
        component: Family,
        isUserAuth: true,
        inMenuExist: false
    }
]