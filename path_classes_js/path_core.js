class default_path_core {
  constructor(path_shell, base_svg) {
    this.path_shell = path_shell;
    this.path_id = path_shell.path_id;

    let path_end_points = this.find_connection_points_pair(
      path_shell.from_node_shell.node_core.connection_points,
      path_shell.to_node_shell.node_core.connection_points
    );
    this.html_path = this.create_path(
      this.path_id,
      path_end_points.from_point,
      path_end_points.to_point,
      base_svg
    );
  }

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

  create_path = function (id, start_point, end_point, base_svg) {
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

  update_path = function (start_point, end_point, base_svg) {
    let from_id = this.path_shell.from_node_shell.node_id;
    let to_id = this.path_shell.to_node_shell.node_id;
    let path_end_points = this.find_connection_points_pair(
      this.path_shell.from_node_shell.node_core.connection_points,
      this.path_shell.to_node_shell.node_core.connection_points
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