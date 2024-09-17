import { AddBoxOutlined, MoreHorizOutlined } from '@mui/icons-material'
import { Box, Button, Chip, ChipDelete, Dropdown, IconButton, Input, Menu, MenuButton, MenuItem } from '@mui/joy'
import { Typography } from '@mui/joy'
import React from 'react'
import { Outlet, useParams, Link, useLocation } from 'react-router-dom';
import { NotebookType, NoteType } from '../util/types'
import { dateToString } from '../util/utils';

export const NotebookPage = () => {
    const {notebookId} = useParams()
    const [notebook, setNotebook] = React.useState({} as NotebookType)
    const [notes, setNotes] = React.useState([] as NoteType[])
    const [searchFilter, setSearchFilter] = React.useState<string>()
    const isNoteSelected = useLocation().pathname.split('/').length > 3; 

    const handleFilterUpdate = (newSearchFilter:string|undefined) => {
        setSearchFilter(newSearchFilter); 

        fetch(`http://127.0.0.1:8000/note?notebookId=${notebookId}&filter=${newSearchFilter}`)
            .then(resp => resp.json())
            .then(respJson => {
                if(Object.hasOwn(respJson, 'data')){
                    setNotes(respJson['data'])
                    console.log(respJson['data'])
                }
            })
    }

    React.useEffect(() => {
        ;(async() => {

            let respJson = await(await fetch(`http://127.0.0.1:8000/notebook?ids=${notebookId}`)).json()
            if(Object.hasOwn(respJson, 'data') && respJson['data'].length > 0){
                setNotebook(respJson['data'][0])
            }

            respJson = await(await fetch(`http://127.0.0.1:8000/note?notebookId=${notebookId}`)).json()
            if(Object.hasOwn(respJson, 'data')){
                setNotes(respJson['data'])
                console.log(respJson['data'])
            }
        })()
    }, [notebookId, isNoteSelected])

    const handleRename = (newTitle:string) => {
        const updatedNotebook = Object.assign({}, notebook); 
        updatedNotebook.title = newTitle
        const requestInit:RequestInit = {
            method: 'post',
            headers: {'Content-Type':'application/json'}, 
            body: JSON.stringify({
                title: newTitle, 
                notebookBannerImg: updatedNotebook.bannerImg
            })
        }

        fetch(`http://127.0.0.1:8000/notebook?notebookId=${updatedNotebook._id}`, requestInit)
            .then(resp => resp.json())
            .then(respJson => {
                if(respJson.success) setNotebook(updatedNotebook)
            })
    }

    const handleDelete = () => {
        console.log("Attempting delete...")
        const requestInit:RequestInit = {
            method: 'delete',
            headers: {'Content-Type':'application/json'}
        }
        
        fetch(`http://127.0.0.1:8000/notebook?ids=${notebookId}`, requestInit)
            .then(resp => resp.json())
            .then(respJson => {
                if(respJson.success) window.location.href = 'http://127.0.0.1:3000/'
            })
    }

    return <Box display={'flex'} flexDirection={'column'} gap={1} height={'100%'} position={'relative'}>
        <NoteBanner notebook={notebook} expand={isNoteSelected} onDelete={handleDelete} onRename={handleRename}
            searchFilter={searchFilter} setSearchFilter={handleFilterUpdate}   
        />

        {
            isNoteSelected ? 
            <Outlet />: 
            <Box display={'inline-grid'} gap={2} overflow={'scroll'} sx={{overflowX: 'hidden'}} >
                {notes.map((note, noteI) => 
                    <NotePreview key={noteI} note={note} 

                    onClick={() => {
                        window.location.href = `http://127.0.0.1:3000/notebook/${notebookId}/note/${note._id}`
                    }}

                    onDelete={() => {
                        fetch(`http://127.0.0.1:8000/note?ids=${note._id}`, {method: 'delete'})
                            .then(resp => resp.json())
                            .then(respJson => {
                                if(respJson.success)
                                    setNotes(notes.filter((curNote) => curNote._id != note._id))
                            })
                    }}
                    
                    />
                )}

                <Button sx={{
                        height: '100px', position: 'absolute', bottom: 0, right: 0
                    }} color='success'
                    onClick={() => {
                        const requestInit:RequestInit = {
                            method: 'post', 
                            body: JSON.stringify({
                                notebooks: [notebookId]
                            }), 
                            headers: {"Content-Type": 'application/json'}
                        }

                        fetch("http://127.0.0.1:8000/note", requestInit)
                            .then(resp => resp.json())
                            .then(respJson => {
                                console.log(respJson)
                                if(respJson.success && respJson.data && respJson.data.id)
                                    window.location.href = `http://127.0.0.1:3000/notebook/${notebookId}/note/${respJson.data.id}`
                            })
                    }}
                >
                    <AddBoxOutlined/> <Typography textColor={'white'} level='body-lg'>Add Note</Typography>
                </Button>
            </Box>
        }

    
    </Box>
}

const NoteBanner = (
        {notebook, expand, onRename, onDelete, searchFilter, setSearchFilter}
        :{searchFilter:string|undefined, setSearchFilter:(f:string|undefined)=>void, notebook:NotebookType, expand:boolean, onRename:(newName:string)=>void, onDelete:()=>void}) => {
    const [isEditing, setIsEditing] = React.useState(false);

    return <Box display={'flex'} flexWrap={'wrap'} sx={{ backgroundImage: `url(${notebook.bannerImg})`}}
        padding={1} gap={1} border={'solid'}
        marginBottom={2}
        height={expand ? 'auto' : '200px'}
    >  
        {expand ? 
        <Typography level='h4' sx={{flex: '1 1 auto'}} height={'auto'}>{notebook.title}</Typography>
            :
        <> 
            <Input onKeyDown={(ev) => {
                if(ev.key == 'Enter' && ev.currentTarget.value.trim() != ''){
                    setSearchFilter(ev.currentTarget.value.trim())
                    ev.currentTarget.value = "";
                }
            }} sx={{flex: '3 1 auto'}}/>
            <Dropdown>
                <MenuButton sx={{flex: '0 0 auto'}}>
                    <MoreHorizOutlined />
                </MenuButton>
                <Menu>
                    <MenuItem onClick={() => setIsEditing(true)}>Rename</MenuItem>
                    <MenuItem onClick={onDelete}>Delete</MenuItem>
                </Menu>
            </Dropdown>
            {searchFilter && <Typography sx={{width: '100%'}}>
                {`Showing results for "${searchFilter}"`}
                <Button onClick={() => setSearchFilter(undefined)}>x</Button>
                </Typography>}
            {
                isEditing ? 
                <Input sx={{width: '100%', height: '75%'}} placeholder={notebook.title} 
                    onKeyDown={(ev) => {
                        if(ev.key == 'Enter' && ev.currentTarget.value.trim() != ''){
                            onRename(ev.currentTarget.value)
                            setIsEditing(false)
                        }
                    }}
                />
                : <Typography onDoubleClick={()=>setIsEditing(true)} onBlur={() => setIsEditing(false)} 
                    level='h1' width={"100%"} height={'100%'} >{notebook.title}</Typography>
            }
        </>}
    </Box>
}


const NotePreview = ({note, onClick, onDelete}:{note:NoteType, onClick:()=>void, onDelete:()=>void}) => {


    return <Box display={'grid'} gridTemplateRows={'auto auto auto'} border={'solid'} padding={2} gap={1} 
    onClick={(ev) => {
        if((ev.target as HTMLElement).closest(".ignoreClick")) return; 
        onClick()  
    }}>

        {/* Banner */}
        <Box display={'flex'} width={"100%"} justifyContent={'space-between'} gap={1} alignItems={'center'}>
            <Typography level='title-lg' sx={{marginRight: "auto"}}>{note.title}</Typography>
            <Typography level='title-sm'>{`Last Edited ${dateToString(note.updated)}`}</Typography>
            <Dropdown>
                <MenuButton className='ignoreClick'><MoreHorizOutlined /></MenuButton>
                <Menu className='ignoreClick'>
                    <MenuItem onClick={onClick}>Edit</MenuItem>
                    <MenuItem onClick={onDelete}>Delete</MenuItem>
                </Menu>
            </Dropdown>
            
        </Box>


        {/* Content */}
        <Typography minHeight={100} level='body-sm'
            sx={{
                backgroundColor: 'lightgray',
                padding: 1, 
                borderRadius: 8
            }}
        >{note.text}</Typography>

        {/* Footer */}
        <Box display={'flex'} gap={1}>
            {note.tags && note.tags.map((tag, tagI) => <Chip key={tagI}>{tag}</Chip>)}
        </Box>
    </Box>
}