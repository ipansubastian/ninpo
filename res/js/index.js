// import Canvas from './Canvas.js';
class App {
    constructor()
    {
        this.canvas = new Canvas;
        this.brush = new Brush(this.canvas);

        let isDrawing = false,
            canvasEl = this.canvas.canvas;
        
        this.canvas.setCanvasSize();

        window.addEventListener('resize', (e) => {
            e.preventDefault()
            this.canvas.setCanvasSize()
        })

        canvasEl.addEventListener('mousedown', startDraw);
        canvasEl.addEventListener('mousemove', draw);
        canvasEl.addEventListener('mouseup', stopDraw);

        function startDraw(e)
        {
            isDrawing = true;
            app.brush.ctx.beginPath()
            draw(e);
        }

        function draw({layerX: x, layerY: y })
        {
            if (!isDrawing) return;
            // console.log(x,y)
            // return
            app.brush.ctx.strokeWidth = 200
            app.brush.ctx.lineCap = 'round'
            app.brush.ctx.lineJoin = 'round'
            
            // console.log(app.brush.ctx.strokeWidth == 200)
            app.brush.ctx.lineTo(x, y)
            app.brush.ctx.stroke()
            app.brush.ctx.beginPath()
            app.brush.ctx.moveTo(x, y)
        }

        function stopDraw({layerX:x, layerY:y})
        {
            isDrawing = false;
            // app.brush.ctx.beginPath();
            app.brush.ctx.moveTo(x, y)
        }

    }
}

let app = new App();