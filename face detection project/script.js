const video = document.getElementById("video");
const textStatus = document.getElementById('textStatus')
 Promise.all([
     faceapi.nets.tinyFaceDetector.loadFromUri('models'),
     faceapi.nets.faceLandmark68Net.loadFromUri('models'),
     faceapi.nets.faceExpressionNet.loadFromUri('models')
 ]).then(beginVideo)

 let statusIcons = {
	default: { emoji: '😐', color: '#008797' },
	neutral: { emoji: '😐', color: '#008797' },
	happy: { emoji: '😀', color: '#148f77' },
	sad: { emoji: '😥', color: '#767e7e' },
	angry: { emoji: '😠', color: '#b64518' },
	fearful: { emoji: '😨', color: '#90931d' },
	disgusted: { emoji: '🤢', color: '#1a8d1a' },
	surprised: { emoji: '😲', color: '#1230ce' },
}


 
 async function beginVideo(){
    let stream = null;

try{
   stream = await navigator.mediaDevices.getUserMedia({audio:false,video:true})
    video.srcObject =stream;
}catch(err){
    alert("unable to connect the device")
    console.log(err)
  //  console.log("hai");
}
video.addEventListener('play',()=> {
    const Canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(Canvas);
    const dim={width:video.width,height:video.height }
    faceapi.matchDimensions(Canvas,dim);
    setInterval(async() => {
     const detections=   await faceapi.detectAllFaces(video,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
     const resizedDetections=faceapi.resizeResults(detections,dim)
       Canvas.getContext("2d").clearRect(0,0,Canvas.width,Canvas.height)
       faceapi.draw.drawDetections(Canvas,resizedDetections)
       faceapi.draw.drawFaceLandmarks(Canvas,resizedDetections)
       faceapi.draw.drawFaceExpressions(Canvas,resizedDetections)
       if (detections.length > 0) {
        //Got to all face detections
        detections.forEach((element) => {
            let status = ''
            let valueStatus = 0.0
            for (const [key, value] of Object.entries(element.expressions)) {
                if (value > valueStatus) {
                    status = key
                    valueStatus = value
                }
            }
            //Once we have the highest scored expression (status)
            emoji.innerHTML = statusIcons[status].emoji

            //Set the right emoji
            textStatus.innerHTML = status

            //Change background color
           // app.style.backgroundColor = statusIcons[status].color
        })
    } else {
        //If not face was detected

        //Set default emoji
        emoji.innerHTML = statusIcons['default'].emoji

        //Change text
        textStatus.innerHTML = '...'

        //Change background color to default
       // app.style.backgroundColor = statusIcons['default'].color
    }
    }, 100);




});
 }
 

