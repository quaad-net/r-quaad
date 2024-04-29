import { assocCharts } from './assocCharts.js'

export async function getPosts(){

    //const getBaseURL = (document.baseURI).replace('test', '')
    //const allPostsReq = await fetch(getBaseURL + 'fiscal/posts/getposts')
    const allPostsReq = await fetch('posts/getposts')
    const allPostsTxt = await allPostsReq.text()
    const postsData = JSON.parse(allPostsTxt)
    const allPosts = JSON.parse(postsData[0])
    let scriptID
    const ht = document.querySelector('html')
    //const myURL = (ht.baseURI).replace('/test/', '')
    let appdPost = document.querySelector('.append-post')

    // Loops through posts data and updates HTML
    for (const idx in allPosts){
        const postDiv = document.createElement('div')
        const appendPostDiv = document.createElement('div')
        appendPostDiv.setAttribute('class', 'append-post')
        let myCharts
        postDiv.innerHTML =`
        <div class="post-details-container">
            <div class="post-details">
                <div class="post-date">Date:</br>${allPosts[idx]['post_date']}</div></br>
            </div>
            <div class="post-title-container">
                <div class="post-title">${allPosts[idx]['title']}</div>
                <div class="post-description">${allPosts[idx]['post_description']}</div>
            </div>
        </div>
        <div class="content-container">
            <div class="post-post">${allPosts[idx]['post']}</div>
        </div>
        <div class="chart-n-details">
            <div class="post-chart-container">
                <canvas class="post-chart"></canvas>
            </div>
            <div class="post-chart-details-container">
                <canvas class="post-chart-details"></canvas>
            </div>   
        </div>
        `
        // Adds element to append additional posts to 
        postDiv.append(appendPostDiv);

        scriptID = `${allPosts[idx]['script_id']}`
        let myScriptNum = parseInt(scriptID)
        let canvasElem = postDiv.querySelector('.post-chart')
        let canvasElem2 = postDiv.querySelector('.post-chart-details')

        async function getChartScripts(scriptID, canvas, canvas2){
        const chartData = await fetch(`posts/charts-${scriptID}`)
            const chartDataTxt = await chartData.text()
            const chartDataJsn = JSON.parse(chartDataTxt)
            myCharts = assocCharts(scriptID, chartDataJsn, canvas, canvas2)
        }
        getChartScripts(myScriptNum, canvasElem, canvasElem2)

        // Appends postDiv to last appdPost. Reassigns appdPost.
        appdPost.append(postDiv)
        appdPost = postDiv.querySelector('.append-post')
    }
    window.scrollTo(0, 0)
}