// A file named 'loading.tsx' will automatically be used when loading this 'admin' route. We just need to create the file and export a loading component.
import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return <div className="flex justify-center">
    <Loader2 className="size-24 animate-spin" />
  </div>
}