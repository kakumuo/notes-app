import React from 'react';
import { Sidebar, SidebarItem } from './components/Sidebar';
import { ArchiveOutlined, BookOutlined, CalendarTodayOutlined, LibraryBooksOutlined, NoteOutlined } from '@mui/icons-material';
import { Box } from '@mui/joy';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import { AllNotebooksPage } from './pages/AllNotesPage';
import { CalendarPage } from './pages/CalendarPage';
import { NotebookPage } from './pages/NotebookPage';
import { NotebookType } from './util/types';
import { NoteEditPage } from './pages/NoteEditPage';


const NotImplemented = <div style={{border:'solid'}}>Not Implemented</div>
const serverPath = "http://127.0.0.1:8000"

const quickNavItems = [
  {label: 'Notebooks', path: '/', icon: <LibraryBooksOutlined />, isQuickNav: true},
  {label: 'Calendar', path: '/calendar', icon: <CalendarTodayOutlined />, isQuickNav: true},
]

function App() {
  const [targetNavLabel, setTargetNavLabel] = React.useState(quickNavItems[0].label)
  const [sidebarItems, setSidebarItems] = React.useState([...quickNavItems])
  
  const handleNotebookUpdate = (operation:'add'|'update'|'delete', notebookName?:string, notebookId?:string) => {
    const requestInit:RequestInit = {
      method: operation == 'delete' ? 'delete' : 'post', 
      headers: {'Content-Type': 'application/json'}
    }

    if(operation != 'delete')
      requestInit.body = JSON.stringify({title: notebookName})

    fetch(`${serverPath}/notebook`, requestInit)
      .then(resp => resp.json())
      .then(respJson => {
        const notebooks = respJson['data'].map((item:any) => {
          return {
            label: notebookName, path: `/notebook/${item.id}`, icon: <BookOutlined />, isQuickNav: false
          }
        })
  
        setSidebarItems([...sidebarItems, ...notebooks])
      })
  }

  React.useEffect(() => {
    (async() => {
      const json = await(await fetch(`${serverPath}/notebook`)).json()
      
      const notebooks = json['data'].map((item: NotebookType) => {
        return {
          label: item.title, path: `/notebook/${item._id}`, icon: <BookOutlined />, isQuickNav: false
        }
      })

      setSidebarItems([...quickNavItems, ...notebooks])
    })()
  }, [])

  const handleSidebarSelect = (label:string) => {
    setTargetNavLabel(label)
  }

  return <Box display={'grid'} gridTemplateColumns={'15% auto'} gridTemplateRows={'100%'} height={'100vh'} maxHeight={'100vh'}
    padding={2} gap={2}
    border={'solid'}
  >
    <Router>
      <Sidebar curLabel={targetNavLabel} onSelect={handleSidebarSelect} onUpdateNotebookList={handleNotebookUpdate} sidebarItems={sidebarItems} />
      <Routes>
        <Route path='/' element={<AllNotebooksPage />} />
        <Route path='/calendar' element={<CalendarPage />} />
        <Route path='/notebook/:notebookId' element={<NotebookPage />}>
          <Route path='note/:noteId' element={<NoteEditPage />} />
        </Route>
      </Routes>
    </Router>
  </Box>
}

export default App;
