var isRecording = false;
var postId = 1;


var radialObj = radialIndicator('#indicatorContainer', {
     barColor: {
        0: '#FF0000',
        33: '#FFFF00',
        66: '#0066FF',
        100: '#33CC33'
    },
    radius: (screen.height*12)/100,
    barWidth : 10,
    initValue : 0,
    percentage: true
});

var contextGraph = document.getElementById('myLineChart');

// this post id drives the example data

var myChart = new Chart(contextGraph, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      data: [],
      pointRadius: 0,
      borderWidth: 3,
      borderColor:'#00c0ef',
    }]
  },
  options: {
    grid: {show: false},
    responsive: true,
    title: {
      //display: true,-
      //text: "Chart.js - Dynamically Update Chart Via Ajax Requests",
    },
    legend: {
      display: false
    },
    scales: {
        xAxes: [{
            display: true,
            showGrid: false,
            scaleLabel: {
                display: true,
                labelString: 'Voice Samples Recorded'
            },
        splitLine: {
                show: false
            },
        gridLines: {
                color: "rgba(0, 0, 0, 0)",
            }
        }],
        yAxes: [{
            display: false,
            scaleLabel: {
                display: false,
                labelString: 'Confidence'
            },
        splitLine: {
                show: false
            },
        gridLines: {
                color: "rgba(0, 0, 0, 0)",
            }
        }]
    }
  }
});

// // logic to get new data
// var getData = function() {
//   $.ajax({
//     url: 'https://jsonplaceholder.typicode.com/posts/' + postId + '/comments',
//     success: function(data) {
//       // process your data to pull out what you plan to use to update the chart
//       // e.g. new label and a new data point
      
//       // add new label and data point to chart's underlying data structures
//       myChart.data.labels.push("Post " + postId++);
//       myChart.data.datasets[0].data.push(getRandomIntInclusive(1, 25));
      
//       // re-render the chart
//       myChart.update();
//     }
//   });
// };

// // get new data every 3 seconds
// setInterval(getData, 3000);


// Random data
//var line1 = new TimeSeries();
//var line2 = new TimeSeries();
// setInterval(function() {
//   line1.append(new Date().getTime(), Math.random());
//   line2.append(new Date().getTime(), Math.random());
// }, 1000);







//Intialiazation 
function __log(e, data) {
    console.log(e + data);
  }
  var audio_context;
  var recorder;
  let timerId;
  var isRecording = false;
  var formData = new FormData();
  // var wsh = new WebSocket( 'ws://' + window.location.href.split( '/' )[2] + '/ws' );
  function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    __log('Media stream created.');
    // Uncomment if you want the audio to feedback directly
    //input.connect(audio_context.destination);
    //__log('Input connected to audio context destination.');
    
    recorder = new Recorder(input);
    __log('Recorder initialised.');
  }

  function startRecording() {
    recorder && recorder.record();
    __log('Recording...');

    timerId = setInterval(function tick(){
      createDownloadLink();
      recorder.clear();
      recorder.record();
    }, 11000);
  }
  


  function stopRecording() {
    clearInterval(timerId);
    recorder && recorder.stop();
    __log('Stopped recording.');
    // create WAV download link using audio data blob
    createDownloadLink();
    recorder.clear();
  }
  


  function createDownloadLink() {
    recorder && recorder.exportWAV(function(blob) {
            var saveData = $.ajax({
            type: "POST",
            url: "http://localhost:5000",
            data: blob,
            processData: false,
            contentType: false,
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            success: function(resultData){
                console.log(resultData)
                // var obj = JSON.parse(resultData);
                // console.log(obj);

                    if(myChart.data.labels.length >20){
                        radialObj.animate(resultData.confidence*100);
                        myChart.data.labels.shift();
                        myChart.data.datasets[0].data.shift();
                        myChart.data.labels.push(postId++);
                        myChart.data.datasets[0].data.push(resultData.confidence*100);
                        myChart.update();
                        console.log(resultData);
                    } else {
                        radialObj.animate(resultData.confidence*100); 
                        myChart.data.labels.push(postId++);
                        myChart.data.datasets[0].data.push(resultData.confidence*100);
                        myChart.update();
                        console.log(resultData);
                    }
            }
      });
      console.log(blob);
      //console.log(blob);
      // var url = URL.createObjectURL(blob);
      // var li = document.createElement('li');
      // var au = document.createElement('audio');
      // var hf = document.createElement('a');
      // // wsh.send()
      // au.controls = true;
      // au.src = url;
      // console.log(au.src);
      // hf.href = url;
      // hf.download = new Date().toISOString() + '.wav';
      // // wsh.send(hf.download);
      // hf.innerHTML = hf.download;
    });
  }





// function uploadData() {
    
//     // The Javascript
// var fileInput = document.getElementById('the-file');
// var file = fileInput.files[0];
// var formData = new FormData();
// formData.append('file', file);
//     var saveData = $.ajax({
//             type: "POST",
//             url: "http://localhost:5000",
//             data: blob,
//             processData: false,
//             contentType: false,
//             xhrFields: {
//               withCredentials: true
//             },
//             crossDomain: true,
//             success: function(resultData){
//                 //console.log(resultData);

//       // var url = URL.createObjectURL(blob);
//       // var li = document.createElement('li');
//       // var au = document.createElement('audio');
//       // var hf = document.createElement('a');
//       // // wsh.send()
//       // au.controls = true;
//       // au.src = url;
//       // console.log(au.src);
//       // hf.href = url;
//       // hf.download = new Date().toISOString() + '.wav';
//       // // wsh.send(hf.download);
//       // hf.innerHTML = hf.download;
    
//   }

  function startRecordingMic() {
    try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      window.URL = window.URL || window.webkitURL;
      audio_context = new AudioContext;
      __log('Audio context set up.');
      __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
      alert('No web audio support in this browser!');
    }
    
    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
      __log('No live audio input: ' + e);
    });
  };








// function onWsMessage( msg ){ 
//     //line1.append(new Date().getTime(), msg.data.sad);
//     //line2.append(new Date().getTime(), msg.data.neutral);
    
//     var obj = JSON.parse(msg.data);
//     //line1.append(new Date().getTime(), obj.anger);
//     //Using Instance
//     if(myChart.data.labels.length >20){
//         myChart.data.labels.shift();
//         myChart.data.datasets[0].data.shift();
//         myChart.data.labels.push(postId++);
//         myChart.data.datasets[0].data.push(obj.neutral*100);
//         myChart.update();
//         console.log(obj);
//     } else {
//         radialObj.animate(obj.neutral*100); 
//         myChart.data.labels.push(postId++);
//         myChart.data.datasets[0].data.push(obj.neutral*100);
//         myChart.update();
//         console.log(obj);
//     }

// }


















// var smoothie = new SmoothieChart({millisPerPixel:58,maxValueScale:1.5,minValueScale:1.5,grid:{fillStyle:'#ffffff',strokeStyle:'#ffffff',sharpLines:true}});
// smoothie.addTimeSeries(line1, { strokeStyle: 'rgb(0, 255, 0)', lineWidth: 1 });
// //smoothie.addTimeSeries(line2, { strokeStyle: 'rgb(255, 0, 255)', fillStyle: 'rgba(255, 0, 255, 0.3)', lineWidth: 3 });

// smoothie.streamTo(document.getElementById("mycanvas"), 1000);

//wsh.onmessage = onWsMessage;
//var ap = new OpusEncoderProcessor( wsh );
//var mh = new MediaHandler( ap );

// function sendSettings()
// {
//     if( false )
//     encode = 1;
//     else
//     encode = 0;

//     var rate = String( mh.context.sampleRate / ap.downSample );
//     var opusRate = String( ap.opusRate );
//     var opusFrameDur = String( ap.opusFrameDur )
//     console.log("sending Sample Rate " + rate)
//     var msg = "m:" + [ rate, encode, opusRate, opusFrameDur ].join( "," );
//     console.log( msg );
//     wsh.send( msg );
// }





function startRecord()
{
    document.getElementById( "record").innerHTML = "<i class='fa fa-stop-circle-o' aria-hidden='true'></i>";
    document.getElementById( "record").className = "Rec";
    document.getElementById( "encode" ).disabled = true;
    //mh.context.resume(); // needs an await?
    //sendSettings();   
    isRecording = true;
    startRecording();
    console.log( 'started recording' ); 
}

function stopRecord()
{
    isRecording  = false;
    stopRecording();
    document.getElementById( "record").innerHTML = "<i class='fa fa-microphone' aria-hidden='true'></i>";
    document.getElementById( "record").className = "notRec";
    document.getElementById( "encode" ).disabled = false;
    console.log( 'ended recording' );    
}

function toggleRecord() 
{
    if( isRecording ){
        openForm();
        stopRecord();
    }
    else {
        startRecord();
    }
}

function openForm() {
 var rect = document.getElementById( "record").getBoundingClientRect();
 console.log(rect.top, rect.right, rect.bottom, rect.left);
 document.getElementById("myForm").style.top = rect.top-330;
 document.getElementById("myForm").style.left= rect.left+110;
 document.getElementById("myForm").style.display = "block";
}


function showUploadForm() {
 var rect = document.getElementById( "record").getBoundingClientRect();
 console.log(rect.top, rect.right, rect.bottom, rect.left);
 document.getElementById("myUploadForm").style.top = rect.top-370;
 document.getElementById("myUploadForm").style.left= rect.left+70;
 document.getElementById("myUploadForm").style.display = "block";
}


function saveFile() {
 var filename = document.getElementById("fileToBeSaved").value;
 console.log(filename);
 if(filename !== ''){
    
    //wsh.send("command:storefile="+filename+"_server.wav" );
    console.log("Saving File");
    closeForm();
    console.log("Closed Window");
    }
}

function closeForm() {
 document.getElementById("myForm").style.display = "none";
 console.log("Closing window");
}       
function closeUploadForm() {
 document.getElementById("myUploadForm").style.display = "none";
 console.log("Closing upload window");
}

function resetEverything() {
 radialObj.animate(0);
 for ( i=0;i<50;i++){
    myChart.data.labels.shift();
    myChart.data.datasets[0].data.shift();
    myChart.data.labels.push('');
    myChart.data.datasets[0].data.push(0); 
 }
 myChart.update();
    console.log("Reset Everything");
}


