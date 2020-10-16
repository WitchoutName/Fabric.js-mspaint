let editing, first = false;
$("#btn").click(function(){
    editing = !editing
    console.log(editing)
    if(editing){
        if(!first){
            $("#content-wrap").append('<div id="drawingOptions"></div>')
            first = true;   
        }
        $("#drawingOptions").dxButtonGroup({
            items: canvasButtons,
            keyExpr: "alignment",
            stylingMode: "outlined",
            selectionMode : "single"
        });
    }
})
