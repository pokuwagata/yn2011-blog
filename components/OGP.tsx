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
          padding: "2.5rem",
          backgroundColor: "#fff",
          borderRadius: "1rem",
          fontFamily: "Roboto",
        }}
      >
        <h1
          style={{
            fontWeight: 600,
            fontSize: "60px",
            lineHeight: "120%",
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: "30px", marginLeft: "auto" }}>{siteName}</p>
      </div>
    </div>
  );
}
