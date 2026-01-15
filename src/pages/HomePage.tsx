import { Box, useTheme, useMediaQuery } from "@mui/material";
import { CTASection, DonationForm, VerticalImage } from "@/features/donation/components";

export const HomePage = () => {
  const theme = useTheme();
  const isWideScreen = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        padding: 0,
        marginTop: -4, // Compensate for MainLayout py: 4
        marginBottom: -4, // Compensate for MainLayout py: 4
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          minHeight: "100vh",
          margin: 0,
          padding: 0,
          overflowX: "hidden", // Prevent horizontal scroll
        }}
      >
        {/* Left column: Yellow CTA + Form */}
        <Box
          sx={{
            flex: 1,
            maxWidth: isWideScreen ? "50%" : "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            margin: 0,
            padding: 0,
            overflowX: "hidden", // Prevent horizontal scroll
          }}
        >
          <CTASection />
          <DonationForm />
        </Box>

        {/* Right column: Vertical image (only on wide screens) */}
        {isWideScreen && (
          <Box
            sx={{
              width: "50%",
              flexShrink: 0,
              margin: 0,
              padding: 0,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <VerticalImage />
          </Box>
        )}
      </Box>
    </Box>
  );
};
