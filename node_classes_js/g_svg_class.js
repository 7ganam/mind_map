/** Class defining svg element with some meta data around it.
 * @category node classes
 */
class G_SVG {
    /**
     * constructor .. passed the class name it creates an svg object using js native code and sets the class attributes to the input class name as well as other attributes like position and size
     * @param {string} id 
     * @param {string} svg_class  - the class that will be added to the element object of the dom
     * @param {number} x - The x position of the top left corenr of the node relative to the window.
     * @param {number} y - The y position of the top left corenr of the node relative to the window.
     * @param {number} w - The width in pixles
     * @param {number} h - The height in pixles
     */
    constructor(id, svg_class, x, y, w, h) {
        /** @member {string}  */
        this.id = id;
        var NS = "http://www.w3.org/2000/svg";
        /** @member {object}  */
        this.svg_html_object = document.createElementNS(NS, "svg");
        //set svg style
        this.svg_html_object.style.border = "1px solid black";
        this.svg_html_object.style.position = "fixed";
        // this.svg_html_object.style.top = y + "px"; //position relative to the window
        // this.svg_html_object.style.left = x + "px";

        //set svg attributes
        this.svg_html_object.setAttribute("height", h);
        this.svg_html_object.setAttribute("width", w);
        this.svg_html_object.setAttribute("x", x);
        this.svg_html_object.setAttribute("y", y);
        this.svg_html_object.setAttribute("class", svg_class);

        //set id
        this.svg_html_object.setAttribute("id", "svg_" + id);

    }
    /**
     * 
     * draw the svg to the passed dom element 
     * @param {object} parent_html_element - reference to the parent dom object (maybe retrieved by jquery for example)
     * @return {void}.
     */
    draw(parent_html_element) {
        parent_html_element.appendChild(this.svg_html_object);
    }

}