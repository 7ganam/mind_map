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
    /** @member {object}
     * @description  object containing all the points that a path can connect to in this node 
     * the points here only descript the position the paths should connect to... and it's updated by the node core when the node change 
     * other classes may use this object to know the position of connection and display any kind elements on the same position in the dom .. however this object doesn't have 
     * any elements on the dom .. just a represntaion of the connection position....
     *  The format of this object ISN"T STANDARDIZED yet .. will be standardized when i have a genral idea of all path requirement
     * currntly the default node_core fills in the object with the format suitable for the default path core. 
     * the object format is important as the path classes interact with it based on this format
     * the current format allows for other point to be added in case needed ...
     * different path creation algorithms (implemented in path_core extender classes) may exploit this object
     
     * @todo TODO: standardize the format of this object
*/
    this.connection_points = {}
    /** @member {node_shell[]}
     * @description array of references to son nodes this may change to parents laters
     */
    this.sons = [];
    /** @member {default_node_core}  */
    this.node_core = new default_node_core(this, x, y, w, h);


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
