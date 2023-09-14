import { CircularProgress } from "@mui/material";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
      <CircularProgress />
    </div>
  );
}
