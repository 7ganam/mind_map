class path_shell
{
    constructor(id,base_svg,from_node_shell,to_node_shell)
    {
        this. path_id =id;
        this.from_object = from_node_shell.node_core.connection_points;
        this.to_object=    to_node_shell.node_core.connection_points;
        this. path_core = new path_core(this,base_svg)
    }
    set_path_core(core_type)
    {
        $('.'+ this.path_id).remove();
    }

}
