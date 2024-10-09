import loadingImg from "../../assets/loading.svg";
export default function Loading() {
  return (
    <img
      className="loading-request-icon"
      style={{ filter: "brightness(100)" }}
      src={loadingImg}
    />
  );
}
