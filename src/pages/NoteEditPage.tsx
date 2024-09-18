import { Box, Chip, ChipDelete, IconButton, Input, Typography } from '@mui/joy'
import React, { useState } from 'react'
import { NotebookType, NoteType } from '../util/types'
import { Outlet, useParams } from 'react-router'
import { MoreHorizOutlined, Notes } from '@mui/icons-material'
import { dateToString } from '../util/utils'
import { RichTextEditor } from '../components/RichTextEditor'

const autosaveThres:number = 1000 * 1;

export const NoteEditPage = () => {
    const {notebookId, noteId} = useParams()
    const [notebook, setNotebook] = React.useState({} as NotebookType)
    const [note, setNote] = React.useState<NoteType>()
    const [autosave, setAutosave] = React.useState<NodeJS.Timeout>(); 

    const tagInputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        (async() => {
            let respJson = await(await fetch(`http://127.0.0.1:8000/notebook?ids=${notebookId}`)).json()
            if(Object.hasOwn(respJson, 'data') && respJson['data'].length > 0){
                setNotebook(respJson['data'][0])
            }

            respJson = await(await fetch(`http://127.0.0.1:8000/note?noteId=${noteId}`)).json()
            if(Object.hasOwn(respJson, 'data') && respJson['data'].length > 0){
                setNote(respJson['data'][0])
            }
        })()
    }, [noteId])

    const handleSaveNote = (savedNote:NoteType) => {
        if(autosave) clearTimeout(autosave)
        
        setAutosave(setTimeout(() => {
            console.log("autosaving...")
            console.log(savedNote);
            
            ;(async () => {
                const tmp = await fetch(`http://127.0.0.1:8000/note?noteId=${savedNote._id}`, {
                    body: JSON.stringify({
                        title: savedNote.title, 
                        text: savedNote.text, 
                        tags: savedNote.tags,
                        updated: savedNote.updated, 
                    }), 
                    headers: {"Content-Type": 'application/json'},
                    method: 'post'
                })
            })()

            setAutosave(undefined)
        }, autosaveThres))
    }


    const handleNoteUpdate = ({title, text, tag}:{title?:string, text?:string, tag?:string|string[]}) => {
        const updatedNote = Object.assign({}, note); 
        if(title) updatedNote.title = title; 
        if(text) updatedNote.text = text;
        if(tag) updatedNote.tags = typeof(tag) == 'string' ? [...updatedNote.tags, tag] : tag
        updatedNote.updated = new Date();
        setNote(updatedNote); 
        handleSaveNote(updatedNote);
    }   

    const handleTagDelete = (delIndex:number) => {
        const updatedTagList = note?.tags.filter((_, tagI) => tagI != delIndex); 
        handleNoteUpdate({tag: updatedTagList})
    }

    return <>{note && <Box display={'flex'} flexDirection={'column'} width={'100%'} height={'100%'} gap={1} >
        <Box display={'grid'} gridTemplateColumns={'1fr auto'} gridTemplateRows={'auto'} width={'100%'} gap={1}>
            <Input placeholder={note.title} onChange={(ev) => handleNoteUpdate({title: ev.target.value})}/>
            <IconButton><MoreHorizOutlined /></IconButton>
            <Typography level='body-sm'>{`Last Edited ${ dateToString(note.updated)}`}</Typography>
        </Box>

        <RichTextEditor style={{resize: 'none', height: '100%'}} text={note.text} onChange={(ev) => handleNoteUpdate({text: ev.target.value})}/>

        <Box display={'inline-list-item'} gap={1}>
            {note.tags.map((tag, tagI) => <Chip sx={{display: 'inline-grid', margin: 1}}>{tag}<ChipDelete onDelete={() => handleTagDelete(tagI)} key={tagI}/></Chip>)}
            <Input placeholder='Add Tag' 
                onKeyDown={(ev) => {
                    if(ev.key == 'Enter'){
                        if(ev.currentTarget.value.trim() != '') handleNoteUpdate({tag: ev.currentTarget.value})
                        ev.currentTarget.value = ''
                    }
                }}
            />
        </Box>
    </Box>}</>
}