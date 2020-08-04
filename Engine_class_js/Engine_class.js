class Engine {
    constructor() {
        this.node_array = [];
        this.nodes_array = [];
        this.paths_array = [];
        this.base_svg = this.create_svg(0, 0, 1500, 1500);
        document.body.appendChild(this.base_svg);
    }
    create_node(x, y, w, h) {
        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        var uniqid = randLetter + Date.now();
        this.node_array.push(new node_shell(this, uniqid, x, y, w, h));
    }
    create_path(parent_node, son_node) {
        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        var uniqid = randLetter + Date.now();
        var my_path1 = new path_shell(uniqid, this.base_svg, parent_node, son_node);
        this.paths_array.push(my_path1);
    }
    draw_nodes() {
        this.node_array.forEach((node_shell) => {
            node_shell.node_core.draw();
        });
    }
    add_son(parent_node, son_node) {
        parent_node.set_node_son(son_node);
        this.create_path(parent_node, son_node)
    }
    create_paths = function () {
        this.node_array.forEach((node_shell) => {
            node_shell.sons.forEach((son_node_shell) => {
                var randLetter = String.fromCharCode(
                    65 + Math.floor(Math.random() * 26)
                );
                var uniqid = randLetter + Date.now();
                my_path1 = new path_shell(uniqid, this.base_svg, node_shell, son_node_shell);
                this.paths_array.push(my_path1);
            });
        });
    };
    update_paths = function (node) {
        let paths_to_be_ubdated = this.paths_array.filter(function (path_i) {
            return path_i.from_node_shell === node || path_i.to_node_shell === node;
        });
        paths_to_be_ubdated.forEach(myFunction);

        function myFunction(path_i, index) {
            path_i.path_core.update_path();
        }
    };
    create_svg = function (x, y, w, h) {
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