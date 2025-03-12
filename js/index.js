

$(document).ready(function(){

    $('#submit-button').attr('disabled',true);

    console.log($('#formFile'));

    $('#formFile').addEventListener("input", () =>{

        console.log("On input");

        if($(this).val().length !=0)
            $('#submit-button').attr('disabled', false);            
        else
            $('#submit-button').attr('disabled',true);
    });

    $('#formFile').keyup(function(){

        
        if($(this).val().length !=0)
            $('#submit-button').attr('disabled', false);            
        else
            $('#submit-button').attr('disabled',true);

    })
});

function onFileSelected(){
    console.log("File Selected");

    if($('#formFile').val().length !=0)
        $('#submit-button').attr('disabled', false);            
    else
        $('#submit-button').attr('disabled',true);
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