/** class Engine..it is decleared once to create an object to manage all of the nodes */
class Engine {
  /**
   * create the base_svg that all baths are drawn in and the paths and nodes arrays to keep track of all object in the runnig code
   * @global
   * @date 2020-08-09
   * @returns {void}
   */
  constructor() {
    /** @member {node_shell[]} 
     * @description  a list containg all the nodes {@link node_shell} 
     */
    this.nodes_array = [];
    /** @member {path_shell[]} 
     * @description  a list containg all the paths {@link path_shell} 
     */
    this.paths_array = [];
    /** @member {object} 
     * @description the global svg box object that all paths are drawn in 
     */
    this.base_svg = this.create_svg(0, 0, 1500, 1500);
    document.body.appendChild(this.base_svg);
  }


  /**
   * create a new node_shell with the default node_core and give it a unique id then add it to the nodes_array {@link Engine#nodes_array}
   * the node is not drawn automatically in the dom .. a separate draw() method should be called later 
   * @param {number} x - The x position of the top left corenr of the node relative to the window.
   * @param {number} y - The y position of the top left corenr of the node relative to the window.
   * @param {number} w - The width in pixles
   * @param {number} h - The height in pixles
   * @return {node_shell}.
   */
  create_node(x, y, w, h) {
    var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    var uniqid = randLetter + Date.now();
    let new_node_shell = new node_shell(this, uniqid, x, y, w, h);
    this.nodes_array.push(new_node_shell);
    return new_node_shell
  }
  /**
   * create a path_shell connecting two nodes using the default node_core and add it to the paths_array {@link Engine#paths_array} .. the graph is drawn automatically in the dom
   * @param {node_shell} parent_node -
   * @param {node_shell} son_node - 
   * @return {void}.-
   */
  create_path(parent_node, son_node) {
    var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    var uniqid = randLetter + Date.now();
    var my_path1 = new path_shell(uniqid, this.base_svg, parent_node, son_node);
    this.paths_array.push(my_path1);
  }
  /**
   * loop ovrr all the nodes in the nodes_array  {@link Engine#nodes_array} and draw them in the dom
   * @param {node_shell} parent_node -
   * @param {node_shell} son_node -
   * @return {void}
   */
  draw_nodes() {
    this.nodes_array.forEach((node_shell) => {
      node_shell.node_core.draw_and_set_event_handlers();
    });
  }
  /**
   * add a node in the sons array {@link node_shell#sons} of another node - to indecate a path should start from the parent node to the son node - 
   * @param {node_shell} parent_node -
   * @param {node_shell} son_node - The width in pixles
   * @return {void}
   */
  add_son(parent_node, son_node) {
    parent_node.set_node_son(son_node);
    this.create_path(parent_node, son_node);
  }
  /**
   * loop over the nodes_array  {@link Engine#nodes_array} and create paths between sons and parents ...the paths are drawn atuomatically 
   * @return {void}
   */
  create_paths() {
    this.nodes_array.forEach((node_shell) => {
      node_shell.sons.forEach((son_node_shell) => {
        var randLetter = String.fromCharCode(
          65 + Math.floor(Math.random() * 26)
        );
        var uniqid = randLetter + Date.now();
        my_path1 = new path_shell(
          uniqid,
          this.base_svg,
          node_shell,
          son_node_shell
        );
        this.paths_array.push(my_path1);
      });
    });
  };
  /**
   * whenever a node changes its position it should call this function to loop over the nodes_array  {@link Engine#nodes_array} and update only the paths that are connected to this node... this function is called by node_cores event handlers that handle the nodes positioning and resizing
   * @return {void}
   */
  update_paths(node) {
    let paths_to_be_ubdated = this.paths_array.filter(function (path_i) {
      return path_i.from_node_shell === node || path_i.to_node_shell === node;
    });
    paths_to_be_ubdated.forEach(myFunction);

    function myFunction(path_i, index) {
      path_i.path_core.update_path();
    }
  };
  /**
   * delete node from the nodes_array  {@link Engine#nodes_array} and all related elements from the dom .. delete all related paths from the dom and the paths_array {@link Engine#paths_array} 
   * @return {void}
   */
  delete_node(node_shell) {
    let node_id = node_shell.node_id;
    //remove the element from the dom
    $("." + node_id).remove();
    // remove the element from the nodes_array
    for (var i = this.nodes_array.length - 1; i >= 0; --i) {
      if (this.nodes_array[i].node_id == node_id) {
        this.nodes_array.splice(i, 1);
      }
    }
    //remove any related path from the dom
    let paths_to_be_ubdated = this.paths_array.filter(function (path_i) {
      return path_i.from_node_shell === node_shell || path_i.to_node_shell === node_shell;
    });
    paths_to_be_ubdated.forEach((path_i, index) => {
      path_i.path_core.update_path();
      let path_id = path_i.path_id;
      //remove the path from the dom
      $("#" + "path_" + path_id).remove();
      // remove the element from the nodes_array
      for (var i = this.paths_array.length - 1; i >= 0; --i) {
        if (this.paths_array[i].path_id == path_id) {
          this.paths_array.splice(i, 1);
        }
      }

    });

  }
  /**
   * a simple function to create an svg box object
   * @param {number} x - The x position of the top left corenr of the box relative to the window.
   * @param {number} y - The y position of the top left corenr of the box relative to the window.
   * @param {number} w - The width in pixles
   * @param {number} h - The height in pixles
   * @return {object}
   */
  create_svg(x, y, w, h) {
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    //set svg style
    svg.style.border = "1px solid black";
    svg.style.position = "fixed";
    svg.style.top = y + "px"; //position relative to the window
    svg.style.left = x + "px";
    //set svg attributes
    svg.setAttribute("height", h);
    svg.setAttribute("width", w);
    return svg;
  };
}