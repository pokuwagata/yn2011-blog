type Props = {
  title: string;
  siteName: string;
};

export function OGP({ title, siteName }: Props) {
  return (
    <div
      style={{
        backgroundColor: "rgb(55, 65, 81)",
        padding: "2rem",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "black",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "1rem",
          padding: "1.5rem",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            marginBottom: "2rem",
            fontWeight: "600",
            lineHeight: "1.3",
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: "2rem", textAlign: "right" }}>{siteName}</p>
      </div>
    </div>
  );
}
