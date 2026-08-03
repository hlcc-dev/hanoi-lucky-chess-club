import { toast } from "react-toastify"
import ToastContent from "../components/Toast/ToastContent"
import i18n from "../i18n/config"

export function toastSuccess(message: string) {
  toast(
    <ToastContent
      type="success"
      title={i18n.t("toast.success")}
      message={message}
    />
  )
}

export function toastError(message: string) {
  toast(
    <ToastContent
      type="error"
      title={i18n.t("toast.error")}
      message={message}
    />
  )
}

export function toastInfo(message: string) {
  toast(
    <ToastContent
      type="info"
      title={i18n.t("toast.info")}
      message={message}
    />
  )
}

export function toastWarning(message: string) {
  toast(
    <ToastContent
      type="warning"
      title={i18n.t("toast.warning")}
      message={message}
    />
  )
}