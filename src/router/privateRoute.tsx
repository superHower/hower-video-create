import { message } from "antd";
import { ReactElement, useEffect, useState } from "react";
import { getToken } from "../tools/auth";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactElement;
}

const PrivateRoute = ({ children }: Props) => {
  const navigator = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 对比时间戳是否超过48小时
  function isPast48Hours(timestamp: number): boolean {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timeDifference = currentTimestamp - timestamp;
    const hours48InSeconds = 48 * 60 * 60;
    return timeDifference > hours48InSeconds;
  }

  useEffect(() => {
    try {
      const token: any = getToken();
      const tokenObj = JSON.parse(token);
      if (tokenObj && !isPast48Hours(tokenObj.expired)) {
        setIsAuthenticated(true);
      } else {
        message.warning("token过期,请重新登录");
        navigator(`/login`);
      }
    } catch (error) {
      message.warning("token过期,请重新登录");
      navigator(`/login`);
    }
  }, []);

  return isAuthenticated ? children : null;
};

export default PrivateRoute;