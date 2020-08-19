/** Class defining the element to be added to the dom and its meta data.
 * @category node classes
 */
class element {
    /**
     * constructor .. passed an html_shape the constructor creates an svg object and appends the shape in it .. it doesn't add them to the dom untill the draw() member function is called separately
     * @param {string} id 
     * @param {string} passed_class  - the class that will be added to the element object of the dom
     * @param {object} html_shape  - the html shape that will be drawn in an svg container representing the shape of the elment in the browser
     * @param {number} x - The x position of the top left corenr of the node relative to the window.
     * @param {number} y - The y position of the top left corenr of the node relative to the window.
     * @param {number} w - The width in pixles
     * @param {number} h - The height in pixles
     */
    constructor(id, passed_class, html_shape, x, y, w, h) {
        /** @member {string}  
         * @description astring that can be used by jquery of js to fetch the svg box from the dom
         */
        this.dom_svg_selector = "#svg_" + id + "." + passed_class
        /** @member {string}  
         * @description astring that can be used by jquery of js to fetch the shape from the dom
         */
        this.dom_shape_selector = "#shape_" + id + "." + passed_class

        /** @member {string}  */
        this.id = id;
        /** @member {string}  */
        this.passed_class = passed_class;
        /** @member {G_SVG}  */
        this.G_SVG = new G_SVG(id, this.passed_class + " " + id, x, y, w, h); //create svg object
        /** @member {shape}  */
        this.shape = new shape(id, this.passed_class + " " + id) //create empty shape object
        this.shape.set_html_shape(html_shape); // fill the shape object


        ///working area ... this should be separated in a separate class
        this.text_container = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
        this.text_container.setAttribute("height", "90%");
        this.text_container.setAttribute("width", "80%");
        this.text_container.setAttribute("x", "10%");
        this.text_container.setAttribute("y", "10%");
        this.text_container.setAttribute("class", "fo");

        this.newDiv = document.createElement("div");
        this.newDiv.setAttribute("class", "editable");
        this.text_container.appendChild(this.newDiv);

    }
    /**
     * add the svg box to dom as a child of document.body .. then add the shape as a child of it
     * it depends that both {@link element#G_SVG} and {@link element#shape} object have a draw() metho of their own and just exploits them.
     * @return {void}.
     */
    draw(parent_dom_element) {
        this.G_SVG.draw(parent_dom_element);


        this.shape.draw(this.G_SVG.svg_html_object);
        this.G_SVG.svg_html_object.appendChild(this.text_container);

        // working area
        var editor = new MediumEditor('.editable');


    }
    /**
     * get the x attribute from the dom  element 
     * @return {number}.
     */
    get_x() {
        var x = document
            .querySelectorAll(this.dom_svg_selector)[0]
            .getAttribute("x");
        x = Number(x);
        return x;
    }
    /**
     * get the y attribute from the dom  element 
     * @return {number}.
     */
    get_y() {
        var y = document
            .querySelectorAll(this.dom_svg_selector)[0]
            .getAttribute("y");
        y = Number(y);
        return y;
    };
    /**
     * get the width attribute from the dom element
     * @return {number}.
     */
    get_width() {
        var width = document
            .querySelectorAll(this.dom_svg_selector)[0]
            .getAttribute("width");
        width = Number(width);
        return width;
    };
    /**
     * get the height attribute from the dom  element
     * @return {number}.
     */
    get_height() {
        var height = document
            .querySelectorAll(this.dom_svg_selector)[0]
            .getAttribute("height");
        height = Number(height);
        return height;
    };

    /**
     * set the x and y attribute of the dom  element
     * @param {number} x - set the x position relative to the window 
     * @param {number} y - set the y position relative to the window 
     * @return {void}.
     */
    set_position(x, y) {
        $(this.dom_svg_selector).attr(
            "x",
            x
        );
        $(this.dom_svg_selector).attr(
            "y",
            y
        );
    }
    /**
     * set the height attribute of boath the SVG box and the shape in the dom 
     * @param {number} h - height
     * @param {number} w -width
     * @return {void}.
     */
    set_size(w, h) {
        //resize the svg

        this.G_SVG.svg_html_object.setAttribute("height", h);
        this.G_SVG.svg_html_object.setAttribute("width", w);


        //resize the svg content ... TODO: this might need to be taken out of the element class as differnt elements may need to resize differently
        this.shape.shape_html_object.setAttribute("height", h - 5);
        this.shape.shape_html_object.setAttribute("width", w - 5);





    }
}