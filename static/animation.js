///////////////////////////////POST/////////////////////////////
$('#send-button').click(function(e){
    preventReload(e)
    const inputData = getPostInputData();

    if (inputData){

        postItemToServer(inputData);
    }
});

const Debug_Mode = false;

const BASE_URL = window.location.origin;
const API_URL = BASE_URL+'/record';



function preventReload(e){
    if (Debug_Mode){
        e.preventDefault();
    }
}


function getPostInputData(){
    const tododate = $('#post-todo-date').val();
    const todothings = $('#post-todo-things').val();

    return {
        'date':tododate,
        'things':todothings,
    }
}


function postItemToServer(inputData){
    console.log(inputData)
    $.ajax({
        url:API_URL,
        method: 'POST',
        data: inputData,
        success: function(data){
            console.log(data);
        },
        error: function(xhr,ajaxOptions, thrownError){
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}
////////////////////////////GET//////////////////////////////////////
getItemFromServer()

function getItemFromServer(){
    $.ajax({
        url:API_URL,
        method: 'GET',
        success: function(data){
            loadAccountData(data)
        },
        error: function(xhr, ajaxOptions, thrownError){
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}

function loadAccountData(data){
    const dataHtml = generateDataHtml(data);
    $('#item_list').append(dataHtml);
    
}

function generateDataHtml(data){
    let elementsHtml = '';
    data = JSON.parse(data)
    for (let item of data){
        const element = `
        <li data-record-id="${item['id']}" class= "list-group-item">
            <span class="item-id">${item['id']}:</span>
            <span data-record-date="${item['date']}" class = "item-date"> ${item['date']}:</span>
            <span class="item-things">${item['things']}</span>
            <button data-record-id="${item['id']}" type="button" class="close" aria-label="Close" >
                <span aria-hidden="true">&times;</span>
            </button>      
        </li>`
        // <span data-record-id="${item['id']}" class="btnRemove">X</span>
        elementsHtml += element;
    }
    return elementsHtml
}


/////////////////////////////////DELETE///////////////////////////////////

$("body").delegate(".close", "click", function(e){
    const Id = $(".close").attr("data-record-id")
    console.log(Id)
    preventReload(e);
    if (Id){
        DeleteTheThings(Id);
    }
});


function DeleteTheThings(things_id){
    const DLT_URL = API_URL+'/'+things_id;
    $.ajax({
        url:DLT_URL,
        method: 'DELETE',
        success: function(data){
            console.log(data);
            location.reload();
        },
        error: function(xhr, ajaxOptions, thrownError){
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}


/////////////////////////////PUT////////////////////////////////////////


$("body").delegate(".list-group-item:not(.on-edit)", "dblclick", function(){
    const recordId = $(this).attr('data-record-id');
    console.log(recordId)
    if(recordId){
        showEditForm(recordId)
        $(this).addClass( "on-edit" );
    }
});

function showEditForm(recordId){
    $(`[data-record-id=${recordId}] .item-date`).hide()
    $(`[data-record-id=${recordId}] .item-things`).hide()
    $(`li[data-record-id=${recordId}]`).append(InputHtml(recordId))

}


function InputHtml(Id){
    const element = `
    <input id = "item-date" type="date" name="date" />
    <input id= "item-things" type="text" name="things" />
    <input class= "update-button" update-record-id="${Id}" type="submit" value="Update" />
        `
    return element
}

$("body").delegate(".list-group-item .update-button", "click", function(e){
    
    const recordId = $(this).attr('update-record-id');
    const inputData = getPutInputData(recordId);
    

    if (inputData){

        putItemToServer(inputData);
        
    }
});


function getPutInputData(recordId){
    const recordElement = $(`.list-group-item[data-record-id=${recordId}]`);
    const newDate = recordElement.find('#item-date').val();
    const newThings = recordElement.find('#item-things').val();
    return{
        id:recordId,
        date:newDate,
        things:newThings
    }
}

function putItemToServer(inputData){
    const PUT_URL = API_URL+'/'+inputData['id'];
    $.ajax({
        url:PUT_URL,
        method: 'PUT',
        data: inputData,
        success: function(data){
            console.log(data);
            location.reload()
        },
        error: function(xhr,ajaxOptions, thrownError){
            console.log(xhr.status);
            console.log(thrownError);
        }
    });
}
