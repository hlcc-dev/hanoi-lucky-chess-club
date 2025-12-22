import { toast } from "react-toastify"
import ToastContent from "../components/Toast/ToastContent"

export function toastSuccess(message: string) {
  toast(
    <ToastContent
      type="success"
      title="Success"
      message={message}
    />
  )
}

export function toastError(message: string) {
  toast(
    <ToastContent
      type="error"
      title="Error"
      message={message}
    />
  )
}

export function toastInfo(message: string) {
  toast(
    <ToastContent
      type="info"
      title="Info"
      message={message}
    />
  )
}

export function toastWarning(message: string) {
  toast(
    <ToastContent
      type="warning"
      title="Warning"
      message={message}
    />
  )
}