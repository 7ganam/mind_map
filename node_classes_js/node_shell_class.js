
    class node_shell
    {
        constructor(id,x,y,w,h)
        {
            this. node_id =id;
            this. node_core = new default_node_core(this,x,y,w,h)
            this. sons = [];
        }
        set_node_core(core_type)
        {
            let x =this.node_core.get_x();
            let y =this.node_core.get_y();
            let w =this.node_core.get_width();
            let h = this.node_core.get_height();
            console.log(x,y,w,h)
            $('.'+ this.node_id).remove();

            if (core_type=="def")
            {
                this. node_core = new default_node_core(this,x,y,w,h)
                this.node_core.draw();
                //update related paths
                update_paths(this)
            }
            else if(core_type=="test")
            {
                this. node_core = new test_node_core(this,x,y,w,h)
                this.node_core.draw();
                //update related paths
                update_paths(this)
            }
        }
        set_node_son(node)
        {
            this.sons.push(node);
        }
    }
