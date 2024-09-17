import React from 'react'
import {Box, Button, Divider, IconButton} from '@mui/joy'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/joy'

export type SidebarItem = {
    label:string, 
    path:string, 
    icon: React.JSX.Element, 
    isQuickNav:boolean,
}

export const Sidebar = ({sidebarItems, curLabel, onSelect}:{sidebarItems:SidebarItem[], curLabel:string, onSelect:(label:string)=>void}) => {
    const buttonStyle:React.CSSProperties = {
        display: 'flex', 
        justifyContent: 'flex-start', 
        width: '100%',
    }
    
    return <Box display={'flex'} flexDirection={'column'} gap={2} height={'100%'} border={'solid'} padding={1}>
        <Typography level='title-lg'>Quick Links</Typography>
        {sidebarItems.filter(item => item.isQuickNav).map((item, itemI) => 
            <Link key={itemI} to={item.path} style={{textDecorationLine: 'none'}}>
                <IconButton 
                sx={buttonStyle}
                onClick={() => onSelect(item.label)}
                color={curLabel === item.label ? 'primary' : 'neutral'} 
                >{item.icon}{item.label}</IconButton>
            </Link>
        )}
        <Divider />
        <Typography level='title-lg'>Notebooks</Typography>
        {sidebarItems.filter(item => !item.isQuickNav).map((item, itemI) => 
            <Link key={itemI} to={item.path} style={{textDecorationLine: 'none'}}>
                <IconButton 
                sx={buttonStyle}
                onClick={() => onSelect(item.label)}
                color={curLabel === item.label ? 'primary' : 'neutral'}>{item.icon}{item.label}</IconButton>
            </Link>
        )}
    </Box>
}