   // start of RESIZE handlling functions sssssssssssssssssssssssssssssssssssssssssssssssssssssssssss
   var clicking2 = false; // var to know when the resizer is clicked and when mouse click is up.
   $('#resiezer_1').mousedown(function(event){

       //set the glopal variable to true
       clicking2 = true;
   });
   $(document).mouseup(function(){
       clicking2 = false;
       window.onmousemove = null;
   })
   $('#resiezer_1').mousemove(function(){
       if(clicking2 == false) return;

       // Mouse click + moving logic here
       window.onmousemove = handle_item_resize;
       console.log(1);
   });
   function handle_item_resize(event) 
   {

           event = event || window.event;
           var new_resizer_x = event.clientX; //position of the resizer is the same as the position of the cursor as it moves
           var new_resizer_y= event.clientY;
       
           var pos_obj = $("#node_content_box_1").position(); // position of the node the resizer attached to
           var node_x =pos_obj.left;
           var node_y =pos_obj.top;

       //prevent item from getting smaller than a specific size .. 
           var min_width=30;
           var min_height=30;
           if(event.clientX - node_x < min_width)
           {    new_resizer_x = node_x+min_width;  }
           if(event.clientY -node_y < min_height)
           {    new_resizer_y = node_y+min_height;  }
       
       //calculate the new size of node    
           var new_node_width = new_resizer_x - node_x;
           var new_node_height = new_resizer_y - node_y;

       //change the size of the node 
           //resize the svg
           $('#node_content_box_1').attr('height', new_node_height);
           $('#node_content_box_1').attr('width', new_node_width);
           //resize the svg content
           $('#node_content_box_rect_1').attr('height', new_node_height-5);
           $('#node_content_box_rect_1').attr('width', new_node_width-5);
       //reset node resizer position 
           document.getElementById('resiezer_1').style.top= (new_resizer_y ) + "px";
           document.getElementById('resiezer_1').style.left=(new_resizer_x ) + "px";

   }
// end   of RESIZE handlling functions-------------------------------------------------