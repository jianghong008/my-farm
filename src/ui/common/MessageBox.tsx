
interface Props {
    msg: string
    type: MessageBoxType
}

type MessageBoxType = 'error' | 'success' | 'warning' | 'info'
export class MessageBox {
    static box:HTMLDivElement
    static msg:HTMLSpanElement
    static _timer: any
    static alert(msg: string, t: MessageBoxType) {
        if(!MessageBox.box){
            MessageBox.box = document.createElement('div')
            MessageBox.box.className = 'msg-box'
            document.body.appendChild(MessageBox.box)
            MessageBox.msg = document.createElement('span')
            MessageBox.box.appendChild(MessageBox.msg)
        }
        MessageBox.msg.innerText = msg
        MessageBox.box.className = 'msg-box ' + t

        clearTimeout(MessageBox._timer)
        MessageBox._timer = setTimeout(() => {
            MessageBox.box.className = 'msg-box'
        },2500)
    }

    static error(msg: string) {
        MessageBox.alert(msg, 'error')
    }

    static success(msg: string) {
        MessageBox.alert(msg, 'success')
    }

    static warning(msg: string) {
        MessageBox.alert(msg, 'warning')
    }

    static info(msg: string) {
        MessageBox.alert(msg, 'info')
    }
}