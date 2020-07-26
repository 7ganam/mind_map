class global_path_creator
{
    static create_html_path =function(points_array)
    {
            //create path string
            var d_string ="";
            d_string = "M " + points_array[0].x+"," + points_array[0].y + " ";
            for(let i = 1;    i < (points_array.length-1)   ; i++)
            { 
                // console.log(points_array[i]);
                d_string =d_string+ "L " + points_array[i].x+"," + points_array[i].y + " ";
            }
            d_string =d_string+ "L " + points_array[points_array.length-1].x+"," + points_array[points_array.length-1].y + " ";

            var NS="http://www.w3.org/2000/svg";
            var SVGObj= document.createElementNS('http://www.w3.org/2000/svg',"path");  
            SVGObj.setAttributeNS(null, "d", d_string);
       // SVGObj.setAttributeNS(null, "d", "M 100,300 C 175,300 250,300 250,200 S 325,100 400,100");
            SVGObj.setAttribute("stroke", "green");
            SVGObj.setAttribute("stroke-width", 3);
            SVGObj.setAttribute("fill", "none");
        return SVGObj;

    }
    
}