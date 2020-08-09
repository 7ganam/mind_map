/** Class containing the meta data of a node.
 * @category path classes
 */
class path_shell {
    /**
     * constructor --create a path shell .
     * @param {string} id - the path id .. it should be unique
     * @param {object} base_svg - the global svg box that all paths are drawn in 
     * @param {node_shell} from_node_shell - the node at the start of the path
     * @param {node_shell} to_node_shell -  the node at the end of the path
     */
    constructor(id, base_svg, from_node_shell, to_node_shell) {
        /** @member {string}  */
        this.path_id = id;
        /** @member {node_shell}  */
        this.from_node_shell = from_node_shell;
        /** @member {node_shell}  */
        this.to_node_shell = to_node_shell;
        /** @member {default_path_core}  */
        this.path_core = new default_path_core(this, base_svg)
    }

    /**
     * NOT IMPLEMENTED
     * change the path core to a specific path core class .. now we have only one path core class later all path core classes will inherent from an abstract class
     * changing the path core will change the shape and behavior (event handlers) of the node
     * @todo Write the abstract path class and change the input type of this fuction to path_core.
     * @param {default_path_core} core_type - input is any object of a class that inherents from node_core (not implemnted yet).
     * @return {void}.
     */
    set_path_core(core_type) {
        $('.' + this.path_id).remove();
    }


}