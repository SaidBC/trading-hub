"use client";
import React from "react";
import { Box, Stack, Typography, Dialog, DialogTitle, DialogContent, Button, Chip, Alert, Divider } from "@mui/material";

interface PuzzleSelectorProps {
  open: boolean;
  onClose: () => void;
  selectedPuzzle: string | null;
  onPuzzleSelect: (puzzle: string) => void;
  onPieceSelect: (piece: number) => void;
  onBack: () => void;
}

const PuzzleSelector: React.FC<PuzzleSelectorProps> = ({
  open,
  onClose,
  selectedPuzzle,
  onPuzzleSelect,
  onPieceSelect,
  onBack,
}) => {
  // Track the selection flow
  const [selectionStep, setSelectionStep] = React.useState<'puzzle' | 'need' | 'has'>('puzzle');
  const [needPuzzle, setNeedPuzzle] = React.useState<string | null>(null);
  const [needPiece, setNeedPiece] = React.useState<number | null>(null);
  const [hasPuzzle, setHasPuzzle] = React.useState<string | null>(null);
  const [hasPieces, setHasPieces] = React.useState<{puzzle: string, piece: number}[]>([]);

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setSelectionStep('puzzle');
      setNeedPuzzle(null);
      setNeedPiece(null);
      setHasPuzzle(null);
      setHasPieces([]);
    }
  }, [open]);

  // Handle puzzle selection for needs
  const handlePuzzleSelect = (puzzle: string) => {
    if (selectionStep === 'puzzle') {
      setNeedPuzzle(puzzle);
      setSelectionStep('need');
    } else if (selectionStep === 'has') {
      setHasPuzzle(puzzle);
    }
  };

  // Handle piece selection for needs
  const handleNeedPieceSelect = (piece: number) => {
    setNeedPiece(piece);
    // Move to the "has" selection step
    setSelectionStep('has');
  };

  // Handle piece selection for has
  const handleHasPieceSelect = (puzzle: string, piece: number) => {
    // Check if this piece is already selected
    const existingIndex = hasPieces.findIndex(p => p.puzzle === puzzle && p.piece === piece);
    
    if (existingIndex >= 0) {
      // Remove the piece if already selected
      const newPieces = [...hasPieces];
      newPieces.splice(existingIndex, 1);
      setHasPieces(newPieces);
    } else {
      // Add the piece
      setHasPieces([...hasPieces, {puzzle, piece}]);
    }
  };

  // Check if a piece is selected in the "has" list
  const isPieceSelected = (puzzle: string, piece: number) => {
    return hasPieces.some(p => p.puzzle === puzzle && p.piece === piece);
  };

  // Handle the final submission
  const handleSubmit = () => {
    if (needPiece !== null && needPuzzle !== null) {
      // Here we would pass all the selected pieces, but for now we'll just use the existing flow
      // and pass the need piece to maintain compatibility
      onPuzzleSelect(needPuzzle);
      onPieceSelect(needPiece);
    }
  };

  // Handle back button
  const handleBack = () => {
    if (selectionStep === 'need') {
      setSelectionStep('puzzle');
      setNeedPuzzle(null);
    } else if (selectionStep === 'has') {
      setSelectionStep('need');
      setHasPuzzle(null);
      setHasPieces([]);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "#121212",
            color: "#fff",
            maxWidth: 600,
            width: '100%',
          },
        },
      }}
    >
      <DialogTitle>
        {selectionStep === 'puzzle' && "Select a Puzzle"}
        {selectionStep === 'need' && "Select a Piece You Need"}
        {selectionStep === 'has' && "Select Pieces You Have"}
      </DialogTitle>
      
      <DialogContent>
        {/* Step instructions */}
        {selectionStep === 'puzzle' && (
          <Alert severity="info" sx={{ mb: 2, bgcolor: '#1a3a53', color: '#fff' }}>
            First, select a puzzle to start your trading post.
          </Alert>
        )}
        
        {selectionStep === 'need' && (
          <Alert severity="info" sx={{ mb: 2, bgcolor: '#1a3a53', color: '#fff' }}>
            Select ONE piece that you need from this puzzle.
          </Alert>
        )}
        
        {selectionStep === 'has' && (
          <Alert severity="info" sx={{ mb: 2, bgcolor: '#1a3a53', color: '#fff' }}>
            Now select one or more pieces that you have to offer. You can select multiple pieces.
          </Alert>
        )}

        {/* Puzzle selection step */}
        {selectionStep === 'puzzle' && (
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
                onClick={() => handlePuzzleSelect(puzzle)}
              >
                <img
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
        )}

        {/* Need piece selection step */}
        {selectionStep === 'need' && needPuzzle && (
          <Box>
            <Typography variant="h6" mb={2}>
              Select ONE piece you need from {needPuzzle.replace("-puzzle", "").toUpperCase()}
            </Typography>
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
                    border: needPiece === (idx + 1) ? '2px solid #4caf50' : '2px solid #333',
                    '&:hover': { boxShadow: 6, bgcolor: '#333' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                  onClick={() => handleNeedPieceSelect(idx + 1)}
                >
                  <img
                    src={`/bybit-puzzle-hunt/${needPuzzle}/${idx + 1}.png`}
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
          </Box>
        )}

        {/* Has pieces selection step */}
        {selectionStep === 'has' && (
          <Box>
            {/* Selected pieces summary */}
            <Box mb={3}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                Your selection:
              </Typography>
              <Box sx={{ bgcolor: '#1e1e1e', p: 2, borderRadius: 2, mb: 2 }}>
                <Typography variant="body2" color="#4caf50" fontWeight="bold">
                  You need: {needPuzzle?.replace("-puzzle", "").toUpperCase()} Piece {needPiece}
                </Typography>
                
                <Divider sx={{ my: 1, bgcolor: '#333' }} />
                
                <Typography variant="body2" color="#ff9800" fontWeight="bold" mb={1}>
                  You have: {hasPieces.length > 0 ? '' : 'No pieces selected yet'}
                </Typography>
                
                {hasPieces.length > 0 && (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {hasPieces.map((p, idx) => (
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
                  variant={hasPuzzle === puzzle ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => handlePuzzleSelect(puzzle)}
                  sx={{ textTransform: 'uppercase' }}
                >
                  {puzzle.replace("-puzzle", "")}
                </Button>
              ))}
            </Stack>

            {/* Piece selector for the selected "has" puzzle */}
            {hasPuzzle && (
              <Box>
                <Typography variant="subtitle1" mb={2}>
                  Select pieces you have from {hasPuzzle.replace("-puzzle", "").toUpperCase()}:
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
                    const isSelected = isPieceSelected(hasPuzzle, idx + 1);
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
                        onClick={() => handleHasPieceSelect(hasPuzzle, idx + 1)}
                      >
                        <img
                          src={`/bybit-puzzle-hunt/${hasPuzzle}/${idx + 1}.png`}
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
        {selectionStep !== 'puzzle' && (
          <Button onClick={handleBack} color="secondary" variant="outlined">
            Back
          </Button>
        )}
        
        <Box sx={{ ml: 'auto' }}>
          {selectionStep === 'has' && (
            <Button 
              onClick={handleSubmit} 
              color="primary" 
              variant="contained"
              disabled={hasPieces.length === 0}
            >
              Submit
            </Button>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

export default PuzzleSelector;
