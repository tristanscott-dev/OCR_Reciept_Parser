

$(document).ready(function(){

    //https://github.com/naptha/tesseract.js/blob/master/docs/examples.md
    //Tesseract.createWorker('eng');

    (async () => {
        const worker = await Tesseract.createWorker('eng');
        const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
        console.log(text);
        await worker.terminate();
    })();

    $('#submit-button').attr('disabled',true);

    console.log($('#formFile'));

    // $('#formFile').addEventListener("input", () =>{

    //     console.log("On input");

    //     if($(this).val().length !=0)
    //         $('#submit-button').attr('disabled', false);            
    //     else
    //         $('#submit-button').attr('disabled',true);
    // });

    $('#formFile').keyup(function(){

        
        if($(this).val().length !=0)
            $('#submit-button').attr('disabled', false);            
        else
            $('#submit-button').attr('disabled',true);

    })
});

function onFileSelected(){
    console.log("File Selected");

    console.log($("#formFile").prop('files')[0]);

    if($('#formFile').val().length !=0)
        $('#submit-button').attr('disabled', false);            
    else
        $('#submit-button').attr('disabled',true);

        var fr = new FileReader();
        //fr.onload = createImage;   // onload fires after reading is complete
        fr.readAsDataURL($("#formFile").prop('files')[0]);  
    
        var canvas = document.getElementById("preview-canvas");
        canvas.style.display = 'block';
    var ctx = canvas.getContext("2d");

    ctx.drawImage(fr.result, 0,0, canvas.width, canvas.height  );  

    ctx.clearRect(0,0,canvas.width,canvas.height);

    (async () => {
        const worker = await Tesseract.createWorker('eng');
        const { data: { text } } = await worker.recognize($("#formFile").prop('files')[0]);
        console.log(text);
        await worker.terminate();
    })();

}

function onFileSubmitPress(){

    var file = $("#formFile").prop('files')[0];

    console.log(file);

    var fd = new FormData();
    fd.append('file', file);

    console.log(fd);

    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onreadystatechange = function() {
        
        if (this.readyState == 4 && this.status == 200) {
            // $("#current-profile-content").val(this.responseText);
            console.log(this.responseText )

            data = JSON.parse(this.responseText);


            console.log(data)

            window.location = "./preprocessing.html?vt=" + data["id"]
        

        }
    
    };

    var url = API_SERVER_BASE + "/upload"; 

    console.log(url);
    
    xmlhttp.open("POST", url, true);
    xmlhttp.send(fd);
    



}