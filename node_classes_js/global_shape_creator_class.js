/** static global class containg methods to create differnet svg shapes 
 * @category node classes
 * @global
 */
class golpal_shape_creator {
    /**
     * 
     * draw the svg rectangle shape shape 
     * @param {object} svg_html_object - reference to the parent svg dom object (maybe retrieved by jquery for example)
     * @param {object} html_shape  - the html shape that will be drawn in an svg container representing the shape of the elment in the browser
     * @param {number} x - The x position of the top left corenr of the node relative to the containig svg box
     * @param {number} y - The y position of the top left corenr of the node relative to the containig svg box
     * @param {number} h - The height in pixles
     * @return {object}.
     */
    static create_rectangle(x, y, w, h, fill) {
        var NS = "http://www.w3.org/2000/svg";
        var shape_html_object = document.createElementNS(NS, "rect");
        //set attributes
        shape_html_object.setAttribute("width", w);
        shape_html_object.setAttribute("height", h);
        shape_html_object.setAttribute("x", x);
        shape_html_object.setAttribute("y", y);
        shape_html_object.setAttribute("rx", 20);
        shape_html_object.setAttribute("ry", 20);
        shape_html_object.style = "fill:red;stroke:black;stroke-width:3;opacity:0.5"
        return shape_html_object;
    }

}