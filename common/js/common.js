const hotReload = ()=>{
    if (module.hot) {
        module.hot.accept()
    }
}

export default hotReload;