import { Box, IconButton, Input } from '@mui/joy'
import React from 'react'
import { NotebookType } from '../util/types'
import { Typography } from '@mui/joy'
import { CloseOutlined } from '@mui/icons-material'


export const AllNotebooksPage = () => { 
    const [notebooks, setNotebooks] = React.useState([] as NotebookType[])
    const [searchFilter, setSearchFilter] = React.useState<string>()

    const handleUpdateSearch = (filter:string|undefined) => {
        setSearchFilter(filter);

        fetch(`http://127.0.0.1:8000/notebook?filter=${filter}`)
        .then(resp => resp.json())
        .then(respJson => {
            if(respJson.success){
                setNotebooks(respJson.data)
                console.log(respJson.data);
            }
        })
    }

    React.useEffect(()=>{
        fetch(`http://127.0.0.1:8000/notebook`)
            .then(resp => resp.json())
            .then(respJson => {
                if(respJson.success){
                    setNotebooks(respJson.data)
                    console.log(respJson.data);
                }
            })
    }, [])

    return <Box width={'100%'} height={'100%'} display={'flex'} flexDirection={'column'} gap={2}> 
        {/* banner */}
        <Box display={'inline-grid'} width={'100%'}>
            <Typography level='h1'>All Notebooks</Typography>
            <Input onKeyDown={(ev) => {
                if(ev.key == 'Enter' && ev.currentTarget.value.trim() != ""){
                    handleUpdateSearch(ev.currentTarget.value.trim())
                    ev.currentTarget.value = "";
                }
            }} />
            {searchFilter && <Box width={'100%'} display={'inline-list-item'} alignItems={'center'}>
                <IconButton onClick={() => handleUpdateSearch(undefined)}><CloseOutlined /></IconButton>
                <Typography>{`Showing search results for "${searchFilter}"`}</Typography>
            </Box>}
        </Box>

        <Box display={'grid'} 
            gridTemplateColumns={'repeat(auto-fill, minmax(200px, 350px))'}
            gridAutoRows={'300px'}
            width={'100%'} height={'100%'} border={'solid'} overflow={'scroll'}
            justifyContent={'space-evenly'}
            padding={2} gap={2}
             sx={{overflowX: 'hidden'}}>
            {notebooks.map((notebook, notebookI) => <NotebookPreview notebook={notebook} key={notebookI} />)}
        </Box>
    </Box>
}

const NotebookPreview = ({notebook}:{notebook:NotebookType}) => {
    return <Box position={'relative'} display={'grid'}  padding={2} 
        sx={{backgroundImage: `url(${notebook.bannerImg})`, backgroundSize: 'contain'}}
        onClick={() => window.location.href = `http://127.0.0.1:3000/notebook/${notebook._id}`}
    >
        <Typography level='title-lg'>{notebook.title}</Typography>
    </Box>
}