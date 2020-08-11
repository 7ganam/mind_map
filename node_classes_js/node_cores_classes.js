/** Class containing the look and feel of a node .. it's used as a member variable in the {@link node_shell} class.
 * @category node classes
 */
class default_node_core {
  /**
   * constructor --create a new node_core
   * @param {node_shell} node_shell - a reference to the containing node_shell
   * @param {number} x - The x position of the top left corenr of the node relative to the window.
   * @param {number} y - The y position of the top left corenr of the node relative to the window.
   * @param {number} w - The width in pixles
   * @param {number} h - The height in pixles
   */
  constructor(node_shell, x, y, w, h) {
    //create the body_dom_svg element
    /** @member {node_shell}
     * @description  reference to the {@link node_shell} containing this node_core
     */
    this.node_shell = node_shell;
    /** @member {string}  */
    this.node_id = node_shell.node_id;

    let body_html_shape = golpal_shape_creator.create_rectangle(2, 2, w - 4, h - 4, "blue");

    /** @member {element}
     * @description  an element containing both the svg and the shape objects of the node body_dom_svg .. node body_dom_svg is the basic container that contains text,images,etc
     */
    this.body_element = new element(node_shell.node_id, "body_element", body_html_shape, x, y, w, h);
    let resizer_html_shape = golpal_shape_creator.create_rectangle(0, 0, 10, 10, "blue");

    //create the resizer element
    /** @member {element}
     * @description  an element containing both the svg and the shape objects of the node resizer .. ther resizer main function is to change the size of the node when clicked and draged
     */
    this.resizer_element = new element(node_shell.node_id, "resizer", resizer_html_shape, x + w, y + h, 10, 10);

    //set the node_shell.connection_points array
    //TODO: take this out the event hanlders and make it a separate function ... update_connection_points();

    this.node_shell.connection_points = {
      top: {
        label: "top",
        x: x + w / 2,
        y: y,
      },
      right: {
        label: "right",
        x: x + w,
        y: y + h / 2,
      },
      bottom: {
        label: "bottom",
        x: x + w / 2,
        y: y + h,
      },
      left: {
        label: "left",
        x: x,
        y: y + h / 2,
      },
    };

    /** @member {object}
     * @description  object containing a set of element object {@link element} that are a visualization of the connection points on the dom .. they have event handler function
     * check the event handler setter function {@link default_node_core#set_connection_elements_event_handler}
     * currently the implimintation is core specific ... meaning it may change from core to core
     */
    this.connection_points_lements = {};
    for (const property in this.node_shell.connection_points) {
      let cpshap = golpal_shape_creator.create_rectangle(0, 0, 10, 10, "blue");
      this.connection_points_lements[property] = new element(
        node_shell.node_id,
        property,
        cpshap,
        this.node_shell.connection_points[property].x,
        this.node_shell.connection_points[property].y,
        10,
        10
      );
      // this.connection_points_lements[property].draw();

      // console.log(`${property}: ${ this.node_shell.connection_points[property].x }`);
    }
    // console.log(this.connection_points_lements.top.get_y());

    // this.set_connection_elements_event_handler(this);

  }

  /**
   * a function called when the node postion is changed in the dom .. it resets the connection point of node to keep it moving with the node
   * @return {void}.
   */
  update_connection_points() {
    var x = this.body_element.get_x();
    var y = this.body_element.get_y();
    var w = this.body_element.get_width();
    var h = this.body_element.get_height();
    this.node_shell.connection_points.top = {
      label: "top",
      x: x + w / 2,
      y: y,
    };
    this.node_shell.connection_points.right = {
      label: "right",
      x: x + w,
      y: y + h / 2,
    };
    this.node_shell.connection_points.bottom = {
      label: "bottom",
      x: x + w / 2,
      y: y + h,
    };
    this.node_shell.connection_points.left = {
      label: "left",
      x: x,
      y: y + h / 2,
    };
  }
  update_connection_points_elements() {
    this.connection_points_lements.top.set_position(
      this.node_shell.connection_points.top.x,
      this.node_shell.connection_points.top.y
    );
    this.connection_points_lements.right.set_position(
      this.node_shell.connection_points.right.x,
      this.node_shell.connection_points.right.y
    );
    this.connection_points_lements.bottom.set_position(
      this.node_shell.connection_points.bottom.x,
      this.node_shell.connection_points.bottom.y
    );
    this.connection_points_lements.left.set_position(
      this.node_shell.connection_points.left.x,
      this.node_shell.connection_points.left.y
    );
  }
  /**
   * draw all the node elements (body_dom_svg-resizer-connectionelement-etc)  by adding the svg and shape to the dom it uses the {@link element#draw} functions to draw the resizer and body_dom_svg elemnts in the dom
   * after drawing the node element the event handlers are set ... event handlers cant be set  before the elements are added to the dom
   * @return {void}.
   */
  draw_and_set_event_handlers() {
    this.body_element.draw(this.node_shell.engine.base_svg);
    this.resizer_element.draw(this.node_shell.engine.base_svg);

    for (const property in this.connection_points_lements) {
      this.connection_points_lements[property].draw(this.node_shell.engine.base_svg);
    }

    this.set_connection_elements_event_handler(this);
    this.set_body_event_handler(this);
    this.set_resizer_event_handler(this);
  }
  /**
   * add events handlers to the body_dom_svg element in the dom
   * the handlers here add the drag feature of the node ++ delete the node with all its elements on right click
   * @param {default_node_core} containing_node_core - a reference(link) to the node_core instance it self (passed so the event handler can easily access node_core)
   * @return {void}.
   */
  set_body_event_handler(containing_node_core) {

    // perform  initialization
    let isPointerDown = false; // var to know when the box is clicked and when mouse click is up.
    let click_relative_to_body_x = 0; // variables to make drag node relative to the point clicked in the body svg box not the upper left corner
    let click_relative_to_body_y = 0;

    let this_node_core = this; // replace the "this" keyword with "this_node_core" to make the object accisble inside the nested functions
    let body_dom_svg = document.querySelector(this.body_element.dom_svg_selector)

    body_dom_svg.addEventListener('mousedown', on_moused_down); // Pressing the mouse
    document.addEventListener('mouseup', on_mouse_up); // Pressing the mouse
    body_dom_svg.addEventListener('mousemove', on_mouse_move); // Pressing the mouse


    function on_moused_down(event) {
      switch (event.which) {
        case 1: //left click
          //find the position of the click relative to the upper left corner of the node body_dom_svg
          var body_x = event.currentTarget.getAttribute("x");
          var body_y = event.currentTarget.getAttribute("y");
          click_relative_to_body_x = event.pageX - body_x;
          click_relative_to_body_y = event.pageY - body_y;
          //set the glopal variable to true
          isPointerDown = true;
          //tell the engine base svg not to activate its own on_Mouse_move event handler
          Engine.is_changin_viewport_allowed = false;
          break;
        case 3:
          // stop right click menu
          $(document).bind("contextmenu", function (e) {
            return false;
          });
          Engine.delete_node(this_node_core.node_shell);
          break;
        default:
          alert("You have a strange Mouse!");
      }

    }

    function on_mouse_up(event) {
      isPointerDown = false;
      //tell the engine base svg its free to use its own on_Mouse_move event handler
      Engine.is_changin_viewport_allowed = true;
      // Engine.base_svg.onmousemove = null;
      Engine.base_svg.removeEventListener('mousemove', move_node_with_clicked_pointer);

    }

    function on_mouse_move(event) {
      if (isPointerDown == false) return;
      // Mouse click + moving logic here
      // Engine.base_svg.onmousemove = move_node_with_clicked_pointer;
      Engine.base_svg.addEventListener('mousemove', move_node_with_clicked_pointer);

    }

    function move_node_with_clicked_pointer(event) {

      event = event || window.event;
      var click_x = event.clientX; //position of click
      var click_y = event.clientY;

      var new_x = click_x //+ Engine.base_svg.current_viewBox.x;
      var new_y = click_y //+ Engine.base_svg.current_viewBox.y;
      //prevent item from getting out of top and left edges of window ..
      if (event.clientX < 0) {
        new_x = 0;
      }
      if (event.clientY < 0) {
        new_y = 0;
      }
      this_node_core.body_element.set_position(
        new_x - click_relative_to_body_x,
        new_y - click_relative_to_body_y
      );
      //reset node resizer position
      let width = this_node_core.body_element.get_width();
      let height = this_node_core.body_element.get_height();
      this_node_core.resizer_element.set_position(
        new_x - click_relative_to_body_x + width,
        new_y - click_relative_to_body_y + height
      );
      //reset node node_shell.connection_points position:
      this_node_core.update_connection_points();
      this_node_core.update_connection_points_elements();
      //update related paths
      Engine.update_paths(this_node_core.node_shell);
    };


  }
  /**
   * add events handlers to the resizer element in the dom
   * the handlers here add the drag feature of the resizer to make the body_dom_svg size change
   * this is a function
   * @param {default_node_core} containing_node_core - a reference(link) to the node_core instance it self (passed so the event handler can easily access node_core)
   * @return {void}.
   */
  set_resizer_event_handler(containing_node_core) {
    // here we define the static variables used by the event handlers of this object
    //variables and funcions defined here will be accesible by the handlers any time later.
    function resizer_event_handler() { }
    if (typeof resizer_event_handler.counter == "undefined") {
      resizer_event_handler.counter = 0;
      resizer_event_handler.clicking2 = false; // var to know when the resizer is clicked and when mouse click is up.
      resizer_event_handler.handle_item_resize = (event) => {
        event = event || window.event;
        var new_resizer_x = event.clientX; //position of the resizer is the same as the position of the cursor as it moves
        var new_resizer_y = event.clientY;

        var body_x = this.body_element.get_x();
        var body_y = this.body_element.get_y();
        //prevent item from getting smaller than a specific size ..
        var min_width = 30;
        var min_height = 30;
        if (event.clientX - body_x < min_width) {
          new_resizer_x = body_x + min_width;
        }
        if (event.clientY - body_y < min_height) {
          new_resizer_y = body_y + min_height;
        }

        //calculate the new size of the body_dom_svg
        var new_node_width = new_resizer_x - body_x;
        var new_node_height = new_resizer_y - body_y;

        //change the size of the body_dom_svg element (both the svg box and the container)
        this.body_element.set_size(new_node_width, new_node_height);
        this.resizer_element.set_position(new_resizer_x, new_resizer_y);

        //reset node node_shell.connection_points position:
        this.update_connection_points();
        this.update_connection_points_elements();
        //update related paths
        Engine.update_paths(this.node_shell);
      };
    }

    $("#svg_" + containing_node_core.node_id + "." + "resizer").mousedown(
      (event) => {
        //set the glopal variable to true
        resizer_event_handler.clicking2 = true;
      }
    );
    $(document).mouseup(() => {
      resizer_event_handler.clicking2 = false;

      window.onmousemove = null;
    });
    $("#svg_" + containing_node_core.node_id + "." + "resizer").mousemove(
      () => {
        if (resizer_event_handler.clicking2 == false) return;
        // Mouse click + moving logic here
        window.onmousemove = resizer_event_handler.handle_item_resize;
      }
    );
  }
  /**
   * add events handlers to the connection_points_elements in the dom
   * the handlers here add a son node to the current node and draw it in the dom with the connecting path
   * @param {default_node_core} containing_node_core - a reference(link) to the node_core instance itself (passed so the event handler can easily access node_core)
   * @return {void}.
   */
  set_connection_elements_event_handler(containing_node_core) {
    //loop over connection points ... make them add son to current node when clicked .. the add the son node to the engine node array then attach its event handlers
    for (const property in this.connection_points_lements) {
      // this.connection_points_lements[property].draw();

      $(this.connection_points_lements[property].dom_svg_selector).mousedown(
        (event) => {
          let xx = this.body_element.get_x();
          let yy = this.body_element.get_y();

          //create the new son node 
          let new_son_node = Engine.create_node(xx + 200, yy, 100, 100);
          //add the son to the current node
          Engine.add_son(this.node_shell, new_son_node);
          //draw and attach the event handlers of the new son node
          new_son_node.node_core.draw_and_set_event_handlers(new_son_node);
        }
      );
    }
  }
}

// class test_node_core {
//   constructor(node_shell, x, y, w, h) {
//     //create the body_dom_svg element
//     this.node_shell = node_shell;
//     this.node_id = node_shell.node_id;
//     //create a specific shape for this core .. this may change for each core type
//     var body_html_shape = golpal_shape_creator.create_rectangle(
//       20,
//       20,
//       w - 4,
//       h - 4,
//       "blue"
//     );
//     this.body_element = new element(
//       node_shell.node_id,
//       "body_element",
//       body_html_shape,
//       x,
//       y,
//       w,
//       h
//     );
//     // this.body_element.draw();

//     //create the resizer element
//     var resizer_html_shape = golpal_shape_creator.create_rectangle(
//       0,
//       0,
//       10,
//       10,
//       "blue"
//     );
//     this.resizer_element = new element(
//       node_shell.node_id,
//       "resizer",
//       resizer_html_shape,
//       x + w,
//       y + h,
//       10,
//       10
//     );
//     // this.resizer_element.draw();

//     // set up the event handling functionality
//     this.body_event_handler(this);
//     this.set_resizer_event_handler(this);

//     //set the node_shell.connection_points array
//     //TODO: take this out the event hanlders and make it a separate function ... update_connection_points();
//     this.node_shell.connection_points = {
//       top: {
//         label: "top",
//         x: x + w / 2,
//         y: y,
//       },
//       right: {
//         label: "right",
//         x: x + w,
//         y: y + h / 2,
//       },
//       bottom: {
//         label: "bottom",
//         x: x + w / 2,
//         y: y + h,
//       },
//       left: {
//         label: "left",
//         x: x,
//         y: y + h / 2,
//       },
//     };
//   }

//   update_connection_points = function () {
//     var x = this.body_element.get_x();
//     var y = this.body_element.get_y();
//     var w = this.body_element.get_width();
//     var h = this.body_element.get_height();
//     this.node_shell.connection_points.top = {
//       label: "top",
//       x: x + w / 2,
//       y: y,
//     };
//     this.node_shell.connection_points.right = {
//       label: "right",
//       x: x + w,
//       y: y + h / 2,
//     };
//     this.node_shell.connection_points.bottom = {
//       label: "bottom",
//       x: x + w / 2,
//       y: y + h,
//     };
//     this.node_shell.connection_points.left = {
//       label: "left",
//       x: x,
//       y: y + h / 2,
//     };
//   };
//   get_x = function () {
//     var pos_obj = $("#svg_" + this.node_id + "." + "body_element").position();
//     var body_x = pos_obj.left;
//     return body_x;
//     var body_y = pos_obj.top;
//   };
//   get_y = function () {
//     var pos_obj = $("#svg_" + this.node_id + "." + "body_element").position();
//     var body_y = pos_obj.top;
//     return body_y;
//   };
//   get_width = function () {
//     var width = document
//       .querySelectorAll("#svg_" + this.node_id + "." + "body_element")[0]
//       .getAttribute("width");
//     width = Number(width);
//     return width;
//   };
//   get_height = function () {
//     var height = document
//       .querySelectorAll("#svg_" + this.node_id + "." + "body_element")[0]
//       .getAttribute("height");
//     height = Number(height);
//     return height;
//   };
//   draw = function () {
//     this.body_element.draw();
//     this.resizer_element.draw();
//     this.body_event_handler(this);
//     this.set_resizer_event_handler(this);
//   };

//   /**
//    * add events handlers to the body_dom_svg element in the dom
//    * the handlers here add the drag feature of the nodes
//    * @param {default_node_core} containing_node_core - a reference(link) to the node_core instance it self (passed so the event handler can easily access node_core)
//    * @return {void}.
//    */
//   body_event_handler(containing_node_core) {
//     // here we define the static variables used by the event handlers of this object
//     //variables and funcions defined here will be accesible by the handlers any time later.
//     if (typeof counter == "undefined") {
//       // perform  initialization
//       counter = 0;
//       isPointerDown = false; // var to know when the box is clicked and when mouse click is up.
//       click_relative_to_body_x = 0; // variables to make drag node relative to the point clicked in the node not the upper left corner
//       click_relative_to_body_y = 0;

//       //this function is called by the the event attachment below
//       //the function used when isPointerDown and moving
//       handle_item_drag = (event) => {
//         event = event || window.event;
//         var new_x = event.clientX; //position of click
//         var new_y = event.clientY;
//         //prevent item from getting out of top and left edges of window ..
//         //   TODO: make the window resize instead when this happens
//         if (event.clientX < 0) {
//           new_x = 0;
//         }
//         if (event.clientY < 0) {
//           new_y = 0;
//         }
//         //reset node position to the new values
//         document.querySelectorAll(
//             "#svg_" + containing_node_core.node_id + "." + "body_element"
//           )[0].style.top =
//           new_y - click_relative_to_body_y + "px";
//         document.querySelectorAll(
//             "#svg_" + containing_node_core.node_id + "." + "body_element"
//           )[0].style.left =
//           new_x - click_relative_to_body_x + "px";
//         //reset node resizer position
//         let width = this.body_element.get_width();
//         let height = this.body_element.get_height();
//         document.querySelectorAll(
//             "#svg_" + containing_node_core.node_id + "." + "resizer"
//           )[0].style.top =
//           new_y - click_relative_to_body_y + height + "px";
//         document.querySelectorAll(
//             "#svg_" + containing_node_core.node_id + "." + "resizer"
//           )[0].style.left =
//           new_x - click_relative_to_body_x + width + "px";

//         //reset node node_shell.connection_points position:
//         this.update_connection_points();

//         //update related paths
//         Engine.update_paths(this.node_shell);
//       };
//     }

//     //TODO: somehow the events are attached to the object before even it's added to the dom i don't understand how the jquery did that.
//     //TODO: check the possibility of setting the events based on the html objects directly from js without having to fetch them from the dom
//     $("#svg_" + containing_node_core.node_id + "." + "body_element").mousedown(
//       (event) => {
//         //find the position of the click relative to the upper left corner of the node
//         var pos_obj = $(
//           "#svg_" + containing_node_core.node_id + "." + "body_element"
//         ).position();
//         var body_x = pos_obj.left;
//         var body_y = pos_obj.top;
//         click_relative_to_body_x = event.pageX - body_x;
//         click_relative_to_body_y = event.pageY - body_y;
//         //set the glopal variable to true
//         isPointerDown = true;
//       }
//     );
//     $(document).mouseup(() => {
//       isPointerDown = false;
//       window.onmousemove = null;
//     });
//     $("#svg_" + containing_node_core.node_id + "." + "body_element").mousemove(
//       () => {
//         if (isPointerDown == false) return;
//         // Mouse click + moving logic here
//         window.onmousemove = handle_item_drag;
//       }
//     );
//   };
//   /**
//    * add events handlers to the resizer element in the dom
//    * the handlers here add size change features when clicked and dragged
//    * @param {default_node_core} containing_node_core - a reference(link) to the node_core instance it self (passed so the event handler can easily access node_core)
//    * @return {void}.
//    */
//   set_resizer_event_handler = function resizer_event_handler(
//     containing_node_core
//   ) {
//     // here we define the static variables used by the event handlers of this object
//     //variables and funcions defined here will be accesible by the handlers any time later.
//     if (typeof resizer_event_handler.counter == "undefined") {
//       resizer_event_handler.counter = 0;
//       resizer_event_handler.clicking2 = false; // var to know when the resizer is clicked and when mouse click is up.

//       resizer_event_handler.handle_item_resize = (event) => {
//         event = event || window.event;
//         var new_resizer_x = event.clientX; //position of the resizer is the same as the position of the cursor as it moves
//         var new_resizer_y = event.clientY;

//         var pos_obj = $(
//           "#svg_" + containing_node_core.node_id + "." + "body_element"
//         ).position(); // position of the body_dom_svg the resizer attached to
//         var body_x = pos_obj.left;
//         var body_y = pos_obj.top;
//         //prevent item from getting smaller than a specific size ..
//         var min_width = 30;
//         var min_height = 30;
//         if (event.clientX - body_x < min_width) {
//           new_resizer_x = body_x + min_width;
//         }
//         if (event.clientY - body_y < min_height) {
//           new_resizer_y = body_y + min_height;
//         }

//         //calculate the new size of node
//         var new_node_width = new_resizer_x - body_x;
//         var new_node_height = new_resizer_y - body_y;

//         //change the size of the node
//         //resize the svg
//         $("#svg_" + containing_node_core.node_id + "." + "body_element").attr(
//           "height",
//           new_node_height
//         );
//         $("#svg_" + containing_node_core.node_id + "." + "body_element").attr(
//           "width",
//           new_node_width
//         );
//         //resize the svg content
//         $("#shape_" + containing_node_core.node_id + "." + "body_element").attr(
//           "height",
//           new_node_height - 5
//         );
//         $("#shape_" + containing_node_core.node_id + "." + "body_element").attr(
//           "width",
//           new_node_width - 5
//         );
//         //reset node resizer position
//         document.querySelectorAll(
//           "#svg_" + containing_node_core.node_id + "." + "resizer"
//         )[0].style.top = new_resizer_y + "px";

//         document.querySelectorAll(
//           "#svg_" + containing_node_core.node_id + "." + "resizer"
//         )[0].style.left = new_resizer_x + "px";
//         //reset node node_shell.connection_points position:
//         this.update_connection_points();

//         //update related paths
//         Engine.update_paths(this.node_shell);
//       };
//     }

//     $("#svg_" + containing_node_core.node_id + "." + "resizer").mousedown(
//       (event) => {
//         //set the glopal variable to true
//         resizer_event_handler.clicking2 = true;
//       }
//     );
//     $(document).mouseup(() => {
//       resizer_event_handler.clicking2 = false;

//       window.onmousemove = null;
//     });
//     $("#svg_" + containing_node_core.node_id + "." + "resizer").mousemove(
//       () => {
//         if (resizer_event_handler.clicking2 == false) return;
//         // Mouse click + moving logic here
//         window.onmousemove = resizer_event_handler.handle_item_resize;
//       }
//     );
//   };
// }