import Image from "next/image";

export default function Logo({
  width = 34,
  height = 34,
  className = "",
  priority = false,
}) {
  return (
    <Image
      src="/images/logo.jpg"
      alt="ART HOUSE 94"
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );
}
