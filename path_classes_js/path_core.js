class path_core
{
    constructor(path_shell,base_svg)
    {
        this. path_id =path_shell.path_id;
        this.from_object = path_shell.from_object;
        this.to_object= path_shell.to_object;

        let path_end_points = this.find_connection_points_pair(path_shell.from_object , path_shell.to_object)
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
            console.log(1)

        }
        else if(from_object.left.x >= to_object.right.x) //to is on the left condition
        {
            end_points.from_point=from_object.left;
            end_points.to_point = to_object.right;
            console.log(3)

        }
        else
        {
            if(from_object.top.y >= to_object.top.y)
            {
                console.log(4)
                end_points.from_point=from_object.bottom;
                end_points.to_point = to_object.top;
            }
            if(from_object.bottom.y <= to_object.bottom.y)
            {
                console.log(5)

                end_points.from_point=from_object.bottom;
                end_points.to_point = to_object.top;
            }
        }
        return end_points;

    }

    creat_right_path = function(id, start_point, end_point ,base_svg)
    {
        let middle_x = Math.min(start_point.x, end_point.x) + Math.abs(start_point.x-end_point.x)/2;
        console.log(middle_x)

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
        //add the path to the dom
             this.content_box_svg.appendChild( this.p);
            $('#path_'+node_id).click(()=>{
                alert("clicked"); 
            });

        return this.p
    }
    


}

