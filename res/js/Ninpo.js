class Ninpo {
    constructor(init = {})
    {
        init.tools = init.tools || {}

        try {
            this.canvas = init.el?
                            document.querySelector(init.el):
                            null

            if (!this.canvas) {
                throw new Error('Gagal menginisialisasi elemen canvas!, Ninpo mengharapkan sebuah elemen canvas!')
            }
        } catch(e) {
            console.error(e)
            // alert('Terjadi kesalahan!')
            
        }

        this.ctx = this.canvas.getContext('2d')
        this.tools = {
            colors: init.tools.colors?
                    document.querySelectorAll(init.tools.colors):
                    null,

            // lineSizeChanger: init.tools.lineSizeChanger?
            //                 document.querySelector(init.tools.lineSizeChanger):
            //                 null,
            cleaner: init.tools.cleaner?
                    document.querySelector(init.tools.cleaner):
                    null,
            saver: init.tools.saver?
                    document.querySelector(init.tools.saver):
                    null
        }
        
        if (init.tools.lineSizeChanger){
            let lineSizeChangerC = {}
            let lineSizeChanger = init.tools.lineSizeChanger
            
            if (lineSizeChanger.input){
                lineSizeChangerC.input = document.querySelector(lineSizeChanger.input)
            }

            if (lineSizeChanger.valueBox){
                lineSizeChangerC.valueBox = document.querySelector(lineSizeChanger.valueBox)
            }
            this.tools.lineSizeChanger = lineSizeChangerC
        }


        if (init.tools.colorPicker){
            if (!init.tools.colorPicker.picker || !init.tools.colorPicker.picked) {
                new Error('Color picker harus diinisialisasi berpasangan dengan box penampung value dari color picker. Info lebih lanjut lihat dokumentasi!')
            }

            let colorPickerC = {}
            let colorPicker = init.tools.colorPicker
            
            if (colorPicker.picker){
                colorPickerC.picker = document.querySelector(colorPicker.picker)
            }

            if (colorPicker.picked){
                colorPickerC.picked = document.querySelector(colorPicker.picked)
            }

            this.tools.colorPicker = colorPickerC 
        }


        this.config = {
            selectedColor: this.tools.colors?
                            this.tools.colors[0]:
                            null,

            strokeColor: this.selectedColor?
                            window.getComputedStyle(this.selectedColor).backgroundColor:
                            '#000',

            lineSize: localStorage.getItem('line_size') ||
                        this.tools.lineSizeChanger.input.value ||
                        2,

            lineCap: 'round',
            lineJoin: 'round',
            canvasSize: {
                width: window.innerWidth / 100 * (init.canvasSize? init.canvasSize[0]: 75),
                height: window.innerHeight / 100 * (init.canvasSize? init.canvasSize[1]: 80)
            }

        }

        this.isDrawing = false
        this.freshPoint = //[
            {x: null, y: null}
        //]

        if (init.size === 'auto') this.setCanvasSize()
        this.handleEvent()
        this.init()

    }

    setCanvasSize()
    {
        this.canvas.width = this.config.canvasSize.width
        this.canvas.height = this.config.canvasSize.height
        console.log(this.config)
    }

    startDraw(e)
    {
        this.isDrawing = true
        this.draw(e)
    }

    draw(e)
    {
        if (!this.isDrawing) return
        this.ctx.lineCap = this.config.lineCap
        this.ctx.lineJoin = this.config.lineJoin
        this.ctx.lineWidth = this.config.lineSize
        this.ctx.strokeStyle = this.config.strokeColor

        this.freshPoint = this.getPoint(e)
        let {x, y} = this.freshPoint

        this.ctx.lineTo(x, y)
        this.ctx.stroke()
        this.ctx.beginPath()
        this.ctx.moveTo(x, y)
    }

    stopDraw()
    {
        this.isDrawing = false
        this.ctx.beginPath()
    }

    getPoint(event)
    {
        if (!event) return
        let point;
  
        switch (event.type) {
            case 'touchmove':
            case 'touchstart':
                point = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY
                }
                break;
            default:
                point = {
                    x: event.clientX,
                    y: event.clientY
                }
                break;
        }
        
        point.x -= this.canvas.getBoundingClientRect().x
        point.y -= this.canvas.getBoundingClientRect().y

        return point//[
        //]
    }

    eventBind(events, callback)
    {
        let ret = []
        events = events.split(' ')
        events.forEach(event => {
            this.canvas.addEventListener(event, e => {
                ret.push(callback(e))
            })
        })
    
        return ret;
    }

    handleEvent()
    {
        void this.eventBind('mousedown touchstart mouseover mousemove touchmove mouseup mouseout touchend contextmenu', (e) => {
            switch (e.type){
                case 'mousedown':
                case 'touchstart':
                    e.preventDefault()
                    ninpo.startDraw(e)
                    break;
                case 'mousemove':
                case 'touchmove':
                    ninpo.draw(e)
                    break;
                case 'mouseover':
                    ((e) => {
                        if (e.buttons === 1){
                            this.startDraw(e)
                        }
                    })(e)
                    break;
                case 'mouseup':
                case 'mouseleave':
                case 'mouseout':
                case 'touchend':
                case 'touchcancel':
                    // console.log('ya')
                    ninpo.stopDraw()
                    break;
                case 'contextmenu':
                    e.preventDefault()
            }
        })

        this.tools.colors.forEach(color => {
            color.addEventListener('click', ({target}) => {
                if (this.config.selectedColor) {
                    this.config.selectedColor.classList.remove('ninpo-sltd-col')
                }
                
                target.classList.add('ninpo-sltd-col')

                this.config.selectedColor = target
                this.config.strokeColor = window.getComputedStyle(target).backgroundColor
            })
        })

        if (this.tools.colorPicker){
            this.tools.colorPicker.picker.addEventListener('change', ({target}) => {
                if (this.config.selectedColor) {
                    this.config.selectedColor.classList.remove('ninpo-sltd-col')
                }

            this.tools.colorPicker.picked.classList.add('ninpo-sltd-col')

            this.tools.colorPicker.picked.style.backgroundColor = target.value

            this.config.strokeColor = target.value

            this.config.selectedColor = this.tools.colorPicker.picked
            
            })
        }

        if (this.tools.lineSizeChanger){
            this.tools.lineSizeChanger.input.addEventListener('change', ({target}) => {
                localStorage.setItem('line_size', target.value)
                this.config.lineSize = target.value
                if (this.tools.lineSizeChanger.valueBox){
                    this.tools.lineSizeChanger.valueBox.innerHTML = target.value
                }
            })
                
            this.tools.lineSizeChanger.input.addEventListener('mousewheel', (e) => {
                e.preventDefault()
                // console.log(shiftKey)
                if (e.shiftKey){
                    if (e.deltaY === -53){
                        e.target.value+=2
                    } else if (e.deltaY === 53) {
                        e.target.value-=2
                    }
                } else {
                    if (e.deltaY === -53){
                        e.target.value++
                    } else if (e.deltaY === 53) {
                        e.target.value--
                    }
                }
                console.log(e.target.value)
                this.config.lineSize = e.target.value
                if (this.tools.lineSizeChanger.valueBox){
                    this.tools.lineSizeChanger.valueBox.innerHTML = e.target.value
                }
            })

            if (this.tools.lineSizeChanger.valueBox) {
                this.tools.lineSizeChanger.input.addEventListener('mousemove', ({target, buttons}) => {
                    if (buttons){
                        this.tools.lineSizeChanger.valueBox.innerHTML = target.value
                    }
                })
            }
        }

        if (this.tools.cleaner){
            this.tools.cleaner.addEventListener('click', e => {
                if (confirm('Bersihkan semua?')) {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                }
            })
        }

      if (this.tools.saver) {
        this.tools.saver.addEventListener('click', e => {
          const tmpAnchor = document.createElement('a')
          const fileName = `Ninpo_${(new Date).valueOf()}.png`;
          tmpAnchor.download = fileName;
          try {
            tmpAnchor.href = this.canvas.toDataURL();
          } catch (e) {
            console.error('Elemen vanvas belum diatur!')
          }
          tmpAnchor.click();
        })
      }

    }

    init()
    {
        const ilineSizeChanger = () => {
            // console.log(this)
            if (this.tools.lineSizeChanger){
                console.log(this.tools.lineSize)
                this.tools.lineSizeChanger.input.value = this.config.lineSize
                if (this.tools.lineSizeChanger.valueBox){
                    this.tools.lineSizeChanger.valueBox.innerHTML = this.config.lineSize
                }
            }
        }

        const iColorPicker = () => {
            if (this.tools.colorPicker) {
                this.tools.colorPicker.picker.value = '#4682b4'
                this.tools.colorPicker.picked.style.backgroundColor = this.tools.colorPicker.picker.value
            }
        }

        ilineSizeChanger()
        iColorPicker()
    }
}
