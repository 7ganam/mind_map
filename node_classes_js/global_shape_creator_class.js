class golpal_shape_creator
{
   static create_rectangle(x,y,w,h,fill)
    {
        var NS="http://www.w3.org/2000/svg";
        var shape_html_object= document.createElementNS(NS,"rect");
        //set attributes
        shape_html_object.setAttribute("width",w);
        shape_html_object.setAttribute("height",h);
        shape_html_object.setAttribute("x", x);
        shape_html_object.setAttribute("y", y);
        shape_html_object.setAttribute("rx", 20);
        shape_html_object.setAttribute("ry", 20);
        shape_html_object.style="fill:red;stroke:black;stroke-width:3;opacity:0.5"
        return shape_html_object;
    }
    
}