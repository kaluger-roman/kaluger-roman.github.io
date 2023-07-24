import { tunnelsHosts } from "./tunnel-hosts.js";

const fetchHost = async () => {
  const frame = document.querySelector("iframe");

  frame.setAttribute("src", tunnelsHosts.tunnels[tunnelsHosts.clientHost]);

  frame.onload = () => {
    frame?.contentWindow.postMessage(
      { type: "setup-tunnels", tunnels: tunnelsHosts.tunnels },
      "*"
    );
  };
};

fetchHost();
