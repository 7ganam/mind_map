class path_shell
{
    constructor(id,base_svg,from_node_shell,to_node_shell)
    {
        this.path_id =id;
        this.from_node_shell = from_node_shell;
        this.to_node_shell = to_node_shell;

        // console.log(this.from_connection_points === this.from_node_shell.node_core.connection_points);

        this.path_core = new default_path_core(this,base_svg)
    }
    set_path_core(core_type)
    {
        $('.'+ this.path_id).remove();
    }


}
