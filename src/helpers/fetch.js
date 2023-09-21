async function fetchData (url) {
    try {
        let res = await fetch(url)
        return await res.json ()
    } catch (e) {
        console.log (e)
        return []
    }

}

export {fetchData}