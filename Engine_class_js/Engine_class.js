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
    this.base_svg = this.create_base_svg_and_attach_its_event_handlers(0, 0, 1500, 1500, "base");
    /** @member {boolean} 
    * @description a variable used by the svg_base event handlers to stop changin the view port
    * ..... it's set to true by node event handlers to stop the change of the view port while the node is changing position.
    */
    this.is_changin_viewport_allowed = true;
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
   * whenever a node changes its position it should call this function to loop over the paths_array  {@link Engine#paths_array} and update only the paths that are connected to this node... this function is called by node_cores event handlers that handle the nodes positioning and resizing
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
   * delete node from the nodes_array  {@link Engine#nodes_array} and all related elements from the dom .. 
   * delete all related paths from the dom and the paths_array {@link Engine#paths_array} 
   * @todo TODO: delete the node from the sons array of ony parent nod
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
   * creating the base_svg ... the global svg container that all nodes are drawn into... 
   * attaching event handlers that allow for changing the view port when clicking and draggin on free area
   * @param {number} x - The x position of the top left corenr of the box relative to the window.
   * @param {number} y - The y position of the top left corenr of the box relative to the window.
   * @param {number} w - The width in pixles
   * @param {number} h - The height in pixles
   * @return {object}
   */
  create_base_svg_and_attach_its_event_handlers(x, y, w, h, id) {
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    //set svg style
    svg.style.border = "1px solid black";

    //set svg attributes
    svg.setAttribute("height", h);
    svg.setAttribute("width", w);
    svg.setAttribute("x", x);
    svg.setAttribute("y", y);
    svg.setAttribute("id", id);
    //add the svg to the dom
    document.body.appendChild(svg);

    // Add all mouse events listeners fallback
    svg.addEventListener('mousedown', onPointerDown); // Pressing the mouse
    svg.addEventListener('mouseup', onPointerUp); // Releasing the mouse
    svg.addEventListener('mouseleave', onPointerUp); // Mouse gets out of the SVG area
    svg.addEventListener('mousemove', onPointerMove); // Mouse is moving


    // variables used in event handlers------------start

    // define a variable to make for this keyword inside subfunctions.
    let this_engin = this;
    // This variable will be used later for move events to check if pointer is down or not
    var isPointerDown = false;
    // This variable will contain the original coordinates when the user start pressing the mouse or touching the screen
    var pointerOrigin = {
      x: 0,
      y: 0
    };
    // We save the original values from the viewBox
    svg.current_viewBox = {
      x: 0,
      y: 0,
      width: w,
      height: h
    };
    // The distances calculated from the pointer will be stored here
    var newViewBox = {
      x: 0,
      y: 0
    };
    // Calculate the svg.zoom_ratio based on the viewBox width and the SVG width
    svg.zoom_ratio = svg.current_viewBox.width / svg.getBoundingClientRect().width;
    window.addEventListener('resize', function () {
      svg.zoom_ratio = svg.current_viewBox.width / svg.getBoundingClientRect().width;
    });

    // variables used in event handlers------------end


    // Function called by the event listeners when user start pressing/touching
    function onPointerDown(event) {

      isPointerDown = true; // We set the pointer as down

      // We get the pointer position on click/touchdown so we can get the value once the user starts to drag
      var pointerPosition = getPointFromEvent(event);
      pointerOrigin.x = pointerPosition.x;
      pointerOrigin.y = pointerPosition.y;
    }

    // Function called by the event listeners when user start moving/dragging
    function onPointerMove(event) {
      // Only run this function if the pointer is down
      if (!isPointerDown) {
        return;
      }

      if (this_engin.is_changin_viewport_allowed == false) {
        return
      }
      // This prevent user to do a selection on the page
      event.preventDefault();

      // Get the pointer position
      var pointerPosition = getPointFromEvent(event);

      // We calculate the distance between the pointer origin and the current position
      // The viewBox x & y values must be calculated from the original values and the distances
      newViewBox.x = svg.current_viewBox.x - ((pointerPosition.x - pointerOrigin.x) * svg.zoom_ratio);
      newViewBox.y = svg.current_viewBox.y - ((pointerPosition.y - pointerOrigin.y) * svg.zoom_ratio);

      // We create a string with the new viewBox values
      // The X & Y values are equal to the current viewBox minus the calculated distances
      var viewBoxString = `${newViewBox.x} ${newViewBox.y} ${svg.current_viewBox.width} ${svg.current_viewBox.height}`;
      // We apply the new viewBox values onto the SVG
      if (this_engin.is_changin_viewport_allowed == true) {
        svg.setAttribute('viewBox', viewBoxString);
      }
      // document.querySelector('.viewbox').innerHTML = viewBoxString;
    }

    function onPointerUp() {
      // The pointer is no longer considered as down
      isPointerDown = false;

      // We save the viewBox coordinates based on the last pointer offsets
      svg.current_viewBox.x = newViewBox.x;
      svg.current_viewBox.y = newViewBox.y;
    }


    // helper funtions 
    // This function returns an object with X & Y values from the pointer event
    function getPointFromEvent(event) {
      var point = { x: 0, y: 0 };
      // If even is triggered by a touch event, we get the position of the first finger
      if (event.targetTouches) {
        point.x = event.targetTouches[0].clientX;
        point.y = event.targetTouches[0].clientY;
      } else {
        point.x = event.clientX;
        point.y = event.clientY;
      }
      return point;
    }


    return svg;
  };
}