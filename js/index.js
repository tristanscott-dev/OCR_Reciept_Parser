var scale = 1;
var ctx;
var canvas;

var image;

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
    

        canvas.addEventListener('mousedown', onPointerDown)
        canvas.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown))
        canvas.addEventListener('mouseup', onPointerUp)
        canvas.addEventListener('touchend',  (e) => handleTouch(e, onPointerUp))
        canvas.addEventListener('mousemove', onPointerMove)
        canvas.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove))
        canvas.addEventListener( 'wheel', (e) => {


           scale =  scale +  e.deltaY * SCROLL_SENSITIVITY;

            ctx.scale(scale, scale)

            console.log("canvas wheel " , scale);

            drawCanvas();
        })
    
        console.log("canvas width " , canvas.width);
        console.log("canvas height " , canvas.height);
        // updateCanvasSize();

        var canvasMeasuredWidth = canvas.getBoundingClientRect().width;
        var canvasMeasuredHeight = canvas.getBoundingClientRect().height;

        console.log("canvas canvasMeasuredWidth: " , canvasMeasuredWidth);

        console.log("canvas canvasMeasuredHeight: " , canvasMeasuredHeight);

        var imageDrawWidth;
        var imageDrawHeight;

        var widthIsShortestSideLength = canvasMeasuredWidth < canvasMeasuredHeight;
        if(widthIsShortestSideLength){

            // if the width is the shortest we need to use it as our max and 
            // resize the height accordingly
            imageDrawWidth = image.width > canvasMeasuredWidth ? canvasMeasuredWidth : image.width;
            imageDrawHeight = imageDrawWidth * imageWidthAspectRatio ;

            console.log("widthIsShortestSideLength " , imageDrawWidth);

            console.log("widthIsShortestSideLength imageDrawWidth " , imageDrawWidth);
            console.log("widthIsShortestSideLength imageDrawHeight " , imageDrawHeight);

        }else{


           // console.log("widthIsShortestSideLength " , imageDrawWidth);

            // the height is the shortet and we need to use its ratio when drawing
            imageDrawHeight = image.height > canvasMeasuredHeight ? canvasMeasuredHeight : image.height;
            imageDrawWidth = imageDrawHeight * imageHeightAspectRatio ;


            console.log("widthIsShortestSideLength NOT : " , imageDrawWidth);

            console.log("widthIsShortestSideLength NOT :  imageDrawWidth " , imageDrawWidth);
            console.log("widthIsShortestSideLength NOT :  imageDrawHeight " , imageDrawHeight);
        }



        // initCanvasData().then(() => {
            
        //     // bindCanvasClickHandler(ctx);
        //     draw();

        //     notifyCanvasReady();

        // });

        // Ready, set, go
        //draw(canvas, ctx);


    });

    console.log($('#formFile'));
   


});

function drawCanvas(){

    var hRatio = canvas.width  / image.width    ;
    var vRatio =  canvas.height / image.height  ;

    var ratio  = Math.min ( hRatio, vRatio );


    var centerShift_x = ( canvas.width - image.width * ratio ) / 2;
    var centerShift_y = ( canvas.height - image.height * ratio ) / 2;  

   
    // ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.clearRect(0,0,canvas.width, canvas.height);

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


 


    (async () => {
        const worker = await Tesseract.createWorker('eng');
        const { data: { text } } = await worker.recognize($("#formFile").prop('files')[0]);
        console.log(text);
        await worker.terminate();
    })();

}


function updateCanvasSize(image){

    var parentContainer = document.getElementById("receipt-container");
    var canvas =  document.getElementById("preview-canvas");

    var canvasWidth =  parentContainer.width < 460 ? parentContainer.width : 460;
   // canvas.width = 120; //;

   // canvas.height = canvas.width * ( image.height / image.width) ;

    console.log("updateCanvasSize parentContainer.width: " + parentContainer.getBoundingClientRect().width);
    // console.log("updateCanvasSize parentContainer.width: " + parentContainer.width);

}

