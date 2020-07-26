class element
{
     constructor(id,passed_class,html_shape,x,y,w,h)
     {
         this.id=id;
         this.passed_class = passed_class;
         this.G_SVG = new G_SVG(id,this.passed_class +" "+ id ,x,y,w,h);//create svg object

         this.shape = new shape(id,this.passed_class  +" "+ id)//create empty shape object
         this.shape.set_html_shape( html_shape );// fill the shape object
     }
     draw()
     {
         this.G_SVG.draw(document.body);
         this.shape.draw(this.G_SVG.svg_html_object);
     }
}