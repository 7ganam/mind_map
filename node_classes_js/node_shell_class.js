/** Class containing the meta data of a node.
 * @category node classes
 */
class node_shell {
  /**
   * constructor --create a nodeshell.
   * @param {Engine} Engin - a reference to the global engine object
   * @param {string} id - the node id .. it should be unique
   * @param {number} x - The x position of the top left corenr of the node relative to the window.
   * @param {number} y - The y position of the top left corenr of the node relative to the window.
   * @param {number} w - The width in pixles
   * @param {number} h - The height in pixles
   */
  constructor(Engin, id, x, y, w, h) {
    /** @member {string}  */
    this.node_id = id;
    /** @member {Engine}  */
    this.engine = Engin;
    /** @member {default_node_core}  */
    this.node_core = new default_node_core(this, x, y, w, h);

    /** @member {default_node_core[]}
     * @description array of references to son nodes this may change to parents laters
     */
    this.sons = [];
  }
  /**
   * change the node core to a specific node core class .. now we have only one node core class later all node core classes will inherent from an abstract class
   * changing the node core will change the shape and behavior (event handlers) of the node
   * @todo Write the abstract node class and change the input type of this fuction to node_core.
   * @param {default_node_core} core_type - input is any object of a class that inherents from node_core (not implemnted yet).
   * @return {void}.
   */
  set_node_core(core_type) {
    //get the current node position
    let x = this.node_core.get_x();
    let y = this.node_core.get_y();
    let w = this.node_core.get_width();
    let h = this.node_core.get_height();
    //delete the old node object from the dom
    $("." + this.node_id).remove();
    //generate an object of the required node_core type
    //for every new node_core type you write add an else if condition in this block to be able to use it
    if (core_type == "def") {
      this.node_core = new default_node_core(this, x, y, w, h);
      this.node_core.draw();
      //update related paths
      update_paths(this);
    } else if (core_type == "test") {
      this.node_core = new test_node_core(this, x, y, w, h);
      this.node_core.draw();
      //update related paths
      update_paths(this);
    }
  }
  /**
   * add a son to the node
   * @param {node_shell} node - the son node .. it will be appended in the {@link sons}
   * @return {void}.
   */
  set_node_son(node) {
    this.sons.push(node);
  }
}
