
    // start of DRAG handlling functions ssssssssssssssssssssssssssssssssssssssssssssssssssssssss
    var clicking = false; // var to know when the node is clicked and when mouse click is up.
    var click_in_node_x=0; // variables to make drag nodes relative to the point clicked in the node not the upper left corner
    var click_in_node_y=0;
    $('#node_content_box_1').mousedown(function(event){

        //find the position of the click relative to the upper left corner of the node
        var pos_obj = $("#node_content_box_1").position();
        node_x =pos_obj.left;
        node_y =pos_obj.top;
        click_in_node_x = event.pageX - node_x;
        click_in_node_y = event.pageY - node_y;

        //set the glopal variable to true
        clicking = true;
    });
    $(document).mouseup(function(){
        clicking = false;
        window.onmousemove = null;
    })
    $('#node_content_box_1').mousemove(function(){
        if(clicking == false) return;

        // Mouse click + moving logic here
        window.onmousemove = handle_item_drag;
    });
    function handle_item_drag(event) 
    {
        event = event || window.event;
        var new_x = event.clientX;
        var new_y= event.clientY;
        //prevent item from getting out of top and left edges of window .. 
        //   TODO: make the window resize instead when this happens
        if(event.clientX < 0)
        {    new_x = 0;  }
        if(event.clientY < 0)
        {    new_y = 0;  }
        //reset node position to the new values

        document.getElementById('node_content_box_1').style.top= (new_y - click_in_node_y) + "px";
        document.getElementById('node_content_box_1').style.left=(new_x - click_in_node_x) + "px";

        //reset node resizer position 


        var width = document.getElementById('node_content_box_1').getAttribute("width");
        var height = document.getElementById('node_content_box_1').getAttribute("height");

        document.getElementById('resiezer_1').style.top= (new_y - click_in_node_y + Number(height)) + "px";
        document.getElementById('resiezer_1').style.left=(new_x - click_in_node_x + Number(width )) + "px";
        console.log(width);

    } 
// end of DRAG handlling functions---------------------------------------------------------------
