import tunnelsHosts from "./tunnel-hosts.json";

const fetchHost = async () => {
  const res = await fetch(tunnelsHosts.tunnels[tunnelsHosts.clientHost], {
    method: "GET",
    headers: {
      "ngrok-skip-browser-warning": true,
    },
  });
  const blob = await res.blob();
  const urlObject = URL.createObjectURL(blob);

  const frame = document.querySelector("iframe");

  frame.setAttribute("src", urlObject);

  frame.onload = () => {
    frame?.contentWindow.postMessage(
      { type: "setup-tunnels", tunnels: tunnelsHosts.tunnels },
      "*"
    );
  };
};

fetchHost();
