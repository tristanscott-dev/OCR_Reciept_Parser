

$(document).ready(function(){

    //https://github.com/naptha/tesseract.js/blob/master/docs/examples.md
    //Tesseract.createWorker('eng');

    // (async () => {
    //     const worker = await Tesseract.createWorker('eng');
    //     const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
    //     console.log(text);
    //     await worker.terminate();
    // })();


    const image = document.getElementById("receipt-proxy");
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

   

        var canvas = document.getElementById("preview-canvas");
        canvas.style.display = 'block';
    
        console.log("canvas width " , canvas.width);
        console.log("canvas height " , canvas.height);
        // updateCanvasSize();
    

        var imageDrawWidth;
        var imageDrawHeight;

        var widthIsShortestSideLength = canvas.width <  canvas.height;
        if(widthIsShortestSideLength){

            // if the width is the shortest we need to use it as our max and 
            // resize the height accordingly
            imageDrawWidth = image.width > canvas.width ? canvas.width : image.width;
            imageDrawHeight = imageDrawWidth * imageWidthAspectRatio ;

        }else{

            // the height is the shortet and we need to use its ratio when drawing
            imageDrawHeight = image.height > canvas.height ? canvas.height : image.height;
            imageDrawWidth = imageDrawHeight * imageHeightAspectRatio ;
        }



      



        var ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,canvas.width,canvas.height);

        ctx.drawImage(image,imageDrawWi,0, imageDrawWidth, imageDrawHeight );  

        // initCanvasData().then(() => {
            
        //     // bindCanvasClickHandler(ctx);
        //     draw();

        //     notifyCanvasReady();

        // });



    });

    console.log($('#formFile'));
   


});

function onFileSelected(){
    console.log("File Selected");

    console.log($("#formFile").prop('files')[0]);



    $("#file-selection-container").hide();
        



    if($('#formFile').val().length !=0)
        $('#submit-button').attr('disabled', false);            
    else
        $('#submit-button').attr('disabled',true);

        var fr = new FileReader();

        fr.onload = function(e) {


            const image = document.getElementById("receipt-proxy");

            image.src = e.target.result;
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
        fr.readAsDataURL($("#formFile").prop('files')[0]);  


 


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

