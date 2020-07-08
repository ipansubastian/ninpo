function Ninpo(canvasEl) {

     const  canvas        = document.querySelector(canvasEl),
            ctx           = canvas.getContext('2d'),
            colors        = document.querySelectorAll('.palletes'),
            lineSize      = document.querySelector('#line-size'),
            colorPicker   = document.querySelector('#color-picker'),
            pickedColor   = document.querySelector('.color-picker-box .palletes'),
            cleanerButton = document.querySelector('.gomibako'),
            saverButton   = document.querySelector('.save'),
            ctxProp       = {
                                selectedColor: colors[0],
                                strokeStyle: '#000',
                                lineSize: 2,
                                lineCap: 'round',
                                // lineJoin: 'round'
                            }

    let isDrawing = false

    function setCanvasSize() {
        canvas.width  = window.innerWidth  - window.innerWidth  / 100 * 10
        canvas.height = window.innerHeight - window.innerHeight / 100 * 15
    }

    function startDraw(e) {
        // console.log('e.buttons:'+e.buttons, 'e.button:'+e.button)
        isDrawing = true
        draw(e)
    }

    function draw(e
    //     {
    //     clientX: x,
    //     clientY: y,
    //     buttons
    // }
    ) {
        console.log(e.type)
        if (e.button !== 0 && e.type === 'mousemove') return
        // alert(buttons)
        if (isDrawing) {
            ctx.lineCap     = ctxProp.lineCap
            ctx.lineJoin    = ctxProp.lineJoin
            ctx.lineWidth   = ctxProp.lineSize
            ctx.strokeStyle = ctxProp.strokeStyle

            let {x: mX, y: mY} = canvas.getBoundingClientRect()
            if (!e.touches){
                x=e.clientX - mX
                y=e.clientY - mY
            } else {
                x = e.touches[0].clientX - mX
                y = e.touches[0].clientY - mY
            }
            console.log(e.touches)
            ctx.lineTo(x, y)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(x, y)

        }
    }

    function stopDraw({
        layerX: x,
        layerY: y
    }) {
        isDrawing = false
        ctx.beginPath()
    }

    function __init()
    {
        if (localStorage.getItem('line-size')){
            let newLineSize                           = localStorage.getItem('line-size');
                lineSize.value                        = newLineSize
                lineSize.nextElementSibling.innerHTML = newLineSize
                ctxProp.lineSize                      = newLineSize
        }

        ctxProp.selectedColor.innerHTML  += '<div class="selected">✔</div>'
        pickedColor.style.backgroundColor = colorPicker.value
    }

    function __run() {
        setCanvasSize();

        canvas.addEventListener('mousedown', startDraw)
        canvas.addEventListener('touchstart', startDraw)

        canvas.addEventListener('mousemove', draw)
        canvas.addEventListener('touchmove', draw)

        canvas.addEventListener('mouseup', stopDraw)
        canvas.addEventListener('mouseout', stopDraw)
        canvas.addEventListener('mouseover', (e) => {
            // console.log(e)
            if (e.buttons === 1){
                startDraw(e)
            }
        })
        canvas.addEventListener('touchcancel', stopDraw)

        colorPicker.addEventListener('change', function() {
            if (ctxProp.selectedColor) {
                ctxProp.selectedColor.innerHTML = '';
            }
            let innerHTML                           = pickedColor.innerHTML;
                pickedColor.innerHTML               = innerHTML + '<div class="selected">✔</div>'
                pickedColor.style.backgroundColor   = this.value;
                ctxProp.selectedColor               = pickedColor
                ctxProp.strokeStyle                 = this.value
        })

        colors.forEach(el => {
            el.addEventListener('click', function (e) {
                if (ctxProp.selectedColor){
                    ctxProp.selectedColor.innerHTML = '';
                }

                let innerHTML               = this.innerHTML;
                    this.innerHTML          = innerHTML + '<div class="selected">✔</div>'
                    ctxProp.selectedColor   = this
                    ctxProp.strokeStyle     = window.getComputedStyle(this).backgroundColor
            })
        })

        lineSize.addEventListener('mousemove', function(){
            this.nextElementSibling.innerHTML = this.value
            // if (buttons === 0) {
            // }
            // console.log(buttons)
        })

        lineSize.addEventListener('change', function() {
                ctxProp.lineSize = this.value
                localStorage.setItem('line-size', this.value)
        })

        cleanerButton.addEventListener('click', () => {
            if (confirm('Clear All?')) {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
            }
        })

        saverButton.addEventListener('click', () => {
            document.write(
                `<button onclick="location.href='./'">Back</button>
                <div>
                    <img src="${canvas.toDataURL('base64')}">
                </div>`
            );
        })
    }

    __init()
    __run()
    return [canvas, ctx]
}