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
        /** @member {string}  */
        this.id = id;
        /** @member {string}  */
        this.passed_class = passed_class;
        /** @member {G_SVG}  */
        this.G_SVG = new G_SVG(id, this.passed_class + " " + id, x, y, w, h); //create svg object
        /** @member {shape}  */
        this.shape = new shape(id, this.passed_class + " " + id) //create empty shape object
        this.shape.set_html_shape(html_shape); // fill the shape object
    }
    /**
     * add the svg box to dom as a child of document.body .. then add the shape as a child of it
     * it depends that both {@link element#G_SVG} and {@link element#shape} object have a draw() metho of their own and just exploits them.
     * @return {void}.
     */
    draw() {
        this.G_SVG.draw(document.body);
        this.shape.draw(this.G_SVG.svg_html_object);
    }
}