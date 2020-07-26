class path_core
{
    constructor(path_shell,base_svg)
    {
        this.path_shell = path_shell;
        this. path_id =path_shell.path_id;
        this.from_object = path_shell.from_object;
        this.to_object= path_shell.to_object;

        let path_end_points = this.find_connection_points_pair(this.path_shell.from_object , this.path_shell.to_object)
        this.html_path =  this.creat_right_path(this. path_id, path_end_points.from_point, path_end_points.to_point , base_svg)
    }

    find_connection_points_pair = function(from_object , to_object)
    {
        let end_points = {
                            from_point :{},
                            to_point : {}
                         }

        if( from_object.right.x <= to_object.left.x)//to is on the right condition
        {
            end_points.from_point=from_object.right;
            end_points.to_point = to_object.left;

        }
        else if(from_object.left.x >= to_object.right.x) //to is on the left condition
        {
            end_points.from_point=from_object.left;
            end_points.to_point = to_object.right;

        }
        else
        {
            if(from_object.top.y >= to_object.top.y)
            {
                console.log(4)
                end_points.from_point=from_object.top;
                end_points.to_point = to_object.bottom;
            }
            if(from_object.bottom.y <= to_object.bottom.y)
            {

                end_points.from_point=from_object.bottom;
                end_points.to_point = to_object.top;
            }
        }
        return end_points;

    }

    creat_right_path = function(id, start_point, end_point ,base_svg)
    {
        
        let middle_x = Math.min(start_point.x, end_point.x) + Math.abs(start_point.x-end_point.x)/2;

        this.middle_start_point= {x:"0"   , y:"0"   };
        this.middle_end_point  = {x:"0"   , y:"0"   };

        this.end_point=end_point;
        this.start_point=start_point;

        this.middle_start_point.y=this.start_point.y;
        this.middle_start_point.x=middle_x;

        this.middle_end_point.y=this.end_point.y;
        this.middle_end_point.x=middle_x;

        this.points_array = [this.start_point ,  this.middle_start_point  ,  this.middle_end_point , this.end_point ];
        //create svg for the path
            this.content_box_svg=base_svg;
        //add the svg box to the dom
            // document.body.appendChild(this.content_box_svg);
        //create path 
            this.p= global_path_creator.create_html_path(this.points_array);
        //add id to the path
            let node_id=id;
            this.p.setAttribute("id", "path_"+node_id);
            this.p.setAttribute("data-from", this.path_shell.from_node_shell.node_id);
            this.p.setAttribute("data-to"  , this.path_shell.to_node_shell.node_id);

        //add the path to the dom
             this.content_box_svg.appendChild( this.p);
            $('#path_'+node_id).click(()=>{
                alert("clicked"); 
            });

        return this.p
    }
    
    update_right_path=function(start_point, end_point ,base_svg)
    {
        let from_id = this.path_shell.from_node_shell.node_id;
        let to_id = this.path_shell.to_node_shell.node_id;
        // $("[data-from='"+from_id + "']" + "[data-to='"+to_id + "']").remove()
        // console.log(this.path_shell.from_node_shell.node_core.connection_points )
        let path_end_points = this.find_connection_points_pair(this.path_shell.from_node_shell.node_core.connection_points , this.path_shell.to_object)
        console.log(path_end_points)
        // this.html_path =  this.creat_right_path(this. path_id, path_end_points.from_point, path_end_points.to_point , base_svg)


        // let path_end_points = this.find_connection_points_pair(this.path_shell.from_object , this.path_shell.to_object)
        start_point=path_end_points.from_point
        end_point  =path_end_points.to_point

        this.middle_start_point= {x:"0"   , y:"0"   };
        this.middle_end_point  = {x:"0"   , y:"0"   };
        let middle_x = Math.min(start_point.x, end_point.x) + Math.abs(start_point.x-end_point.x)/2;

        this.end_point=end_point;
        this.start_point=start_point;

        this.middle_start_point.y=this.start_point.y;
        this.middle_start_point.x=middle_x;

        this.middle_end_point.y=this.end_point.y;
        this.middle_end_point.x=middle_x;
        this.points_array = [this.start_point ,  this.middle_start_point  ,  this.middle_end_point , this.end_point ];

        let new_d_string = global_path_creator.create_path_d_string(this.points_array)
        this.html_path .setAttributeNS(null, "d", new_d_string);

    }


}

