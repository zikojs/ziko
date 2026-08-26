import {UIElement} from "../../../constructors/UIElement.js";
import {Matrix} from "../../../../math/matrix/index.js"
class UICanvas extends UIElement{
    constructor(w,h){
        super("canvas","canvas");
        this.ctx = this.element?.getContext("2d");
        this.style({
            border:"1px red solid",
        })
        this.transformMatrix = new Matrix([
            [1,0,0],
            [0,1,0],
            [0,0,1]
        ])
        this.axisMatrix = new Matrix([
            [-10,-10],
            [10,10]
        ])
        // setTimeout(()=>this.resize(w,h),0);
        requestAnimationFrame(()=>this.resize(w,h),0);
        this.on("sizeupdated",()=>this.adjust())
    }
    get Xmin(){
        return this.axisMatrix[0][0];
    }
    get Ymin(){
        return this.axisMatrix[0][1];
    }
    get Xmax(){
        return this.axisMatrix[1][0];
    }
    get Ymax(){
        return this.axisMatrix[1][1];
    }
    get ImageData(){
        return this.ctx.getImageData(0,0,c.Width,c.Height);
    }
    draw(all=true){
        if(all){
            this.clear();  
            this.items.forEach(element => {
                element.parent=this;
                element.draw(this.ctx)
            });
        }
        else {
            this.items.at(-1).parent=this;
            this.items.at(-1).draw(this.ctx);
        }
        this.maintain();
        return this;
    }
    applyTransformMatrix(){
        this.ctx.setTransform(
            this.transformMatrix[0][0],
            this.transformMatrix[1][0],
            this.transformMatrix[0][1],
            this.transformMatrix[1][1],
            this.transformMatrix[0][2],
            this.transformMatrix[1][2],
        );
        return this;
    }
    resize(w,h){
        this.size(w,h)
        this.lineWidth();
        this.view(this.axisMatrix[0][0], this.axisMatrix[0][1], this.axisMatrix[1][0], this.axisMatrix[1][1]);
        this.emit("sizeupdated");
        return this;
    }
    adjust(){
        this.element.width =this.element?.getBoundingClientRect().width;
        this.element.height =this.element?.getBoundingClientRect().height;
        this.view(this.axisMatrix[0][0], this.axisMatrix[0][1], this.axisMatrix[1][0], this.axisMatrix[1][1]);
        return this;
    }
    view(xMin,yMin,xMax,yMax){
        this.transformMatrix[0][0]=this.width/(xMax-xMin); // scaleX
        this.transformMatrix[1][1]=-this.height/(yMax-yMin); // scaleY
        this.transformMatrix[0][2]=this.width/2;
        this.transformMatrix[1][2]=this.height/2;
        this.axisMatrix=new Matrix([
            [xMin,yMin],
            [xMax,yMax]
        ])
        
        this.applyTransformMatrix(); 
        this.clear();
        this.lineWidth(1);
        this.draw();
        return this;
    }
    reset(){
        this.ctx.setTransform(1,0,0,0,0,0);
        return this;
    }
    append(element){
        this.items.push(element);
        this.draw(false);
        return this;
    }
    background(color){
        this.ctx.fillStyle = color;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.applyTransformMatrix();
        this.draw();
    }
    lineWidth(w){
        this.ctx.lineWidth=w/this.transformMatrix[0][0];
        return this
    }
    getImageData(x=0,y=0,w=this.width,h=this.height){
        return this.ctx.getImageData(x,y,w,h);
    }
    clear(){
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.applyTransformMatrix(); 
        return this;
    }
    clone(){
        console.log(this.width)
        const canvas=new UICanvas();
        canvas.items=this.items;
        canvas.transformMatrix=this.transformMatrix;
        canvas.axisMatrix=this.axisMatrix;
        Object.assign(canvas.cache,{...this.cache});
        //waitForUIElm(this)
        //console.log(element)
        this.size(this.element.style.width,this.element.style.width);
        this.applyTransformMatrix();
        this.draw();
        this.adjust();
        return canvas;
    }
    toImage() {
        this.img = document?.createElement("img");
        this.img.src = this.element?.toDataURL("image/png");
        return this;
    }
    toBlob() {
        var canvas = this.element;
        canvas.toBlob(function (blob) {
            var newImg = document?.createElement("img"),
                url = URL.createObjectURL(blob);
            newImg.onload = function () {
                URL.revokeObjectURL(url);
            };
            newImg.src = url;
            console.log(newImg);
        });
    }
    zoomIn(){

    }
    zoomOut(){
        
    }
    undo(n){

    }
    redo(n){

    }
    stream(){

    }
}

const Canvas=(w,h)=>new UICanvas(w,h);
export{
    UICanvas,
    Canvas
}
