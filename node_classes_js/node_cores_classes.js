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
    //create the body element
    /** @member {node_shell} 
     * @description  reference to the {@link node_shell} containing this node_core
     */
    this.node_shell = node_shell;
    /** @member {string}  */
    this.node_id = node_shell.node_id;


    let body_html_shape = golpal_shape_creator.create_rectangle(
      2,
      2,
      w - 4,
      h - 4,
      "blue"
    );
    /** @member {element}
     * @description  an element containing both the svg and the shape objects of the node body .. node body is the basic container that contains text,images,etc
     */
    this.body_element = new element(
      node_shell.node_id,
      "body_element",
      body_html_shape,
      x,
      y,
      w,
      h
    );

    let resizer_html_shape = golpal_shape_creator.create_rectangle(
      0,
      0,
      10,
      10,
      "blue"
    );

    //create the resizer element
    /** @member {element}
     * @description  an element containing both the svg and the shape objects of the node resizer .. ther resizer main function is to change the size of the node when clicked and draged 
     */
    this.resizer_element = new element(
      node_shell.node_id,
      "resizer",
      resizer_html_shape,
      x + w,
      y + h,
      10,
      10
    );

    // set up the event handling functionality
    this.set_body_event_handler(this);
    this.set_resizer_event_handler(this);

    //set the connection_points array
    //TODO: take this out the event hanlders and make it a separate function ... update_connection_points();
    //TODO: this is not good modular design ... the format of the object is used by other classes .. it should be encapsulated outside this class to reduce class dependency

    /** @member {object}
     * @description  object containing all the points that a path can connect to in this node type
     * the object format is important as the path classes interact with it based on this format
     * the current format allows for other point to be add in case needed ...
     * different path creation algorithms (implemented in path_core extender classes) may exploit this object
     * */
    this.connection_points = {
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
  }
  /**
   * a function called when the node postion is changed in the dom .. it resets the connection point of node to keep it moving with the node
   * @return {void}.
   */
  update_connection_points() {
    var x = this.get_x();
    var y = this.get_y();
    var w = this.get_width();
    var h = this.get_height();
    this.connection_points.top = {
      label: "top",
      x: x + w / 2,
      y: y,
    };
    this.connection_points.right = {
      label: "right",
      x: x + w,
      y: y + h / 2,
    };
    this.connection_points.bottom = {
      label: "bottom",
      x: x + w / 2,
      y: y + h,
    };
    this.connection_points.left = {
      label: "left",
      x: x,
      y: y + h / 2,
    };
  };
  /**
   * get the x attribute from the dom body element of the node
   * @return {number}.
   */
  get_x() {
    var pos_obj = $("#svg_" + this.node_id + "." + "body_element").position();
    var body_x = pos_obj.left;
    return body_x;
    var body_y = pos_obj.top;
  };
  /**
   * get the y attribute from the dom body element of the node
   * @return {number}.
   */
  get_y() {
    var pos_obj = $("#svg_" + this.node_id + "." + "body_element").position();
    var body_y = pos_obj.top;
    return body_y;
  };
  /**
   * get the width attribute from the dom body element of the node
   * @return {number}.
   */
  get_width() {
    var width = document
      .querySelectorAll("#svg_" + this.node_id + "." + "body_element")[0]
      .getAttribute("width");
    width = Number(width);
    return width;
  };
  /**
   * get the height attribute from the dom body element of the node
   * @return {number}.
   */
  get_height() {
    var height = document
      .querySelectorAll("#svg_" + this.node_id + "." + "body_element")[0]
      .getAttribute("height");
    height = Number(height);
    return height;
  };
  /**
   * draw the node by adding the svg and shape to the dom it uses the {@link element#draw} functions to draw the resizer and body elemnts in the dom
   * @return {void}.
   */
  draw() {
    this.body_element.draw();
    this.resizer_element.draw();
    this.set_body_event_handler(this);
    this.set_resizer_event_handler(this);
  };
  /**
   * add events handlers to the body element in the dom
   * the handlers here add the drag feature of the nodes
   * this is a function 
   * @param {default_node_core} containing_node_core - a reference(link) to the node_core instance it self (passed so the event handler can easily access node_core)
   * @return {void}.
   */
  set_body_event_handler(containing_node_core) {
    function body_event_handler() {}
    if (typeof body_event_handler.counter == "undefined") {

      // here we define the static variables used by the event handlers of this object
      //variables and funcions defined here will be accesible by the handlers any time later.
      // perform  initialization
      body_event_handler.counter = 0;
      body_event_handler.clicking = false; // var to know when the box is clicked and when mouse click is up.
      body_event_handler.click_in_content_box_x = 0; // variables to make drag node relative to the point clicked in the node not the upper left corner
      body_event_handler.click_in_content_box_y = 0;

      //this function is called by the the event attachment below
      //the function used when clicking and moving
      body_event_handler.handle_item_drag = (event) => {
        event = event || window.event;
        var new_x = event.clientX; //position of click
        var new_y = event.clientY;
        //prevent item from getting out of top and left edges of window ..
        //   TODO: make the window resize instead when this happens
        if (event.clientX < 0) {
          new_x = 0;
        }
        if (event.clientY < 0) {
          new_y = 0;
        }
        //reset node position to the new values
        document.querySelectorAll(
            "#svg_" + containing_node_core.node_id + "." + "body_element"
          )[0].style.top =
          new_y - body_event_handler.click_in_content_box_y + "px";
        document.querySelectorAll(
            "#svg_" + containing_node_core.node_id + "." + "body_element"
          )[0].style.left =
          new_x - body_event_handler.click_in_content_box_x + "px";
        //reset node resizer position
        let width = this.get_width();
        let height = this.get_height();
        document.querySelectorAll(
            "#svg_" + containing_node_core.node_id + "." + "resizer"
          )[0].style.top =
          new_y - body_event_handler.click_in_content_box_y + height + "px";
        document.querySelectorAll(
            "#svg_" + containing_node_core.node_id + "." + "resizer"
          )[0].style.left =
          new_x - body_event_handler.click_in_content_box_x + width + "px";

        //reset node connection_points position:
        this.update_connection_points();

        //update related paths
        Engine.update_paths(this.node_shell);
      };
    }

    //TODO: somehow the events are attached to the object before even it's added to the dom i don't understand how the jquery did that.
    //TODO: check the possibility of setting the events based on the html objects directly from js without having to fetch them from the dom
    $("#svg_" + containing_node_core.node_id + "." + "body_element").mousedown(
      (event) => {
        //find the position of the click relative to the upper left corner of the node
        var pos_obj = $(
          "#svg_" + containing_node_core.node_id + "." + "body_element"
        ).position();
        var body_x = pos_obj.left;
        var body_y = pos_obj.top;
        body_event_handler.click_in_content_box_x = event.pageX - body_x;
        body_event_handler.click_in_content_box_y = event.pageY - body_y;
        //set the glopal variable to true
        body_event_handler.clicking = true;
      }
    );
    $(document).mouseup(() => {
      body_event_handler.clicking = false;
      window.onmousemove = null;
    });
    $("#svg_" + containing_node_core.node_id + "." + "body_element").mousemove(
      () => {
        if (body_event_handler.clicking == false) return;
        // Mouse click + moving logic here
        window.onmousemove = body_event_handler.handle_item_drag;
      }
    );
  };

  /**
   * add events handlers to the resizer element in the dom
   * the handlers here add the drag feature of the resizer to make the body size change
   * this is a function 
   * @param {default_node_core} containing_node_core - a reference(link) to the node_core instance it self (passed so the event handler can easily access node_core)
   * @return {void}.
   */
  set_resizer_event_handler(
    containing_node_core
  ) {
    // here we define the static variables used by the event handlers of this object
    //variables and funcions defined here will be accesible by the handlers any time later.
    function resizer_event_handler() {}
    if (typeof resizer_event_handler.counter == "undefined") {
      resizer_event_handler.counter = 0;
      resizer_event_handler.clicking2 = false; // var to know when the resizer is clicked and when mouse click is up.
      resizer_event_handler.handle_item_resize = (event) => {
        event = event || window.event;
        var new_resizer_x = event.clientX; //position of the resizer is the same as the position of the cursor as it moves
        var new_resizer_y = event.clientY;

        var pos_obj = $(
          "#svg_" + containing_node_core.node_id + "." + "body_element"
        ).position(); // position of the body the resizer attached to
        var body_x = pos_obj.left;
        var body_y = pos_obj.top;
        //prevent item from getting smaller than a specific size ..
        var min_width = 30;
        var min_height = 30;
        if (event.clientX - body_x < min_width) {
          new_resizer_x = body_x + min_width;
        }
        if (event.clientY - body_y < min_height) {
          new_resizer_y = body_y + min_height;
        }

        //calculate the new size of node
        var new_node_width = new_resizer_x - body_x;
        var new_node_height = new_resizer_y - body_y;

        //change the size of the node
        //resize the svg
        $("#svg_" + containing_node_core.node_id + "." + "body_element").attr(
          "height",
          new_node_height
        );
        $("#svg_" + containing_node_core.node_id + "." + "body_element").attr(
          "width",
          new_node_width
        );
        //resize the svg content
        $("#shape_" + containing_node_core.node_id + "." + "body_element").attr(
          "height",
          new_node_height - 5
        );
        $("#shape_" + containing_node_core.node_id + "." + "body_element").attr(
          "width",
          new_node_width - 5
        );
        //reset node resizer position
        document.querySelectorAll(
          "#svg_" + containing_node_core.node_id + "." + "resizer"
        )[0].style.top = new_resizer_y + "px";

        document.querySelectorAll(
          "#svg_" + containing_node_core.node_id + "." + "resizer"
        )[0].style.left = new_resizer_x + "px";
        //reset node connection_points position:
        this.update_connection_points();

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
  };
}

// class test_node_core {
//   constructor(node_shell, x, y, w, h) {
//     //create the body element
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

//     //set the connection_points array
//     //TODO: take this out the event hanlders and make it a separate function ... update_connection_points();
//     this.connection_points = {
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
//     var x = this.get_x();
//     var y = this.get_y();
//     var w = this.get_width();
//     var h = this.get_height();
//     this.connection_points.top = {
//       label: "top",
//       x: x + w / 2,
//       y: y,
//     };
//     this.connection_points.right = {
//       label: "right",
//       x: x + w,
//       y: y + h / 2,
//     };
//     this.connection_points.bottom = {
//       label: "bottom",
//       x: x + w / 2,
//       y: y + h,
//     };
//     this.connection_points.left = {
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
//    * add events handlers to the body element in the dom
//    * the handlers here add the drag feature of the nodes
//    * @param {default_node_core} containing_node_core - a reference(link) to the node_core instance it self (passed so the event handler can easily access node_core)
//    * @return {void}.
//    */
//   body_event_handler(containing_node_core) {
//     // here we define the static variables used by the event handlers of this object
//     //variables and funcions defined here will be accesible by the handlers any time later.
//     if (typeof body_event_handler.counter == "undefined") {
//       // perform  initialization
//       body_event_handler.counter = 0;
//       body_event_handler.clicking = false; // var to know when the box is clicked and when mouse click is up.
//       body_event_handler.click_in_content_box_x = 0; // variables to make drag node relative to the point clicked in the node not the upper left corner
//       body_event_handler.click_in_content_box_y = 0;

//       //this function is called by the the event attachment below
//       //the function used when clicking and moving
//       body_event_handler.handle_item_drag = (event) => {
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
//           new_y - body_event_handler.click_in_content_box_y + "px";
//         document.querySelectorAll(
//             "#svg_" + containing_node_core.node_id + "." + "body_element"
//           )[0].style.left =
//           new_x - body_event_handler.click_in_content_box_x + "px";
//         //reset node resizer position
//         let width = this.get_width();
//         let height = this.get_height();
//         document.querySelectorAll(
//             "#svg_" + containing_node_core.node_id + "." + "resizer"
//           )[0].style.top =
//           new_y - body_event_handler.click_in_content_box_y + height + "px";
//         document.querySelectorAll(
//             "#svg_" + containing_node_core.node_id + "." + "resizer"
//           )[0].style.left =
//           new_x - body_event_handler.click_in_content_box_x + width + "px";

//         //reset node connection_points position:
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
//         body_event_handler.click_in_content_box_x = event.pageX - body_x;
//         body_event_handler.click_in_content_box_y = event.pageY - body_y;
//         //set the glopal variable to true
//         body_event_handler.clicking = true;
//       }
//     );
//     $(document).mouseup(() => {
//       body_event_handler.clicking = false;
//       window.onmousemove = null;
//     });
//     $("#svg_" + containing_node_core.node_id + "." + "body_element").mousemove(
//       () => {
//         if (body_event_handler.clicking == false) return;
//         // Mouse click + moving logic here
//         window.onmousemove = body_event_handler.handle_item_drag;
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
//         ).position(); // position of the body the resizer attached to
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
//         //reset node connection_points position:
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