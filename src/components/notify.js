const { toast } = require("react-toastify");

function notify(text, type) {
  toast.success(text, { position: toast.POSITION.BOTTOM_RIGHT });
  console.log("--text", text);
  console.log("--type", type);
  if (type === "success") {
    toast.success(text, { position: toast.POSITION.BOTTOM_RIGHT });
  }
  if (type === "error") {
    toast.error(text, { position: toast.POSITION.BOTTOM_RIGHT });
  }
  if (type === "warning") {
    toast.warning(text, { position: toast.POSITION.BOTTOM_RIGHT });
  }
}

export default notify;
