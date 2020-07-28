class global_d_string_creator
{

    static shrp_connect_d_string_creator=function(points_array)
    { //takes array of points RETURNS: a d string for a path connecting the points with no curves
     //set this string to the d attribute of any path to see the results
            //create path string
            var d_string ="";
            d_string = "M " + points_array[0].x+"," + points_array[0].y + " ";
            for(let i = 1;    i < (points_array.length-1)   ; i++)
            { 
                // console.log(points_array[i]);
                d_string =d_string+ "L " + points_array[i].x+"," + points_array[i].y + " ";
            }
            d_string =d_string+ "L " + points_array[points_array.length-1].x+"," + points_array[points_array.length-1].y + " ";
            return d_string;
    }
}