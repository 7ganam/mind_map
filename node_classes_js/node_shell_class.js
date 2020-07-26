
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
            $('.'+ this.node_id).remove();

            if (core_type=="def")
            {
                this. node_core = new default_node_core(this,x,y,w,h)
        
            }
            else if(core_type=="red")
            {
                this. node_core = new red_node_core(this,x,y,w,h)
            }
        }
        set_node_son(node)
        {
            this.sons.push(node);
        }
    }
