class G_SVG 

{
    constructor(id, svg_class ,x,y,w,h)
    {
        this.id=id;
            var NS="http://www.w3.org/2000/svg";
            this.svg_html_object=document.createElementNS(NS,"svg");
        //set svg style
            this.svg_html_object.style.border= "1px solid black";
            this.svg_html_object.style.position= "fixed";
            this.svg_html_object.style.top= y + "px";  //position relative to the window
            this.svg_html_object.style.left= x + "px";

        //set svg attributes
            this.svg_html_object.setAttribute("height", h);
            this.svg_html_object.setAttribute("width", w);
            this.svg_html_object.setAttribute("class", svg_class);

        //set id
            this.svg_html_object.setAttribute("id", "svg_"+id);
        
    }
    
    draw(parent_html_element)
    {
        parent_html_element.appendChild(this.svg_html_object);
    }

}
