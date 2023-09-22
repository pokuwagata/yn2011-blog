type Props = {
  title: string;
  siteName: string;
};

export function OGP({ title, siteName }: Props) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        padding: "2rem",
        backgroundColor: "#374151",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          padding: "1.5rem",
          backgroundColor: "#fff",
          borderRadius: "1rem",
        }}
      >
        <h1 style={{ fontSize: "60px", fontWeight: "600", lineHeight: "120%" }}>
          {title}
        </h1>
        <p style={{ fontSize: "30px", marginLeft: "auto" }}>{siteName}</p>
      </div>
    </div>
  );
}
