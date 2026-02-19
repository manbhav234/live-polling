import { useSocketState } from "@/store/socketState";
import { useEffect } from "react";
export function useRouteSocket() {
  const connect = useSocketState.getState().connect;

  useEffect(() => {
    const connection = async () => {
        await connect();
    }
    connection();
  }, []);
}
