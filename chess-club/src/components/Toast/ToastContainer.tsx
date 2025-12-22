import { ToastContainer as ReactToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function ToastContainer() {
    return (
        <ReactToastContainer
            position="bottom-right"
            autoClose={4000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable

        />
    )
}

export default ToastContainer