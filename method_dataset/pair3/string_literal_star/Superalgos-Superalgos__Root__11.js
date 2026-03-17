const Root = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App/>}>
                    <Route path='' element={<Feed/>}/>
                    <Route path='profile' element={<UserProfile/>}>
                        <Route path=':userId' element={<UserProfile/>}/>
                    </Route>
                    <Route path='postPlaceholder' element={<PostPlaceholder/>}/>
                    <Route path={'post'} element={<ReplyFeed/>}/> {/* TODO handle this post data*/}
                </Route>
                <Route path='/signUp' element={<Signup/>}/>
                <Route
                    path="*"
                    element={
                        <NotFound/>
                    }
                />
            </Routes>
        </BrowserRouter>)
}
