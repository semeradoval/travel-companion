import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import TopicList from './pages/TopicList'
import TopicDetail from './pages/TopicDetail'
import EntryDetail from './pages/EntryDetail'
import CreateTopic from './pages/CreateTopic'
import CreateEntry from './pages/CreateEntry'
import EditTopic from './pages/EditTopic'
import EditEntry from './pages/EditEntry'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<TopicList />} />
        <Route path="/topic/create" element={<CreateTopic />} />
        <Route path="/topic/:id" element={<TopicDetail />} />
        <Route path="/topic/:id/edit" element={<EditTopic />} />
        <Route path="/entry/create" element={<CreateEntry />} />
        <Route path="/topic/:id/entry/create" element={<CreateEntry />} />
        <Route path="/topic/:id/entry/:entryId" element={<EntryDetail />} />
        <Route path="/entry/:entryId/edit" element={<EditEntry />} />
      </Routes>
    </BrowserRouter>
  )
}
