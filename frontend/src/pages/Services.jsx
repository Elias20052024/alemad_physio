import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Divider,
  useTheme,
} from "@mui/material";
import { useLanguage } from "../context/LanguageContext";
import { keyframes } from "@emotion/react";

const Services = () => {
  const { t } = useLanguage();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Animation keyframes
  const fadeInUp = keyframes`
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  const slideIn = keyframes`
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  `;
  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 4, md: 8 },
        bgcolor: theme.palette.mode === "dark" ? "#1a1a1a" : "#f8f9fa",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1a1a1a 0%, #2d3d4d 100%)"
            : "linear-gradient(135deg, #f8f9fa 0%, #e8f4ff 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            mb: { xs: 4, md: 8 },
            color: "#1C6FB5",
            fontWeight: "bold",
            fontSize: { xs: "1.8rem", md: "3rem" },
            animation: `${fadeInUp} 0.8s ease`,
          }}
        >
          {t("services.title") || "Our Services"}
        </Typography>

        {/* Tabs for Departments */}
        <Box
          sx={{
            mb: 6,
            borderBottom: 1,
            borderColor: theme.palette.mode === "dark" ? "#444" : "divider",
            overflowX: "auto",
            animation: `${fadeInUp} 0.8s ease 0.2s both`,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                color: theme.palette.mode === "dark" ? "#999" : "#666",
                fontWeight: 500,
                fontSize: { xs: "0.85rem", sm: "1rem" },
                minWidth: { xs: "120px", sm: "auto" },
                px: { xs: 1, sm: 2 },
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#1C6FB5",
                  backgroundColor: "rgba(28, 111, 181, 0.05)",
                },
              },
              "& .Mui-selected": {
                color: "#1C6FB5",
                fontWeight: "bold",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#1C6FB5",
                height: 4,
              },
            }}
          >
            <Tab label={t('tabs.adult')} />
            <Tab label={t('tabs.pediatric')} />
            <Tab label={t('tabs.intensive')} />
          </Tabs>
        </Box>

        {/* Adult Department */}
        {tabValue === 0 && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card
                sx={{
                  boxShadow: 3,
                  animation: `${fadeInUp} 0.6s ease`,
                  transition: "all 0.3s ease",
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#2d3d4d" : "#ffffff",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#1C6FB5",
                    color: "white",
                    p: 2,
                    fontWeight: "bold",
                    fontSize: { xs: "1.1rem", md: "1.3rem" },
                  }}
                >
                  {t("departments.adult.title")}
                </Box>
                <CardContent
                  sx={{
                    color:
                      theme.palette.mode === "dark" ? "#e0e0e0" : "#1a1a1a",
                  }}
                >
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{
                      lineHeight: 1.8,
                      mb: 3,
                      animation: `${slideIn} 0.6s ease`,
                      color:
                        theme.palette.mode === "dark" ? "#e0e0e0" : "#1a1a1a",
                      fontSize: { xs: "0.95rem", md: "1rem" },
                    }}
                  >
                    {t("departments.adult.intro")}
                  </Typography>

                  <Box
                    sx={{
                      p: 1.5,
                      mb: 2,
                      mt: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "1.1rem", md: "1.25rem" },
                        m: 0,
                        color: "#1C6FB5",
                      }}
                    >
                      {t('sectionLabels.treatmentMethods')}
                    </Typography>
                  </Box>
                  <Box component="ul" sx={{ pl: 2, mb: 3 }}>
                    {t("departments.adult.methods")?.map((method, idx) => (
                      <Typography
                        component="li"
                        key={idx}
                        variant="body2"
                        sx={{
                          mb: 1,
                          color:
                            theme.palette.mode === "dark"
                              ? "#e0e0e0"
                              : "#1a1a1a",
                          animation: `${slideIn} 0.6s ease ${idx * 0.1}s both`,
                          fontSize: { xs: "0.9rem", md: "0.95rem" },
                        }}
                      >
                        {method}
                      </Typography>
                    ))}
                  </Box>

                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      mb: 2,
                      mt: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "1.1rem", md: "1.25rem" },
                        m: 0,
                        color: "#1C6FB5",
                      }}
                    >
                      {t('sectionLabels.conditionsTreated')}
                    </Typography>
                  </Box>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {t("departments.adult.conditions")?.map(
                      (condition, idx) => (
                        <Typography
                          component="li"
                          key={idx}
                          variant="body2"
                          sx={{
                            mb: 1,
                            color:
                              theme.palette.mode === "dark"
                                ? "#e0e0e0"
                                : "#1a1a1a",
                            fontSize: { xs: "0.9rem", md: "0.95rem" },
                          }}
                        >
                          {condition}
                        </Typography>
                      )
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Pediatric Department */}
        {tabValue === 1 && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card
                sx={{
                  boxShadow: 3,
                  animation: `${fadeInUp} 0.6s ease`,
                  transition: "all 0.3s ease",
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#2d3d4d" : "#ffffff",
                  "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
                }}
              >
                <CardHeader
                  title={t("departments.pediatric.title")}
                  sx={{ bgcolor: "#CBDD71", color: "white" }}
                />
                <CardContent
                  sx={{
                    color:
                      theme.palette.mode === "dark" ? "#e0e0e0" : "#1a1a1a",
                  }}
                >
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{
                      lineHeight: 1.8,
                      mb: 3,
                      color:
                        theme.palette.mode === "dark" ? "#e0e0e0" : "#1a1a1a",
                      fontSize: { xs: "0.95rem", md: "1rem" },
                    }}
                  >
                    {t("departments.pediatric.intro")}
                  </Typography>

                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      mb: 2,
                      mt: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "1.1rem", md: "1.25rem" },
                        m: 0,
                        color: "#CBDD71",
                      }}
                    >
                      {t('sectionLabels.therapyApproach')}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 3,
                      color:
                        theme.palette.mode === "dark" ? "#e0e0e0" : "#1a1a1a",
                      fontSize: { xs: "0.9rem", md: "0.95rem" },
                    }}
                  >
                    {t("departments.pediatric.therapy")}
                  </Typography>

                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      mb: 2,
                      mt: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "1.1rem", md: "1.25rem" },
                        m: 0,
                        color: "#CBDD71",
                      }}
                    >
                      {t('sectionLabels.conditionsTreated')}
                    </Typography>
                  </Box>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {t("departments.pediatric.conditions")?.map(
                      (condition, idx) => (
                        <Typography
                          component="li"
                          key={idx}
                          variant="body2"
                          sx={{
                            mb: 1,
                            color:
                              theme.palette.mode === "dark"
                                ? "#e0e0e0"
                                : "#1a1a1a",
                            fontSize: { xs: "0.9rem", md: "0.95rem" },
                          }}
                        >
                          {condition}
                        </Typography>
                      )
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Intensive Program */}
        {tabValue === 2 && (
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card
                sx={{
                  boxShadow: 3,
                  animation: `${fadeInUp} 0.6s ease`,
                  transition: "all 0.3s ease",
                  backgroundColor:
                    theme.palette.mode === "dark" ? "#2d3d4d" : "#ffffff",
                  "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
                }}
              >
                <CardHeader
                  title={t("departments.intensive.title")}
                  sx={{ bgcolor: "#74C3E7", color: "white" }}
                />
                <CardContent
                  sx={{
                    color:
                      theme.palette.mode === "dark" ? "#e0e0e0" : "#1a1a1a",
                  }}
                >
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{
                      lineHeight: 1.8,
                      mb: 3,
                      color:
                        theme.palette.mode === "dark" ? "#e0e0e0" : "#1a1a1a",
                      fontSize: { xs: "0.95rem", md: "1rem" },
                    }}
                  >
                    {t("departments.intensive.intro")}
                  </Typography>

                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      mb: 2,
                      mt: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "1.1rem", md: "1.25rem" },
                        m: 0,
                        color: "#74C3E7",
                      }}
                    >
                      {t('sectionLabels.benefits')}
                    </Typography>
                  </Box>
                  <Box component="ul" sx={{ pl: 2, mb: 3 }}>
                    {t("departments.intensive.benefits")?.map(
                      (benefit, idx) => (
                        <Typography
                          component="li"
                          key={idx}
                          variant="body2"
                          sx={{
                            mb: 1,
                            color:
                              theme.palette.mode === "dark"
                                ? "#e0e0e0"
                                : "#1a1a1a",
                            fontSize: { xs: "0.9rem", md: "0.95rem" },
                          }}
                        >
                          {benefit}
                        </Typography>
                      )
                    )}
                  </Box>

                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      mb: 2,
                      mt: 3,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "1.1rem", md: "1.25rem" },
                        m: 0,
                        color: "#74C3E7",
                      }}
                    >
                      {t('sectionLabels.sessionDuration')}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 3,
                      color:
                        theme.palette.mode === "dark" ? "#e0e0e0" : "#1a1a1a",
                      fontSize: { xs: "0.9rem", md: "0.95rem" },
                    }}
                  >
                    {t("departments.intensive.duration")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Techniques Section */}
        <Box
          sx={{
            mt: 8,
            p: 4,
            bgcolor: theme.palette.mode === "dark" ? "#2d3d4d" : "#f5f5f5",
            borderRadius: 2,
            borderLeft: "5px solid #1C6FB5",
            animation: `${fadeInUp} 0.6s ease`,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#1C6FB5",
              fontWeight: "bold",
              mb: 3,
              fontSize: { xs: "1.2rem", md: "1.5rem" },
            }}
          >
            {t("techniques.title")}
          </Typography>
          <Grid container spacing={2}>
            {t("techniques.list")?.map((technique, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      bgcolor: "#1C6FB5",
                      borderRadius: "50%",
                      mr: 2,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        theme.palette.mode === "dark" ? "#e0e0e0" : "#1a1a1a",
                      fontSize: { xs: "0.9rem", md: "0.95rem" },
                    }}
                  >
                    {technique}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Services;
