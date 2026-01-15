import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import logoImage from "@/assets/SV_Logo2015_ZW-1024x630.png";

export const CTASection = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        color: "primary.contrastText",
        py: 6,
        height: "100%",
      }}
    >
      <Box
        sx={{
          maxWidth: theme.breakpoints.values.md,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 3,
            mb: 2,
          }}
        >
          <Box
            component="img"
            src={logoImage}
            alt="Stichting Vluchteling"
            sx={{
              height: 120,
              width: "auto",
              flexShrink: 0,
            }}
          />
          <Box>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                textTransform: "uppercase",
                mb: 2,
              }}
            >
              GEEF WAT JE KUNT
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 400 }}>
              Word donateur van Stichting Vluchteling! Jouw hulp redt levens.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
