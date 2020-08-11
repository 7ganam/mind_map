/** Class defining the look and feel of a path ... it is used as a member property inside path_shell class and never used alone
 * @todo this class should inherent from an abstract classes deining the interface of the path_core to 
 * @category path classes
 */
class default_path_core {
  /**
   * constructor --create a path_core... the constructor automatically searches the path_shell for from_node and to_node 
   * it looks for connection_points object in both nodes and selects a point from each collection as the terminal points the path will be connecting
   * the constructo automatically draw the path in the dom
   * @param {path_shell} path_shell - a reference to the containing path_shell
   * @param {object} base_svg - a reference to the global svg 
   */
  constructor(path_shell, base_svg) {
    /** @member {path_shell}  */
    this.path_shell = path_shell;
    /** @member {sting}  */
    this.path_id = path_shell.path_id;

    //find the the connection points from the two nodes (from_node to_node) and choose a point from each node 
    let path_end_points = this.find_connection_points_pair(
      path_shell.from_node_shell.connection_points,
      path_shell.to_node_shell.connection_points
    );

    //create html objec of a path connecting both the terminal points
    /** @member {object}  */
    this.html_path = this.create_path(
      this.path_id,
      path_end_points.from_point,
      path_end_points.to_point,
      base_svg
    );
  }
  /**
   * find the the connection points from the two nodes (from_node to_node) and choose a point from each node 
   * @param {object[]} from_connection_points - object containig points object
   * point object contains--> {x: y: }
   * @return {object}.
   */
  find_connection_points_pair = function (
    from_connection_points,
    to_connection_points
  ) {
    let end_points = {
      from_point: {},
      to_point: {},
    };

    if (from_connection_points.right.x <= to_connection_points.left.x) {
      //to is on the right condition
      end_points.from_point = from_connection_points.right;
      end_points.to_point = to_connection_points.left;
    } else if (from_connection_points.left.x >= to_connection_points.right.x) {
      //to is on the left condition
      end_points.from_point = from_connection_points.left;
      end_points.to_point = to_connection_points.right;
    } else {
      if (from_connection_points.top.y >= to_connection_points.top.y) {
        end_points.from_point = from_connection_points.top;
        end_points.to_point = to_connection_points.bottom;
      }
      if (from_connection_points.bottom.y <= to_connection_points.bottom.y) {
        end_points.from_point = from_connection_points.bottom;
        end_points.to_point = to_connection_points.top;
      }
    }
    return end_points;
  };

  /**
   * create svg path object and drawn it in the base svg box in the dom ... here the path is right angle in the middle between the 
   * two nodes ... the path start horizontally till half way to the other connection point then travles vertically and connects horizontallly again
   * @param {string} id - the id 
   * @param {object} start_point - one of the points defined in {@link default_node_core#connection_points}
   * @param {object} end_point   - one of the points defined in {@link default_node_core#connection_points}
   * @param {object} base_svg    - the global base svg box object from the dom .. all the paths are drawn in this box
   * @return {object}.
   */
  create_path(id, start_point, end_point, base_svg) {
    let middle_x =
      Math.min(start_point.x, end_point.x) +
      Math.abs(start_point.x - end_point.x) / 2;

    this.middle_start_point = {
      x: "0",
      y: "0"
    };
    this.middle_end_point = {
      x: "0",
      y: "0"
    };

    this.end_point = end_point;
    this.start_point = start_point;

    this.middle_start_point.y = this.start_point.y;
    this.middle_start_point.x = middle_x;

    this.middle_end_point.y = this.end_point.y;
    this.middle_end_point.x = middle_x;

    this.points_array = [
      this.start_point,
      this.middle_start_point,
      this.middle_end_point,
      this.end_point,
    ];
    //create svg for the path
    this.content_box_svg = base_svg;
    //add the svg box to the dom
    // document.body.appendChild(this.content_box_svg);
    //create path
    // 1-create emptey path object
    var NS = "http://www.w3.org/2000/svg";
    var SVGObj = document.createElementNS("http://www.w3.org/2000/svg", "path");
    // SVGObj.setAttributeNS(null, "d", d_string);
    // SVGObj.setAttributeNS(null, "d", "M 100,300 C 175,300 250,300 250,200 S 325,100 400,100");
    SVGObj.setAttribute("stroke", "green");
    SVGObj.setAttribute("stroke-width", 3);
    SVGObj.setAttribute("fill", "none");
    // 2- get the d-string from d-strging creator class and attach it to the path
    let d_string = global_d_string_creator.shrp_connect_d_string_creator(
      this.points_array
    );
    SVGObj.setAttributeNS(null, "d", d_string);

    this.p = SVGObj;
    //add id to the path
    let node_id = id;
    this.p.setAttribute("id", "path_" + node_id);
    this.p.setAttribute("data-from", this.path_shell.from_node_shell.node_id);
    this.p.setAttribute("data-to", this.path_shell.to_node_shell.node_id);

    //add the path to the dom
    this.content_box_svg.appendChild(this.p);
    $("#path_" + node_id).click(() => {
      alert("clicked");
    });

    return this.p;
  };

  /**
   * change the d_string attribute of the path object in the dom when the path endopints change position - without deleting the path and creating new one - so other objects containing a reference to the path arent broken
   *`this function is called by event handlers that handles the change position of nodes to make sure the path follows the nodes
   * @param {object} start_point - one of the points defined in {@link default_node_core#connection_points}
   * @param {object} end_point   - one of the points defined in {@link default_node_core#connection_points}
   * @param {object} base_svg    - the global base svg box object from the dom .. all the paths are drawn in this box
   * @return {void}.
   */
  update_path(start_point, end_point, base_svg) {
    let from_id = this.path_shell.from_node_shell.node_id;
    let to_id = this.path_shell.to_node_shell.node_id;
    let path_end_points = this.find_connection_points_pair(
      this.path_shell.from_node_shell.connection_points,
      this.path_shell.to_node_shell.connection_points
    );

    start_point = path_end_points.from_point;
    end_point = path_end_points.to_point;

    this.middle_start_point = {
      x: "0",
      y: "0"
    };
    this.middle_end_point = {
      x: "0",
      y: "0"
    };
    let middle_x =
      Math.min(start_point.x, end_point.x) +
      Math.abs(start_point.x - end_point.x) / 2;

    this.end_point = end_point;
    this.start_point = start_point;

    this.middle_start_point.y = this.start_point.y;
    this.middle_start_point.x = middle_x;

    this.middle_end_point.y = this.end_point.y;
    this.middle_end_point.x = middle_x;
    this.points_array = [
      this.start_point,
      this.middle_start_point,
      this.middle_end_point,
      this.end_point,
    ];

    let new_d_string = global_d_string_creator.shrp_connect_d_string_creator(
      this.points_array
    );
    this.html_path.setAttributeNS(null, "d", new_d_string);
  };
}