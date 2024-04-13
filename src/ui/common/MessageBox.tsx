
type MessageBoxType = 'error' | 'success' | 'warning' | 'info'
export class MessageBox {
    static box: HTMLDivElement
    static msg: HTMLSpanElement
    static _timer: any
    static alert(msg: any, t: MessageBoxType) {
        if (!MessageBox.box) {
            MessageBox.box = document.createElement('div')
            MessageBox.box.className = 'msg-box'
            document.body.appendChild(MessageBox.box)
            MessageBox.msg = document.createElement('span')
            MessageBox.box.appendChild(MessageBox.msg)
        }
        MessageBox.msg.innerText = MessageBox.parseError(msg)
        MessageBox.box.className = 'msg-box ' + t

        clearTimeout(MessageBox._timer)
        MessageBox._timer = setTimeout(() => {
            MessageBox.box.className = 'msg-box'
        }, 2500)
    }

    static parseError(error: any) {
        if (typeof error === 'string') {
            return error
        }
        let msg = ''
        if (error.message) {
            msg = error.message
        } else if (error.data && error.data.message) {
            msg = error.data.message
        } else {
            msg = 'unknown error'
        }

        msg = msg.replace(/\(.*\)/, '').trim()
        const temp = msg.split(':')
        return (temp.length > 1 ? temp[1] : temp[0]).replace(/["']/g,'')
    }

    static error(msg: any) {
        MessageBox.alert(msg, 'error')
    }

    static success(msg: any) {
        MessageBox.alert(msg, 'success')
    }

    static warning(msg: any) {
        MessageBox.alert(msg, 'warning')
    }

    static info(msg: string) {
        MessageBox.alert(msg, 'info')
    }
}