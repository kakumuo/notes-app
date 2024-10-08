import React from 'react'
import {Box, Button, Divider, IconButton, Input} from '@mui/joy'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/joy'
import { AddOutlined } from '@mui/icons-material'

export type SidebarItem = {
    label:string, 
    path:string, 
    icon: React.JSX.Element, 
    isQuickNav:boolean,
}

export const Sidebar = (
        {sidebarItems, curLabel, onSelect, onUpdateNotebookList}:
        {sidebarItems:SidebarItem[], curLabel:string, onSelect:(label:string)=>void, 
            onUpdateNotebookList:(operation:'add'|'update'|'delete', notebookName?:string, notebookId?:string)=>void}
    ) => {
    const buttonStyle:React.CSSProperties = {
        display: 'flex', 
        justifyContent: 'flex-start', 
        width: '100%',
    }

    const [isAddingNotebook, setIsAddingNotebook] = React.useState(false); 
    const addNoteRef = React.createRef<HTMLInputElement>();
    
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
        <Box display={'inline-list-item'} justifyContent={'space-between'} width={'100%'} alignItems={'center'}>
            <Typography level='title-lg'>Notebooks </Typography>
            <IconButton onClick={() => setIsAddingNotebook(true)}><AddOutlined /></IconButton>
        </Box>
    
        {isAddingNotebook && <Input autoFocus ref={addNoteRef} placeholder='Add new notebook...' 
            onBlur={() => setIsAddingNotebook(false)} 
            onKeyDown={(ev) => {
                if(ev.key == 'Enter' && ev.currentTarget.value.trim() != ""){
                    onUpdateNotebookList('add', ev.currentTarget.value.trim())
                    ev.currentTarget.value = ""
                    setIsAddingNotebook(false)
                }
            }}
        />}
        <Box width={'100%'} height={'100%'} display={'flex'} gap={2} flexDirection={'column'} sx={{overflowY: 'scroll'}}>
            {sidebarItems.filter(item => !item.isQuickNav).map((item, itemI) => 
                <Link key={itemI} to={item.path} style={{textDecorationLine: 'none'}}>
                    <IconButton 
                    sx={buttonStyle}
                    onClick={() => onSelect(item.label)}
                    color={curLabel === item.label ? 'primary' : 'neutral'}>{item.icon}{item.label}</IconButton>
                </Link>
            )}
        </Box>

    </Box>
}