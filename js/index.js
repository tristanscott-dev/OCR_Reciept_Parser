const SCROLL_SENSITIVITY = 0.0001;
const MAX_ZOOM = 2;
const MIN_ZOOM = 0.4;

let pan = { x: window.innerWidth/2, y: window.innerHeight/2 }
let zoom = 1.5;
let prevZoomSliderVal = 0;

let isPanning = false;
let prevPanXVal = 0;
let prevPanYVal = 0;
let panOffset = { x: 0, y: 0 }

var originalFileName="";

var ctx;
var canvas;

var image;

var canvasPixelDataOriginal = [];

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

    var panYSlider = document.getElementById("pan-y-slider");
    panYSlider.oninput = function() {

        if(!ctx){
        return;
        }


        if(this.value  > prevPanYVal){

            // spaning left
            panOffset.y = -2;


        }else{
            //panning right
            panOffset.y = 2;
        }

        prevPanYVal = this.value;
        panOffset.x = 0;

        // dissable zoom while panning
        zoom = 1;
       
        drawCanvas();

        

    }

    var panXSlider = document.getElementById("pan-x-slider");
    panXSlider.oninput = function() {

        if(!ctx){
        return;
        }

        if(this.value  > prevPanXVal){

            // spaning left
            panOffset.x = -2;


        }else{
            //panning right
            panOffset.x = 2;
        }

        prevPanXVal = this.value;

        panOffset.y = 0;

        // dissable zoom while panning
        zoom = 1;
       
        drawCanvas();

    }

    var slider = document.getElementById("contrast-slider");
    slider.oninput = function() {

        if(!ctx){
        return;
        }

        enhance(canvasPixelDataOriginal, this.value );

    }


    var zoomSlider = document.getElementById("zoom-slider");
    zoomSlider.oninput = function() {

        if(!ctx){
        return;
        }

        console.log(" Apply zoom ", this.value );

    

        if(this.value  > prevZoomSliderVal){

            // scaling up
            zoom = 1.1;


        }else{
            //scaling down
            zoom = 0.9;
        }

        panOffset = {x:0, y:0};

        prevZoomSliderVal = this.value;
        drawCanvas();
      
      
    }

    canvas = document.getElementById("preview-canvas");
    ctx = canvas.getContext("2d");

    //canvas.addEventListener('DOMMouseScroll',handleMouseScroll,false);
    //canvas.addEventListener('mousewheel',handleMouseScroll,false);


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


    const fileInput = document.getElementById("formFile");

    fileInput.addEventListener("change", onFileSelected);


    image = document.getElementById("receipt-proxy");
    $(image).on('load', function () {

        console.log("image load");

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
    


    


        drawCanvas();

        canvasPixelDataOriginal = ctx.getImageData(0, 0, canvas.width,canvas.height).data;

    });

    console.log($('#formFile'));
   


});


function clearInputs(){


    $("#date-input").val("");
    $("#cost-input").val("");
    $("#supplier-input").val("");
    $("#item-input").val("");
    $("#notes-input").val("");
    $("#receipt-link-input").val("");


}
// function doZoom(clicks){
//    // var pt = ctx.transformedPoint(lastX,lastY);
//   //  ctx.translate(pt.x,pt.y);
//     //var factor = Math.pow(scaleFactor,clicks);
//     ctx.scale(zoom,zoom);
//    // ctx.translate(-pt.x,-pt.y);
//     drawCanvas();
// }

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

    ctx.translate(centerShift_x,centerShift_y);
    ctx.scale(zoom,zoom);
    ctx.translate(-centerShift_x,-centerShift_y);
    
    //ctx.clearRect(0,0,canvas.width, canvas.height);
    //ctx.scale(zoom, zoom);
    //ctx.translate( centerShift_x , centerShift_y )
    
    // ctx.translate( -canvas.width / 2 + cameraOffset.x, -canvas.height / 2 + cameraOffset.y )
    
    ctx.translate(-panOffset.x,-panOffset.y);
    ctx.drawImage(image,0, 0, image.width , image.height, 0, 0,  image.width * ratio, image.height * ratio);  
    
}

async function downloadFileFromServer (){
 
    var url = "https://drive.google.com/thumbnail?id=1qDvSH_t0wXO_hCI4HdSfmBsLzR5Zvang&sz=w1000";
    var base64Data = "";
    try {
        let remoteImage = await axios.get(url, { responseType: 'arraybuffer' });
        let raw = Buffer.from(remoteImage.data).toString('base64');
        base64Data =  "data:" + image.headers["content-type"] + ";base64,"+raw;
    } catch (error) {
        console.log(error)
    } 
  
  
    const image = document.getElementById("receipt-proxy");


    image.src = base64Data ;
    

}

function onFileSelected(event){
    console.log("File Selected");

    console.log($("#formFile").prop('files')[0]);

    const file = event.target.files[0];

    const fileNameParts =  file.name.split(".");
    originalFileName = fileNameParts[0];
    console.log("originalFileName", originalFileName);

    const fileUrl = URL.createObjectURL(file);

    const image = document.getElementById("receipt-proxy");
  
    if(fileNameParts[1] == "pdf"){
        loadPdfFile(fileUrl);
        
        return;
    }
    // image.crossOrigin = "drive.google.com";
    //image.src = e.target.result;

    image.src = URL.createObjectURL(file);

    $("#download-link").attr("href", image.src);
    //image.src = "https://drive.google.com/thumbnail?id=1qDvSH_t0wXO_hCI4HdSfmBsLzR5Zvang&sz=w1000";

   // downloadFileFromServer();


    $("#file-selection-container").hide();
    $("#canvas-processing-container").show();
    
    
        


}


function loadPdfFile(pdfUrl){


    var loadingTask = pdfjsLib.getDocument(pdfUrl);
    loadingTask.promise.then(function(pdf) {
      console.log('PDF loaded');
  
        // Fetch the first page
        var pageNumber = 1;
        pdf.getPage(pageNumber).then(function(page) {

            var scale = 1.5;
            var viewport = page.getViewport({scale: scale});
        
            var renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
          var renderTask = page.render(renderContext);

      

        })
    });
}

function saveFileRenamedWithDetectedData(){

    var fileName = originalFileName;
    fileName += "_";

    var dateInput = $("#date-input").val();
    dateInput = dateInput.replaceAll("/", "-");
    fileName += dateInput;
    fileName += "_";

    var supplierInput = $("#supplier-input").val();
    supplierInput = supplierInput.replaceAll(" ", "-");
    fileName += supplierInput;
    fileName += "_";

    var costInput = $("#cost-input").val();
    costInput = costInput.replaceAll(".", "-");

    fileName += costInput;

    $("#download-link").attr("download", fileName);

    copyInputsToClipboardWithSavedFileName(fileName);

    setTimeout(()=>{

        $("#download-link")[0].click(); 

    }, 500);

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


function processCanvasImage(){

    console.log("processCanvasImage");
    //canvas

    (async () => {
        const worker = await Tesseract.createWorker('eng');
        const { data: { text } } = await worker.recognize(canvas.toDataURL());
        console.log(text);

        parseTextResults(text);

        await worker.terminate();
    })();
}

function parseTextResults(detectedText){

    // output 
    //RECIEPT DATE	ITEM	SUPPLIER	NOTES	COST RECIEPT		 Link																			
    // find all monetary values https://stackoverflow.com/questions/1547574/regex-for-prices
   // const re = new RegExp("");
    const priceArray = detectedText.match(/\b\d{1,3}(?:,\d{3})*(?:\.\d{2})?\b/g);
    var priceOptionsHtml;
    priceArray.forEach((priceText) => {

        priceOptionsHtml += `<input type="button" id="copy-to-clipboard-button" value="${priceText}" onclick="updatePriceInput('${priceText}')">`;

    });

    $("#detected-price-options").html(priceOptionsHtml);
    var dateOptionsHtml;

    const dateArray = detectedText.match(/\b(?:\d{1,2}[-/])?\d{1,2}[-/]\d{4}\b/g);

    dateArray?.forEach((dateText) => {

        dateOptionsHtml += `<input type="button" id="copy-to-clipboard-button" value="${dateText}" onclick="updateDateInput('${dateText}')">`;

    });

    $("#detected-date-options").html(dateOptionsHtml);

    console.log("price array ", priceArray)
    console.log("price array ", dateArray)

    $("#data-input-group").show();

}

function cancelCurrentImage(){

    $("#file-selection-container").show();
    $("#canvas-processing-container").hide();
    $("#data-input-group").hide();

    clearInputs();

    $("#detected-price-options").html("");
    $("#detected-date-options").html("");


    $("#zoom-slider").val(0);
    $("#pan-x-slider").val(200);
    $("#pan-y-slider").val(200);

    zoom = 1;
    panOffset = {x:0, y:0};


}


function updatePriceInput(newPriceValue){
    $("#cost-input").val(newPriceValue);
}

function updateDateInput(newDateValue){
    $("#date-input").val(newDateValue);
}

function copyInputsToClipboard(){



    var date = $("#date-input").val();
    var item_description = $("#item-input").val();
    var supplier = $("#supplier-input").val();
    var notes = $("#notes-input").val();
    var cost = $("#cost-input").val();
    var reciept_link = $("#reciept-link-input").val();
    

    var clipboardText = `${date}, ${item_description}, ${supplier}, ${notes}, ${cost}, ${reciept_link}`;
     // Copy the text inside the text field
    // navigator.clipboard.writeText(copyText.value);

    navigator.clipboard.writeText(clipboardText).then(function() {
        console.log('Async: Copying to clipboard was successful!');
      }, function(err) {
        console.error('Async: Could not copy text: ', err);
      });

}


function copyInputsToClipboardWithSavedFileName(savedFileName){



    var date = $("#date-input").val();
    var item_description = $("#item-input").val();
    var supplier = $("#supplier-input").val();
    var notes = $("#notes-input").val();
    var cost = $("#cost-input").val();
    var reciept_link = $("#reciept-link-input").val();
    

    var clipboardText = `${date}, ${item_description}, ${supplier}, ${notes}, ${cost}, ${savedFileName}`;
     // Copy the text inside the text field
    // navigator.clipboard.writeText(copyText.value);

    navigator.clipboard.writeText(clipboardText).then(function() {
        console.log('Async: Copying to clipboard was successful!');
      }, function(err) {
        console.error('Async: Could not copy text: ', err);
      });

}



function contrastImage(imageData, contrast) {  // contrast input as percent; range [-1..1]
    var data = imageData.data;  // Note: original dataset modified directly!
    contrast *= 255;
    var factor = (contrast + 255) / (255.01 - contrast);  //add .1 to avoid /0 error.

    for(var i=0;i<data.length;i+=4)
    {
        data[i] = factor * (data[i] - 128) + 128;
        data[i+1] = factor * (data[i+1] - 128) + 128;
        data[i+2] = factor * (data[i+2] - 128) + 128;
    }
    return imageData;  //optional (e.g. for filter function chaining)
}


//https://fiveko.com/blog/image-edge-detection-with-simple-javascript/
/**
* @param data - input pixels data
* @param idx - the index of the central pixel
* @param w - image width (width*4 in case of RGBA)
* @param m - the gradient mask (for Sobel=[1, 2, 1])
*/
function conv3x(data, idx, w, m){
    return (m[0]*data[idx - w - 4] + m[1]*data[idx - 4] + m[2]*data[idx + w - 4]
        -m[0]*data[idx - w + 4] - m[1]*data[idx + 4] - m[2]*data[idx + 4 + 4]);
  }
  
  function conv3y(data, idx, w, m){
    return (m[0]*data[idx - w - 4] + m[1]*data[idx - w] + m[2]*data[idx - w + 4]
        -(m[0]*data[idx + w - 4] + m[1]*data[idx + w] + m[2]*data[idx + w + 4]));
  }
  
  
  /**
  * @param pixels - Object of image parameters
  * @param mask - gradient operator e.g. Prewitt, Sobel, Scharr, etc. 
  */
  function gradient_internal(pixels, mask)
  {
    var data = pixels.data;
    var w = pixels.width*4;
    var l = data.length - w - 4;
    var buff = new data.constructor(new ArrayBuffer(data.length));
    
    for (var i = w + 4; i < l; i+=4){
      var dx = conv3x(data, i, w, mask);
      var dy = conv3y(data, i, w, mask);
      buff[i] = buff[i + 1] = buff[i + 2] = Math.sqrt(dx*dx + dy*dy);
      buff[i + 3] = 255;
    }
    pixels.data.set(buff);
  }

  function enhance(pixels, pixelThreshold)
  {


    var canvasImageData = ctx.getImageData(0, 0, canvas.width,canvas.height)
    var data = canvasImageData.data;

    
    var buff = new data.constructor(new ArrayBuffer(data.length));

    var newPixels = [pixels.length];

    console.log("enhance newPixels " , newPixels);

    // iterate over the four pixel values
    for (var i = 0; i <  pixels.length; i ++){
      
        if(pixels[i] < pixelThreshold){
            buff[i] = 0;
        }else{
            buff[i] = pixels[i];
        }
    }

    canvasImageData.data.set(buff);

    //newPixels.data.set(buff);
    ctx.putImageData(canvasImageData, 0, 0);
    
    //return newPixels;
  }