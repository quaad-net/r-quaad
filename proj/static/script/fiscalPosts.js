import { assocCharts } from './assocCharts.js'

export async function getPosts(){

    const allPostsReq = await fetch('posts/getposts')
    const allPostsTxt = await allPostsReq.text()
    const postsData = JSON.parse(allPostsTxt)
    const allPosts = JSON.parse(postsData[0])
    let scriptID, postID
    const ht = document.querySelector('html')
    let appdPost = document.querySelector('.append-post')
    let id = 0

    // Loops through posts data and updates DOM
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
            </div>
            <div class="post-chart-details-container">
            </div>   
        </div>
        <div class="chart-footer-data"></div>
        `

        // Adds element to append additional posts to 
        postDiv.append(appendPostDiv);

        scriptID = `${allPosts[idx]['script_id']}`
        let myScriptNum = parseInt(scriptID)
        postID = `${allPosts[idx]['id']}`

        const cv1 = document.createElement('canvas')
        cv1.setAttribute('class', "post-chart")
        id += 1
        cv1.setAttribute('id', `cnvs-${id}`)
        const canvasElem = cv1
        
        const cv2 = document.createElement('canvas')
        cv2.setAttribute('class', 'post-chart-details')
        id += 1
        cv2.setAttribute('id', `cnvs-${id}`)
        const canvasElem2 = cv2
       
        const cht_cont_1 = postDiv.querySelector('.post-chart-container')
        cht_cont_1.appendChild(cv1)
        const cht_cont_2 = postDiv.querySelector('.post-chart-details-container')
        cht_cont_2.appendChild(cv2)

        postDiv.querySelector('.chart-footer-data').setAttribute('id', `cfd-${postID}`)

        async function getChartScripts(scriptID, canvas, canvas2){
        const chartData = await fetch(`posts/charts-${scriptID}`)
            const chartDataTxt = await chartData.text()
            const chartDataJsn = JSON.parse(chartDataTxt)
            myCharts = assocCharts(scriptID, chartDataJsn, canvas, canvas2)
        }

        getChartScripts(myScriptNum, canvasElem, canvasElem2)
        appdPost.append(postDiv)
        appdPost = postDiv.querySelector('.append-post')
    }
    window.scrollTo(0, 0)
}

