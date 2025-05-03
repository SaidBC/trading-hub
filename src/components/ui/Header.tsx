"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  Fade,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExtensionIcon from "@mui/icons-material/Extension";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, isAuthenticated, signOut } = useAuth();
  const router = useRouter();
  
  // User profile menu
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const openUserMenu = Boolean(userMenuAnchorEl);
  
  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };
  
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
    router.refresh();
    handleUserMenuClose();
  };

  // State for dropdown menus
  const [tradingAnchorEl, setTradingAnchorEl] = useState<null | HTMLElement>(null);
  const [marketplaceAnchorEl, setMarketplaceAnchorEl] = useState<null | HTMLElement>(null);
  
  const openTrading = Boolean(tradingAnchorEl);
  const openMarketplace = Boolean(marketplaceAnchorEl);

  const handleTradingClick = (event: React.MouseEvent<HTMLElement>) => {
    setTradingAnchorEl(event.currentTarget);
  };

  const handleMarketplaceClick = (event: React.MouseEvent<HTMLElement>) => {
    setMarketplaceAnchorEl(event.currentTarget);
  };

  const handleTradingClose = () => {
    setTradingAnchorEl(null);
  };

  const handleMarketplaceClose = () => {
    setMarketplaceAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { 
      name: "Trading", 
      href: "/trading",
      hasDropdown: true,
      dropdownItems: [
        { name: "Bybit Puzzle Hunt", href: "/bybit-puzzle-hunt/trading" },
        { name: "Trading History", href: "/trading/history" },
      ] 
    },
    { 
      name: "Marketplace", 
      href: "/marketplace",
      hasDropdown: true,
      dropdownItems: [
        { name: "Buy", href: "/marketplace/buy" },
        { name: "Sell", href: "/marketplace/sell" },
        { name: "Auctions", href: "/marketplace/auctions" },
      ] 
    },
    { name: "Admins", href: "/admins", hasDropdown: false },
  ];

  // State for mobile menu dropdowns
  const [mobileExpandedItems, setMobileExpandedItems] = useState<{[key: string]: boolean}>({});

  const toggleMobileExpand = (itemName: string) => {
    setMobileExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const drawer = (
    <Box sx={{ width: 280, bgcolor: "#121212", height: "100%" }} role="presentation">
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <IconButton edge="start" color="inherit" onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ bgcolor: "#333" }} />
      <List sx={{ py: 0 }}>
        {navItems.map((item) => (
          <React.Fragment key={item.name}>
            {item.hasDropdown ? (
              <>
                <ListItem 
                  onClick={() => toggleMobileExpand(item.name)}
                  sx={{ 
                    color: "#fff",
                    '&:hover': {
                      bgcolor: "#333",
                    },
                    py: 1.5,
                    cursor: 'pointer'
                  }}
                >
                  <ListItemText primary={item.name} />
                  <IconButton edge="end" size="small" sx={{ color: '#fff' }}>
                    {mobileExpandedItems[item.name] ? 
                      <Box sx={{ transform: 'rotate(180deg)' }}><ExpandMoreIcon /></Box> : 
                      <ExpandMoreIcon />}
                  </IconButton>
                </ListItem>
                <Box
                  sx={{
                    display: mobileExpandedItems[item.name] ? 'block' : 'none',
                    bgcolor: '#1a1a1a',
                    pl: 2,
                  }}
                >
                  {item.dropdownItems?.map((dropdownItem) => (
                    <ListItem 
                      key={dropdownItem.name} 
                      component={Link} 
                      href={dropdownItem.href}
                      onClick={handleDrawerToggle}
                      sx={{ 
                        color: "#fff",
                        '&:hover': {
                          bgcolor: "#333",
                        },
                        py: 1,
                      }}
                    >
                      <ListItemText 
                        primary={dropdownItem.name} 
                        primaryTypographyProps={{ fontSize: '0.9rem' }}
                      />
                    </ListItem>
                  ))}
                </Box>
                <Divider sx={{ bgcolor: "#333" }} />
              </>
            ) : (
              <>
                <ListItem 
                  component={Link} 
                  href={item.href}
                  onClick={handleDrawerToggle}
                  sx={{ 
                    color: "#fff",
                    '&:hover': {
                      bgcolor: "#333",
                    },
                    py: 1.5,
                  }}
                >
                  <ListItemText primary={item.name} />
                </ListItem>
                <Divider sx={{ bgcolor: "#333" }} />
              </>
            )}
          </React.Fragment>
        ))}
      </List>
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        {isAuthenticated ? (
          <>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, px: 1 }}>
              <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                {user?.name?.[0] || user?.username?.[0] || <PersonIcon />}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {user?.name || user?.username}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  {user?.email}
                </Typography>
              </Box>
            </Box>
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth 
              component={Link} 
              href="/messages"
              sx={{ borderWidth: 2, mb: 1 }}
            >
              Messages
            </Button>
            <Button 
              variant="contained" 
              color="error" 
              fullWidth 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              component={Link} 
              href="/auth/login"
              sx={{ borderWidth: 2 }}
            >
              Login
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth 
              component={Link} 
              href="/auth/signup"
              sx={{ borderWidth: 2 }}
            >
              Sign Up
            </Button>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#121212", boxShadow: 2 }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 0, sm: 2 } }}>
          {/* Logo and Brand */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Link href="/" style={{ display: "flex", alignItems: "center" }}>
              <ExtensionIcon 
                sx={{ 
                  fontSize: 40, 
                  color: "#4caf50",
                  filter: "drop-shadow(0 0 2px rgba(76, 175, 80, 0.5))"
                }} 
              />
              <Typography
                variant="h6"
                component="div"
                sx={{ 
                  ml: 1,
                  fontWeight: 700,
                  display: { xs: "none", sm: "block" },
                  background: "linear-gradient(90deg, #4caf50, #2196f3)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Trading Hub
              </Typography>
            </Link>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", mr: 4 }}>
              {navItems.map((item) => (
                <React.Fragment key={item.name}>
                  {item.hasDropdown ? (
                    <Box>
                      <Button
                        aria-controls={item.name === "Trading" ? (openTrading ? "trading-menu" : undefined) : (openMarketplace ? "marketplace-menu" : undefined)}
                        aria-haspopup="true"
                        aria-expanded={item.name === "Trading" ? openTrading : openMarketplace ? true : undefined}
                        onClick={item.name === "Trading" ? handleTradingClick : handleMarketplaceClick}
                        endIcon={<ExpandMoreIcon />}
                        sx={{ 
                          color: "#fff",
                          mx: 1,
                          '&:hover': {
                            bgcolor: "rgba(255,255,255,0.1)",
                          }
                        }}
                      >
                        {item.name}
                      </Button>
                      <Menu
                        id={item.name === "Trading" ? "trading-menu" : "marketplace-menu"}
                        anchorEl={item.name === "Trading" ? tradingAnchorEl : marketplaceAnchorEl}
                        open={item.name === "Trading" ? openTrading : openMarketplace}
                        onClose={item.name === "Trading" ? handleTradingClose : handleMarketplaceClose}
                        TransitionComponent={Fade}
                        MenuListProps={{
                          'aria-labelledby': 'dropdown-button',
                        }}
                        slotProps={{
                          paper: {
                            sx: {
                              bgcolor: "#1e1e1e",
                              mt: 0.5,
                              boxShadow: 3,
                              borderRadius: 1,
                              minWidth: 180,
                            }
                          }
                        }}
                      >
                        {item.dropdownItems?.map((dropdownItem) => (
                          <MenuItem 
                            key={dropdownItem.name} 
                            onClick={item.name === "Trading" ? handleTradingClose : handleMarketplaceClose}
                            component={Link}
                            href={dropdownItem.href}
                            sx={{ 
                              color: "#fff",
                              '&:hover': {
                                bgcolor: "rgba(255,255,255,0.1)",
                              }
                            }}
                          >
                            {dropdownItem.name}
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  ) : (
                    <Button
                      component={Link}
                      href={item.href}
                      sx={{ 
                        color: "#fff",
                        mx: 1,
                        '&:hover': {
                          bgcolor: "rgba(255,255,255,0.1)",
                        }
                      }}
                    >
                      {item.name}
                    </Button>
                  )}
                </React.Fragment>
              ))}
            </Box>
          )}

          {/* Auth Buttons */}
          {!isMobile ? (
            <Box sx={{ display: "flex", gap: 2, ml: 'auto', alignItems: "center" }}>
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={handleUserMenuClick}
                    sx={{ 
                      textTransform: "none", 
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      gap: 1
                    }}
                    endIcon={<ExpandMoreIcon />}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                      {user?.name?.[0] || user?.username?.[0] || <PersonIcon />}
                    </Avatar>
                    <Typography variant="body2">
                      {user?.username}
                    </Typography>
                  </Button>
                  <Menu
                    id="user-menu"
                    anchorEl={userMenuAnchorEl}
                    open={openUserMenu}
                    onClose={handleUserMenuClose}
                    TransitionComponent={Fade}
                    slotProps={{
                      paper: {
                        sx: {
                          bgcolor: "#1e1e1e",
                          mt: 0.5,
                          boxShadow: 3,
                          borderRadius: 1,
                          minWidth: 180,
                        }
                      }
                    }}
                  >
                    <MenuItem 
                      component={Link} 
                      href="/profile" 
                      onClick={handleUserMenuClose}
                      sx={{ color: "#fff" }}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem 
                      component={Link} 
                      href="/messages" 
                      onClick={handleUserMenuClose}
                      sx={{ color: "#fff" }}
                    >
                      Messages
                    </MenuItem>
                    <Divider sx={{ bgcolor: "#333" }} />
                    <MenuItem 
                      onClick={handleLogout}
                      sx={{ color: "#fff" }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    component={Link} 
                    href="/auth/login"
                    size="small"
                    sx={{
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    component={Link} 
                    href="/auth/signup"
                    size="small"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          ) : (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;
