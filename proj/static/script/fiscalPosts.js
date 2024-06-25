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

    const containerReq = await fetch('posts/getcontainers')
    const containerRes = await containerReq.text()
    const parser = new DOMParser()
    const containerDoc = parser.parseFromString(containerRes, 'text/html')
    const postContainer = containerDoc.querySelector('.post-container')

    // Loop through posts and update DOM
    for (const idx in allPosts){
        let myCharts
        const postDiv = document.createElement('div')
        const appendPostDiv = document.createElement('div')
        appendPostDiv.setAttribute('class', 'append-post')
        postDiv.innerHTML = postContainer.innerHTML
        postDiv.querySelector('.post-date').textContent += ' ' + allPosts[idx]['post_date']
        postDiv.querySelector('.post-title').textContent += ' ' + allPosts[idx]['title']
        postDiv.querySelector('.post-description').textContent += ' ' + allPosts[idx]['post_description']
        postDiv.querySelector('.post-post').textContent += ' ' + allPosts[idx]['post']
        postDiv.append(appendPostDiv) // Add element to append additional posts to

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
        postDiv.querySelector('.footer-icon-link').setAttribute('id', `fil-${postID}`)

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

