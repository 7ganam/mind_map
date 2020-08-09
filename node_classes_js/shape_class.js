/** Class defining svg shape element with some meta data around it.
 * @category node classes
 */
class shape {
    /**
     * constructor .. passed the shape_class name it creates an svg shape object using js native code and sets the class attribute
     * @param {string} id 
     * @param {string} shape_class  - the class that will be added to the element object of the dom

     */
    constructor(id, shape_class) {
        /** @member {string}  */
        this.id = id;
        /** @member {string}  */
        this.shape_class = shape_class;
        var NS = "http://www.w3.org/2000/svg";
        /** @member {object}  */
        this.shape_html_object = document.createElementNS(NS, "div"); //dummy initialization // you should use any method to creat shape when you instantiate object of this class
        //do not change shape_html_object directly it will clear class and id attrbs defined below use the setter ... i would use private if java script had it.
        this.shape_html_object.setAttribute("class", shape_class);
        this.shape_html_object.setAttribute("id", "shape" + this.id);

    }
    /**
     * 
     * resets the shape to new shape .. the same object in the dom jsut changes the html to differnt shape
     * @param {object} html_shape - html svg shap object
     * @return {void}.
     */
    set_html_shape(html_shape) {
        this.shape_html_object = html_shape;
        this.shape_html_object.setAttribute("class", this.shape_class);
        this.shape_html_object.setAttribute("id", "shape_" + this.id);
    }
    /**
     * 
     * draw the svg shape to the passed svg dom element 
     * @param {object} svg_html_object - reference to the parent svg dom object (maybe retrieved by jquery for example)
     * @return {void}.
     */
    draw(svg_html_object) {
        svg_html_object.appendChild(this.shape_html_object);

    }

}