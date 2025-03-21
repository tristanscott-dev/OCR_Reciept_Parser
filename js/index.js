const SCROLL_SENSITIVITY = 0.0001;
const MAX_ZOOM = 2;
const MIN_ZOOM = 0.4;

let pan = { x: window.innerWidth/2, y: window.innerHeight/2 }
let zoom = 1;
let isPanning = false;

let panStart = { x: 0, y: 0 }


var ctx;
var canvas;

var image;

// https://phrogz.net/tmp/canvas_zoom_to_cursor.html

// Gets the relevant location from a mouse or single touch event
function getEventLocation(e)
{
    if (e.touches && e.touches.length == 1)
    {
        return { x:e.touches[0].clientX, y: e.touches[0].clientY }
    }
    else if (e.clientX && e.clientY)
    {
        return { x: e.clientX, y: e.clientY }        
    }
}

$(document).ready(function(){

    //https://github.com/naptha/tesseract.js/blob/master/docs/examples.md
    //Tesseract.createWorker('eng');

    // (async () => {
    //     const worker = await Tesseract.createWorker('eng');
    //     const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
    //     console.log(text);
    //     await worker.terminate();
    // })();



    canvas = document.getElementById("preview-canvas");
    ctx = canvas.getContext("2d");

    canvas.addEventListener('DOMMouseScroll',handleMouseScroll,false);
    canvas.addEventListener('mousewheel',handleMouseScroll,false);


    canvas.addEventListener('mousedown', (e) => {

        // isPanning = true;

        // panStart.x = getEventLocation(e).x / zoom - pan.x
        // panStart.y = getEventLocation(e).y / zoom - pan.y

    })
    // canvas.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown))
    canvas.addEventListener('mouseup', (e) => {

        // isPanning = false;
    })
    // canvas.addEventListener('touchend',  (e) => handleTouch(e, onPointerUp))
    canvas.addEventListener('mousemove', (e) => {

        // if (isPanning)
        // {
        //     pan.x = getEventLocation(e).x / zoom - panStart.x
        //     pan.y = getEventLocation(e).y / zoom - panStart.y
        // }

    });

    // canvas.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove))
    // canvas.addEventListener( 'wheel', (e) => {

    //     //console.log("canvas wheel " , e.deltaY );

    //     // if (!isPanning)
    //     // {
    //     //     return;
    //     // }

    //    zoom +=  e.deltaY * SCROLL_SENSITIVITY;
    //    console.log("canvas new zoom " , zoom );

    //    if( zoom >= MAX_ZOOM){
    //         zoom = MAX_ZOOM;
    //         return;
    //    }

    //    if( zoom <= MIN_ZOOM){
    //         zoom = MIN_ZOOM;
    //         return;
    //     }


    //    //zoom = Math.min( zoom, MAX_ZOOM )
    //  //  zoom = Math.max( zoom, MIN_ZOOM )
       

    

    //    // drawCanvas();

    //    // e.preventDefault();
    // })



    const fileInput = document.getElementById("formFile");

    fileInput.addEventListener("change", onFileSelected);


    image = document.getElementById("receipt-proxy");
    $(image).on('load', function () {


        var imageWidthAspectRatio = image.height/image.width; 
        var imageHeightAspectRatio = image.width/image.height; 


        ////var imageDrawWidth = 100;
        //var imageDrawHeight = imageDrawWidth * imageAspectRatio ;

        //updateCanvasSize(image);

        console.log("ratio " , imageWidthAspectRatio);
        console.log("ratio " , imageHeightAspectRatio);

        console.log("image width " , image.width);

        console.log("image height " , image.height);

   

       
        canvas.style.display = 'block';
    


    
        // console.log("canvas width " , canvas.width);
        // console.log("canvas height " , canvas.height);
        // // updateCanvasSize();

        // var canvasMeasuredWidth = canvas.getBoundingClientRect().width;
        // var canvasMeasuredHeight = canvas.getBoundingClientRect().height;

        // console.log("canvas canvasMeasuredWidth: " , canvasMeasuredWidth);

        // console.log("canvas canvasMeasuredHeight: " , canvasMeasuredHeight);



        drawCanvas();

    

    });

    console.log($('#formFile'));
   


});

function doZoom(clicks){
   // var pt = ctx.transformedPoint(lastX,lastY);
  //  ctx.translate(pt.x,pt.y);
    //var factor = Math.pow(scaleFactor,clicks);
    ctx.scale(zoom,zoom);
   // ctx.translate(-pt.x,-pt.y);
    drawCanvas();
}

function handleMouseScroll(e){


    zoom +=  e.deltaY * SCROLL_SENSITIVITY;

    // if( zoom >= MAX_ZOOM){
    //     zoom = MAX_ZOOM;
    //     return;
    // }

    // if( zoom <= MIN_ZOOM){
    //     zoom = MIN_ZOOM;
    //     return;
    // }


    console.log("handleMouseScroll zoom ", zoom);
    if (zoom) {

        drawCanvas();
    }
    
   

    return e.preventDefault() && false;


}

function drawCanvas(){

    var hRatio = canvas.width  / image.width    ;
    var vRatio =  canvas.height / image.height  ;

    var ratio  = Math.min ( hRatio, vRatio );


    var centerShift_x = ( canvas.width - image.width * ratio ) / 2;
    var centerShift_y = ( canvas.height - image.height * ratio ) / 2;  

    console.log("dra canvas applying zoom " , zoom);

    ctx.clearRect(0,0,canvas.width,canvas.height);
    //ctx.clearRect(0,0,canvas.width, canvas.height);

    // ctx.translate( canvas.width / 2, canvas.height / 2 )
    ctx.scale(zoom, zoom)
    // ctx.translate( -canvas.width / 2 + cameraOffset.x, -canvas.height / 2 + cameraOffset.y )

    ctx.drawImage(image,0, 0, image.width , image.height, 0, 0,  image.width * ratio, image.height * ratio);  


}

function onFileSelected(event){
    console.log("File Selected");

    console.log($("#formFile").prop('files')[0]);

    const file = event.target.files[0];

    const image = document.getElementById("receipt-proxy");

    //image.src = e.target.result;

    image.src = URL.createObjectURL(file);


    $("#file-selection-container").hide();
        



    if($('#formFile').val().length !=0)
        $('#submit-button').attr('disabled', false);            
    else
        $('#submit-button').attr('disabled',true);

        var fr = new FileReader();

        fr.onload = function(e) {


           // const image = document.getElementById("receipt-proxy");

           // image.src = e.target.result;
            // let img = new Image();
            // img.src = e.target.result;

            // console.log("img", img);
            // img.width = canvas.width;

            // canvas.height = canvas.width * (img.width/img.height);

            // img.onload = function() {
            //     // The image data is now available in img
            //     ctx.drawImage(img, 0,0, canvas.width, canvas.height  );  
            // };
        };
        //fr.onload = createImage;   // onload fires after reading is complete
       // fr.readAsDataURL($("#formFile").prop('files')[0]);  


 


    // (async () => {
    //     const worker = await Tesseract.createWorker('eng');
    //     const { data: { text } } = await worker.recognize($("#formFile").prop('files')[0]);
    //     console.log(text);
    //     await worker.terminate();
    // })();

}


// function updateCanvasSize(image){

//     var parentContainer = document.getElementById("receipt-container");
//     var canvas =  document.getElementById("preview-canvas");

//     var canvasWidth =  parentContainer.width < 460 ? parentContainer.width : 460;
//    // canvas.width = 120; //;

//    // canvas.height = canvas.width * ( image.height / image.width) ;

//     console.log("updateCanvasSize parentContainer.width: " + parentContainer.getBoundingClientRect().width);
//     // console.log("updateCanvasSize parentContainer.width: " + parentContainer.width);

// }

