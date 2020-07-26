class path_shell
{
    constructor(id,base_svg,from_node_shell,to_node_shell)
    {
        this. path_id =from_node_shell.node_id + to_node_shell.node_id;
        this.from_node_shell = from_node_shell;
        this.to_node_shell = to_node_shell;
        this.from_object = this.from_node_shell.node_core.connection_points;
        // console.log(this.from_object === this.from_node_shell.node_core.connection_points);

        this.to_object=    to_node_shell.node_core.connection_points;
        this. path_core = new path_core(this,base_svg)
    }
    set_path_core(core_type)
    {
        $('.'+ this.path_id).remove();
    }
    print_test()
    {
        console.log(this.to_object);
    }

}
