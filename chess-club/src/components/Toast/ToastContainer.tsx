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

            // --- layout fixes ---
            toastClassName={() =>
                "relative w-80 max-w-sm sm:w-80 rounded-lg overflow-visible shadow-md bg-white pr-10"
            }
        />
    )
}

export default ToastContainer