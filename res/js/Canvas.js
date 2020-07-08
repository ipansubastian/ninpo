class Canvas {
    constructor()
    {
        this.canvas = document.querySelector('canvas');

    }

    setCanvasSize()
    {
        this.canvas.width = window.innerWidth - (window.innerWidth / 100 * 15)
        this.canvas.height = window.innerHeight - (window.innerHeight / 100 * 5 )
    }
}
// export default Canvas;