import AccountPersonalPage from '@/components/pages/Account/parts/AccountPersonalPage'
import AccountGeoPage from '@/components/pages/Account/parts/AccountGeoPage'
import AccountSecurityPage from '@/components/pages/Account/parts/AccountSecurityPage'
import AccountEmailPage from '@/components/pages/Account/parts/AccountEmailPage'
import AccountSkillsPage from '@/components/pages/Account/parts/AccountSkillsPage'
import AccountPostsPage from '@/components/pages/Account/parts/AccountPostsPage'
import AccountActsPage from '@/components/pages/Account/parts/AccountActsPage'
import AccountTaxCalculatorPage from '@/components/pages/Account/parts/AccountTaxCalculatorPage'
import AccountCollectionsPage from '@/components/pages/Account/parts/AccountCollectionsPage'

import {AccountPart} from './types'

export const parts: AccountPart[] = [
    {
        url: './profile/account.png',
        component: AccountPersonalPage
    },
    {
        url: './profile/geo.png',
        component: AccountGeoPage
    },
    {
        url: './profile/security.png',
        component: AccountSecurityPage
    },
    {
        url: './profile/email.png',
        component: AccountEmailPage
    },
    {
        url: './profile/skills.png',
        component: AccountSkillsPage
    },
    {
        url: './profile/posts.png',
        component: AccountPostsPage
    },
    {
        url: './profile/acts.png',
        component: AccountActsPage
    },
    {
        url: './profile/tax.png',
        component: AccountTaxCalculatorPage
    },
    {
        url: './profile/collections.png',
        component: AccountCollectionsPage
    }
]