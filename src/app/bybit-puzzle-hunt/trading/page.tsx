"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useTheme, 
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  Divider,
  Chip
} from "@mui/material";
import ExtensionIcon from "@mui/icons-material/Extension";
import PersonIcon from "@mui/icons-material/Person";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Import components
import TradingCard from "@/components/ui/TradingCard";
import ContactDialog from "@/components/ui/ContactDialog";

interface TradingPost {
  id: string;
  hasPieces: string;
  needsPieces: string;
  type: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    name: string | null;
    role: string;
  };
}

export default function BybitPuzzleHuntTrading() {
  const { data: session, status } = useSession();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();
  
  // State for posts
  const [posts, setPosts] = useState<TradingPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // State for creating posts
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasPieces, setHasPieces] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [needsPieces, setNeedsPieces] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  
  // State for puzzle selection
  const [puzzleDialogOpen, setPuzzleDialogOpen] = useState(false);
  const [selectedNeedPuzzle, setSelectedNeedPuzzle] = useState<string | null>(null);
  const [selectedNeedPiece, setSelectedNeedPiece] = useState<number | null>(null);
  const [selectedHasPuzzle, setSelectedHasPuzzle] = useState<string | null>(null);
  const [selectedHasPieces, setSelectedHasPieces] = useState<{puzzle: string, piece: number}[]>([]);
  
  // State for notifications
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  
  // State for social media warning
  const [socialMediaWarningOpen, setSocialMediaWarningOpen] = useState(false);

  // State for contact user dialog
  const [contactOpen, setContactOpen] = useState(false);
  const [contactUser, setContactUser] = useState<string | null>(null);

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/posts");
      
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      
      const data = await response.json();
      setPosts(data.posts);
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching posts";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    // Ensure user is authenticated
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }
    
    // Additional security check
    if (status !== "authenticated") {
      setCreateError("You must be logged in to create a post");
      return;
    }
    
    // Format the pieces data
    const formatPieces = (puzzle: string, piece: number) => {
      return `${puzzle.replace("-puzzle", "").toUpperCase()}#${piece}`;
    };

    // Format has pieces
    const formattedHasPieces = selectedHasPieces.map(p => 
      formatPieces(p.puzzle, p.piece)
    ).join(", ");

    // Format need piece
    const formattedNeedPiece = selectedNeedPuzzle && selectedNeedPiece ? 
      formatPieces(selectedNeedPuzzle, selectedNeedPiece) : "";
    
    try {
      setCreating(true);
      setCreateError("");
      
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hasPieces: formattedHasPieces,
          needsPieces: formattedNeedPiece,
          type: "TRADING",
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.error === "NO_SOCIAL_MEDIA") {
          setSocialMediaWarningOpen(true);
          return;
        }
        throw new Error(data.message || "Failed to create post");
      }
      
      // Success
      setPuzzleDialogOpen(false);
      setSelectedNeedPuzzle(null);
      setSelectedNeedPiece(null);
      setSelectedHasPuzzle(null);
      setSelectedHasPieces([]);
      setNotification({ open: true, message: "Post created successfully!", severity: "success" });
      
      // Refresh posts
      fetchPosts();
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while creating the post";
      setCreateError(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      
      // Success
      setNotification({ open: true, message: "Post deleted successfully!", severity: "success" });
      
      // Refresh posts
      fetchPosts();
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while deleting the post";
      setNotification({ open: true, message: errorMessage, severity: "error" });
    }
  };

  // Handlers
  const handleContactOpen = (user: string) => {
    setContactUser(user);
    setContactOpen(true);
  };

  const handleContactClose = () => {
    setContactOpen(false);
    setContactUser(null);
  };

  const handlePuzzleSelect = (puzzle: string, step: 'need' | 'has') => {
    if (step === 'need') {
      setSelectedNeedPuzzle(puzzle);
    } else {
      setSelectedHasPuzzle(puzzle);
    }
  };

  const handleNeedPieceSelect = (piece: number) => {
    setSelectedNeedPiece(piece);
  };

  const handleHasPieceSelect = (puzzle: string, piece: number) => {
    // Check if this piece is already selected
    const existingIndex = selectedHasPieces.findIndex(p => p.puzzle === puzzle && p.piece === piece);
    
    if (existingIndex >= 0) {
      // Remove the piece if already selected
      const newPieces = [...selectedHasPieces];
      newPieces.splice(existingIndex, 1);
      setSelectedHasPieces(newPieces);
    } else {
      // Add the piece
      setSelectedHasPieces([...selectedHasPieces, {puzzle, piece}]);
    }
  };

  const isPieceSelected = (puzzle: string, piece: number) => {
    return selectedHasPieces.some(p => p.puzzle === puzzle && p.piece === piece);
  };

  // Process the completed selection
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmitSelection = () => {
    handleCreatePost();
  };

  const handleCreateButtonClick = () => {
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }
    
    setPuzzleDialogOpen(true);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <ExtensionIcon fontSize="large" color="primary" />
        <Typography variant="h4" fontWeight={700}>
          Bybit Puzzle Hunt Trading
        </Typography>
      </Box>

      {/* Description */}
      <Typography variant="body1" mb={4}>
        Exchange and trade your Bybit Puzzle Hunt pieces with other users. Post
        what you have and what you need to complete your puzzle!
      </Typography>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Loading indicator */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {/* No posts message */}
      {!loading && posts.length === 0 && (
        <Alert severity="info" sx={{ mb: 4 }}>
          No trading posts available. Be the first to create one!
        </Alert>
      )}

      {/* Trading Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gap: 4,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr",
            md: "1fr 1fr",
          },
        }}
      >
        {posts.map((post) => (
          <TradingCard
            key={post.id}
            user={post.author.username}
            avatar={<PersonIcon />}
            has={post.hasPieces}
            needs={post.needsPieces}
            onContactClick={handleContactOpen}
            onDelete={session?.user?.role === "ADMIN" || session?.user?.id === post.author.id ? 
              () => handleDeletePost(post.id) : undefined}
          />
        ))}
      </Box>

      {/* Contact Dialog */}
      <ContactDialog
        open={contactOpen}
        onClose={handleContactClose}
        username={contactUser}
      />

      {/* Floating Plus Button - Only shown to authenticated users */}
      {session?.user && (
        <Button
          variant="contained"
          color="secondary"
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            borderRadius: "50%",
            width: 64,
            height: 64,
            minWidth: 0,
            fontSize: 36,
            zIndex: 1201,
          }}
          onClick={handleCreateButtonClick}
        >
          +
        </Button>
      )}

      {/* Puzzle Selector Dialog */}
      <Dialog 
        open={puzzleDialogOpen} 
        onClose={() => setPuzzleDialogOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#121212",
            color: "#fff",
          }
        }}
      >
        <DialogTitle>
          {!selectedNeedPuzzle && "Select a Puzzle You Need"}
          {selectedNeedPuzzle && !selectedNeedPiece && `Select a Piece You Need from ${selectedNeedPuzzle.replace("-puzzle", "").toUpperCase()}`}
          {selectedNeedPuzzle && selectedNeedPiece && "Select Pieces You Have"}
        </DialogTitle>
        <DialogContent>
          {createError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {createError}
            </Alert>
          )}

          {/* Step 1: Select puzzle you need */}
          {!selectedNeedPuzzle && (
            <>
              <Alert severity="info" sx={{ mb: 2, bgcolor: '#1a3a53', color: '#fff' }}>
                First, select a puzzle that you need a piece from.
              </Alert>
              <Stack direction="row" spacing={3} justifyContent="center" alignItems="center" sx={{ py: 2 }}>
                {["usdt-puzzle", "vet-puzzle", "xaut-puzzle"].map((puzzle) => (
                  <Box
                    key={puzzle}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "#23272F",
                      cursor: "pointer",
                      textAlign: "center",
                      '&:hover': { boxShadow: 6, bgcolor: '#333' },
                    }}
                    onClick={() => handlePuzzleSelect(puzzle, 'need')}
                  >
                    <Image
                      src={`/bybit-puzzle-hunt/${puzzle}/1.png`}
                      alt={puzzle}
                      width={100}
                      height={100}
                      style={{ borderRadius: 12, marginBottom: 10 }}
                    />
                    <Typography variant="h6" color="#fff">
                      {puzzle.replace("-puzzle", "").toUpperCase()}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </>
          )}

          {/* Step 2: Select piece you need */}
          {selectedNeedPuzzle && !selectedNeedPiece && (
            <>
              <Alert severity="info" sx={{ mb: 2, bgcolor: '#1a3a53', color: '#fff' }}>
                Select ONE piece that you need from this puzzle.
              </Alert>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 3,
                  justifyItems: 'center',
                  alignItems: 'center',
                  maxWidth: 360,
                  mx: 'auto',
                }}
              >
                {[...Array(9)].map((_, idx) => (
                  <Box
                    key={idx + 1}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      bgcolor: "#23272F",
                      cursor: "pointer",
                      border: selectedNeedPiece === (idx + 1) ? '2px solid #4caf50' : '2px solid #333',
                      '&:hover': { boxShadow: 6, bgcolor: '#333' },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                    onClick={() => handleNeedPieceSelect(idx + 1)}
                  >
                    <Image
                      src={`/bybit-puzzle-hunt/${selectedNeedPuzzle}/${idx + 1}.png`}
                      alt={`Piece ${idx + 1}`}
                      width={90}
                      height={90}
                      style={{ borderRadius: 6 }}
                    />
                    <Typography variant="body1" color="#fff">
                      Piece {idx + 1}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}

          {/* Step 3: Select pieces you have */}
          {selectedNeedPuzzle && selectedNeedPiece && (
            <Box>
              {/* Selected pieces summary */}
              <Box mb={3}>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  Your selection:
                </Typography>
                <Box sx={{ bgcolor: '#1e1e1e', p: 2, borderRadius: 2, mb: 2 }}>
                  <Typography variant="body2" color="#4caf50" fontWeight="bold">
                    You need: {selectedNeedPuzzle?.replace("-puzzle", "").toUpperCase()} Piece {selectedNeedPiece}
                  </Typography>
                  
                  <Divider sx={{ my: 1, bgcolor: '#333' }} />
                  
                  <Typography variant="body2" color="#ff9800" fontWeight="bold" mb={1}>
                    You have: {selectedHasPieces.length > 0 ? '' : 'No pieces selected yet'}
                  </Typography>
                  
                  {selectedHasPieces.length > 0 && (
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {selectedHasPieces.map((p, idx) => (
                        <Chip 
                          key={idx}
                          label={`${p.puzzle.replace("-puzzle", "").toUpperCase()} #${p.piece}`}
                          sx={{ bgcolor: '#333', color: '#fff', mb: 0.5 }}
                          onDelete={() => handleHasPieceSelect(p.puzzle, p.piece)}
                        />
                      ))}
                    </Stack>
                  )}
                </Box>
              </Box>

              {/* Puzzle type selector for "has" */}
              <Typography variant="subtitle1" mb={1}>
                Select puzzle type:
              </Typography>
              <Stack direction="row" spacing={2} mb={2}>
                {["usdt-puzzle", "vet-puzzle", "xaut-puzzle"].map((puzzle) => (
                  <Button
                    key={puzzle}
                    variant={selectedHasPuzzle === puzzle ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handlePuzzleSelect(puzzle, 'has')}
                    sx={{ textTransform: 'uppercase' }}
                  >
                    {puzzle.replace("-puzzle", "")}
                  </Button>
                ))}
              </Stack>

              {/* Piece selector for the selected "has" puzzle */}
              {selectedHasPuzzle && (
                <Box>
                  <Typography variant="subtitle1" mb={2}>
                    Select pieces you have from {selectedHasPuzzle.replace("-puzzle", "").toUpperCase()}:
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 2,
                      justifyItems: 'center',
                      alignItems: 'center',
                      maxWidth: 360,
                      mx: 'auto',
                    }}
                  >
                    {[...Array(9)].map((_, idx) => {
                      const isSelected = isPieceSelected(selectedHasPuzzle, idx + 1);
                      return (
                        <Box
                          key={idx + 1}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: "#23272F",
                            cursor: "pointer",
                            border: isSelected ? '2px solid #ff9800' : '2px solid #333',
                            '&:hover': { boxShadow: 3, bgcolor: '#333' },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                          onClick={() => handleHasPieceSelect(selectedHasPuzzle, idx + 1)}
                        >
                          <Image
                            src={`/bybit-puzzle-hunt/${selectedHasPuzzle}/${idx + 1}.png`}
                            alt={`Piece ${idx + 1}`}
                            width={70}
                            height={70}
                            style={{ borderRadius: 4 }}
                          />
                          <Typography variant="body2" color="#fff">
                            #{idx + 1}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          {(selectedNeedPuzzle || selectedNeedPiece) && (
            <Button 
              onClick={() => {
                if (selectedNeedPiece) {
                  setSelectedNeedPiece(null);
                } else if (selectedNeedPuzzle) {
                  setSelectedNeedPuzzle(null);
                }
              }} 
              color="secondary" 
              variant="outlined"
            >
              Back
            </Button>
          )}
          
          <Box sx={{ ml: 'auto' }}>
            <Button onClick={() => setPuzzleDialogOpen(false)} color="inherit">
              Cancel
            </Button>
            {selectedNeedPuzzle && selectedNeedPiece && (
              <Button 
                onClick={handleCreatePost} 
                color="primary" 
                variant="contained"
                disabled={creating || selectedHasPieces.length === 0}
                sx={{ ml: 1 }}
              >
                {creating ? <CircularProgress size={24} /> : "Create Post"}
              </Button>
            )}
          </Box>
        </Box>
      </Dialog>

      {/* Social Media Warning Dialog */}
      <Dialog open={socialMediaWarningOpen} onClose={() => setSocialMediaWarningOpen(false)}>
        <DialogTitle>Social Media Required</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You need to set up at least one social media contact method in your profile before posting.
            This allows other users to contact you for trading.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSocialMediaWarningOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              setSocialMediaWarningOpen(false);
              router.push("/profile");
            }} 
            variant="contained" 
            color="primary"
          >
            Go to Profile
          </Button>
        </DialogActions>
      </Dialog>

      {/* We're using our custom dialog instead of the PuzzleSelector component */}

      {/* Notification Snackbar */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
