const video = document.getElementById("video");
 Promise.all([
     faceapi.nets.tinyFaceDetector.loadFromUri('models'),
     faceapi.nets.faceLandmark68Net.loadFromUri('models'),
     faceapi.nets.faceExpressionNet.loadFromUri('models')
 ]).then(beginVideo)

 
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
    }, 100);




});
 }
 

