type LoaderProps = {
  size?: number;
};

export default function Loader({ size = 60 }: LoaderProps) {
  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <img src={"loader.svg"} />
    </div>
  );
}
