import { Icon } from "@iconify/react"

import { SideNavItem } from "./types"

export const SIDENAV_ITEMS: SideNavItem[] = [
    
    {
        title: "Materias Primas",
        path: "/materiasprimas",
        icon: <Icon icon="noto-v1:avocado" width="24" height="24"/>
    },
    {
        title: "Cadastro Materias Primas",
        path: "/cadastro-materiasprimas",
        icon: <Icon icon="noto-v1:japanese-application-button" width="24" height="24"/>
    },
    {
        title: "Cadastro Fornecedores",
        path: "/cadastro-fornecedores",
        icon: <Icon icon="noto-v1:clipboard" width="24" height="24"/>
    },
    {
        title: "Fornecedores",
        path: "/fornecedores",
        icon: <Icon icon="noto:factory" width="24" height="24"/>
    }
    
]