class shape 
{
    constructor(id,shape_class)
    {
        this.id=id;
        this.shape_class=shape_class;
        var NS="http://www.w3.org/2000/svg";
        this.shape_html_object= document.createElementNS(NS,"div"); //dummy initialization // you should use any method to creat shape when you instantiate object of this class
         //do not change shape_html_object directly it will clear class and id attrbs defined below use the setter ... i would use private if java script had it.
        this.shape_html_object.setAttribute("class", shape_class);
        this.shape_html_object.setAttribute("id", "shape"+this.id);

    }
    set_html_shape(html_shape)
    {
        this.shape_html_object = html_shape;
        this.shape_html_object.setAttribute("class", this.shape_class);
        this.shape_html_object.setAttribute("id", "shape_"+this.id);
    }
    draw(svg_html_object)
    {
        svg_html_object.appendChild(this.shape_html_object);

    }

}