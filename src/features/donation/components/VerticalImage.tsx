import { Box, useTheme, useMediaQuery } from "@mui/material";
import verticalImage from "@/assets/vluchtelingen-idlib-Syrie.jpg";

export const VerticalImage = () => {
  const theme = useTheme();
  const isWideScreen = useMediaQuery(theme.breakpoints.up("lg"));

  if (!isWideScreen) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "50vw",
        height: "100vh",
        overflow: "hidden",
        margin: 0,
        padding: 0,
        zIndex: 0,
      }}
    >
      <Box
        component="img"
        src={verticalImage}
        alt="Vluchtelingen Idlib Syrie"
        sx={{
          width: "100%",
          height: "calc(100% + 150px)",
          objectFit: "cover",
          objectPosition: "center top",
          display: "block",
          margin: 0,
          padding: 0,
          transform: "translateY(-150px)",
        }}
      />
    </Box>
  );
};
