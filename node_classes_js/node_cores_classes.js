
    class default_node_core
    {
        constructor(containing_node_shell_shell,x,y,w,h)
        {
            //create the body element
                this.containing_node_shell_shell=containing_node_shell_shell;
                this.node_id = containing_node_shell_shell.node_id;
                //create a specific shape for this core .. this may change for each core type
                var body_html_shape=golpal_shape_creator.create_rectangle(2,2,w-4,h-4,"blue");
                this.node_body=new element(containing_node_shell_shell.node_id,"node_body",body_html_shape,x,y,w,h);
                // this.node_body.draw();

            //create the resizer element
                var resizer_html_shape=golpal_shape_creator.create_rectangle(0,0,10,10,"blue");
                this.node_resizer=new element(containing_node_shell_shell.node_id,"resizer",resizer_html_shape,x+w,y+h,10,10);
                // this.node_resizer.draw();

            // set up the event handling functionality
                this.set_body_event_handler(this);
                this.set_resizer_event_handler(this);

            //set the connection_points array
            //TODO: take this out the event hanlders and make it a separate function ... update_connection_points();
                 this. connection_points = {
                                          top:    {label:"top" , x:x+w/2 , y:y } ,
                                          right:  {label:"right" , x:x+w   , y:y+h/2 } , 
                                          bottom: {label:"bottom" , x:x+w/2 , y:y+h } ,
                                          left:   {label:"left" , x:x     , y:y+h/2 }
                                          };

        }

        update_connection_points=function(){ 
            var x =this.get_x();
            var y =this.get_y();
            var w =this.get_width();
            var h =this.get_height();
            this. connection_points.top=   {label:"top" , x:x+w/2 , y:y } ;
            this. connection_points.right=  {label:"right" , x:x+w   , y:y+h/2 } ; 
            this. connection_points.bottom= {label:"bottom" , x:x+w/2 , y:y+h } ;
            this. connection_points.left=  {label:"left" , x:x     , y:y+h/2 };
                                       
        }
        get_x = function()
        {
            var pos_obj = $("#svg_"+this.node_id+'.'+"node_body").position();
            var body_x =pos_obj.left;
            return body_x;
            var body_y =pos_obj.top;
        }
        get_y = function()
        {
            var pos_obj = $("#svg_"+this.node_id+'.'+"node_body").position();
            var body_y =pos_obj.top;
            return body_y;
        }
        get_width = function()
        {
            var width = document.querySelectorAll("#svg_"+this.node_id+'.'+"node_body")[0].getAttribute("width");
            width = Number(width);
            return width

        }
        get_height = function()
        {
            var height = document.querySelectorAll("#svg_"+this.node_id+'.'+"node_body")[0].getAttribute("height");
            height= Number(height);
            return height

        }
        draw = function()
        {
            this.node_body.draw();
            this.node_resizer.draw();
            this.set_body_event_handler(this);
            this.set_resizer_event_handler(this);
        }

        set_body_event_handler = function body_event_handler(containing_node_core)
        {
                // here we define the static variables used by the event handlers of this object 
                //variables and funcions defined here will be accesible by the handlers any time later.
                if ( typeof body_event_handler.counter == 'undefined' )
                 {
                    // perform  initialization
                    body_event_handler.counter=0;
                    body_event_handler.clicking = false; // var to know when the box is clicked and when mouse click is up.
                    body_event_handler.click_in_content_box_x=0; // variables to make drag node relative to the point clicked in the node not the upper left corner
                    body_event_handler.click_in_content_box_y=0;                       

                    //this function is called by the the event attachment below
                    //the function used when clicking and moving
                    body_event_handler.handle_item_drag =(event)=>{
                        event = event || window.event;
                        var new_x = event.clientX; //position of click
                        var new_y= event.clientY;
                        //prevent item from getting out of top and left edges of window .. 
                        //   TODO: make the window resize instead when this happens
                            if(event.clientX < 0)
                            {    new_x = 0;  }
                            if(event.clientY < 0)
                            {    new_y = 0;  }
                        //reset node position to the new values
                            document.querySelectorAll("#svg_"+containing_node_core.node_id+'.'+"node_body")[0].style.top= (new_y - body_event_handler.click_in_content_box_y) + "px";
                            document.querySelectorAll("#svg_"+containing_node_core.node_id+'.'+"node_body")[0].style.left=(new_x - body_event_handler.click_in_content_box_x) + "px";
                        //reset node resizer position 
                            let width = this.get_width();
                            let height= this.get_height();
                            document.querySelectorAll("#svg_"+containing_node_core.node_id+'.'+"resizer")[0].style.top= (new_y - body_event_handler.click_in_content_box_y + height) + "px";
                            document.querySelectorAll("#svg_"+containing_node_core.node_id+'.'+"resizer")[0].style.left=(new_x - body_event_handler.click_in_content_box_x + width ) + "px";
                        
                        //reset node connection_points position:
                            this.update_connection_points();

                        //update related paths
                            update_paths(this.containing_node_shell_shell)
                    } ;




                }

                //TODO: somehow the events are attached to the object before even it's added to the dom i don't understand how the jquery did that.
                //TODO: check the possibility of setting the events based on the html objects directly from js without having to fetch them from the dom 
                $("#svg_"+containing_node_core.node_id+'.'+"node_body").mousedown((event)=>{
                        //find the position of the click relative to the upper left corner of the node
                        var pos_obj = $("#svg_"+containing_node_core.node_id+'.'+"node_body").position();
                        var body_x =pos_obj.left;
                        var body_y =pos_obj.top;
                        body_event_handler.click_in_content_box_x = event.pageX - body_x;
                        body_event_handler.click_in_content_box_y = event.pageY - body_y;
                        //set the glopal variable to true
                        body_event_handler.clicking = true;
                });
                $(document).mouseup(()=>{
                    body_event_handler.clicking = false;
                        window.onmousemove = null;
                    })
                $("#svg_"+containing_node_core.node_id+'.'+"node_body").mousemove(()=>{
                    if(body_event_handler.clicking == false) return;
                    // Mouse click + moving logic here
                    window.onmousemove = body_event_handler.handle_item_drag;
                });
         

        }

        set_resizer_event_handler = function resizer_event_handler(containing_node_core)
        {
                // here we define the static variables used by the event handlers of this object 
                //variables and funcions defined here will be accesible by the handlers any time later.
                if ( typeof resizer_event_handler.counter == 'undefined' )
                {
                    resizer_event_handler.counter=0;
                    resizer_event_handler.clicking2 = false; // var to know when the resizer is clicked and when mouse click is up.

                    resizer_event_handler.handle_item_resize=(event) =>{

                        event = event || window.event;
                        var new_resizer_x = event.clientX; //position of the resizer is the same as the position of the cursor as it moves
                        var new_resizer_y= event.clientY;

                        var pos_obj = $("#svg_"+containing_node_core.node_id+'.'+"node_body").position(); // position of the body the resizer attached to
                        var body_x =pos_obj.left;
                        var body_y =pos_obj.top;
                        //prevent item from getting smaller than a specific size .. 
                        var min_width=30;
                        var min_height=30;
                        if(event.clientX - body_x < min_width)
                        {    new_resizer_x = body_x+min_width;  }
                        if(event.clientY -body_y < min_height)
                        {    new_resizer_y = body_y+min_height;  }

                        //calculate the new size of node    
                        var new_node_width = new_resizer_x - body_x;
                        var new_node_height = new_resizer_y - body_y;

                        //change the size of the node 
                        //resize the svg
                        $("#svg_"+containing_node_core.node_id+'.'+"node_body").attr('height', new_node_height);
                        $("#svg_"+containing_node_core.node_id+'.'+"node_body").attr('width', new_node_width);
                        //resize the svg content
                        $("#shape_"+containing_node_core.node_id+'.'+"node_body").attr('height', new_node_height-5);
                        $("#shape_"+containing_node_core.node_id+'.'+"node_body").attr('width', new_node_width-5);
                        //reset node resizer position 
                        document.querySelectorAll("#svg_"+containing_node_core.node_id+'.'+"resizer")[0].style.top= (new_resizer_y ) + "px";

                        document.querySelectorAll("#svg_"+containing_node_core.node_id+'.'+"resizer")[0].style.left=(new_resizer_x ) + "px";
                        //reset node connection_points position:
                        this.update_connection_points();


                        //update related paths
                        update_paths(this.containing_node_shell_shell)

                    };

                }

                $("#svg_"+containing_node_core.node_id+'.'+"resizer").mousedown((event)=>{
                //set the glopal variable to true
                resizer_event_handler.clicking2 = true;


                });
                $(document).mouseup(()=>{
                    resizer_event_handler.clicking2 = false;

                    window.onmousemove = null;
                })
                $("#svg_"+containing_node_core.node_id+'.'+"resizer").mousemove(()=>{

                    if(resizer_event_handler.clicking2 == false) return;
                    // Mouse click + moving logic here
                    window.onmousemove = resizer_event_handler.handle_item_resize;
                });

            

        }


    }


