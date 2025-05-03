"use client";
import React from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Typography,
  Box,
} from "@mui/material";

interface PuzzlePiece {
  puzzle: string;
  pieceNumber: number;
  selected: boolean;
}

interface TradingCardProps {
  user: string;
  avatar: React.ReactNode;
  has: string;
  needs: string;
  onContactClick: (user: string) => void;
  puzzlePieces?: PuzzlePiece[];
  onDelete?: () => void;
}

const TradingCard: React.FC<TradingCardProps> = ({
  user,
  avatar,
  has,
  needs,
  onContactClick,
  puzzlePieces = [],
  onDelete,
}) => {
  return (
    <Card
      sx={{
        bgcolor: "#181C24",
        color: "#fff",
        borderRadius: 3,
        boxShadow: 6,
        minHeight: 220,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: "1px solid #333",
      }}
    >
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: "#1976d2" }}>{avatar}</Avatar>}
        title={
          <Typography variant="h6" sx={{ color: "#fff" }}>
            {user}
          </Typography>
        }
        sx={{ pb: 0 }}
      />
      <CardContent>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
          width: '100%'
        }}>
          {/* Has Section */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: "#90caf9" }}
              gutterBottom
            >
              Has:
            </Typography>
            
            {/* Parse and render the has pieces */}
            {(() => {
              // Define the render function inside the IIFE
              const renderPuzzleGroups = (puzzleGroups: Record<string, Array<{ pieceNumber: number; count: number }>>) => {
                return (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {Object.entries(puzzleGroups).map(([puzzleType, pieces]) => {
                      const puzzleName = puzzleType.split('-')[0].toUpperCase();
                      
                      return (
                        <Box key={puzzleType} sx={{ width: '100%' }}>
                          <Typography variant="body2" sx={{ color: "#fff", fontWeight: "bold", mb: 1 }}>
                            {puzzleName} Puzzle:
                          </Typography>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 1,
                            justifyContent: 'center'
                          }}>
                            {pieces.map(({ pieceNumber, count }) => (
                              <Box
                                key={pieceNumber}
                                sx={{
                                  position: 'relative',
                                  border: '1px solid #4caf50',
                                  borderRadius: 1,
                                  p: 0.5,
                                  backgroundColor: 'transparent',
                                  width: 45,
                                  height: 45,
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                }}
                              >
                                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                                  <Image
                                    src={`/bybit-puzzle-hunt/${puzzleType}/${pieceNumber}.png`}
                                    alt={`Piece ${pieceNumber}`}
                                    width={100}
                                    height={100}
                                    style={{
                                      borderRadius: 2,
                                      objectFit: 'cover',
                                      width: '100%',
                                      height: '100%',
                                    }}
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.onerror = null;
                                      target.style.display = 'none';
                                      const parent = target.parentElement;
                                      if (parent) {
                                        parent.style.display = 'flex';
                                        parent.style.alignItems = 'center';
                                        parent.style.justifyContent = 'center';
                                        parent.style.backgroundColor = '#1e1e1e';
                                        parent.textContent = `${pieceNumber}`;
                                        parent.style.color = '#4caf50';
                                        parent.style.fontWeight = 'bold';
                                      }
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      bottom: -2,
                                      left: 0,
                                      right: 0,
                                      backgroundColor: 'rgba(0,0,0,0.6)',
                                      color: '#fff',
                                      fontSize: '0.6rem',
                                      fontWeight: 'bold',
                                      textAlign: 'center',
                                      borderRadius: '0 0 2px 2px',
                                      padding: '1px 0',
                                    }}
                                  >
                                    #{pieceNumber}
                                  </Box>
                                </Box>
                                {count > 1 && (
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: -5,
                                      right: -5,
                                      backgroundColor: '#4caf50',
                                      color: '#fff',
                                      borderRadius: '50%',
                                      width: 18,
                                      height: 18,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.6rem',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    {count}
                                  </Box>
                                )}
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                );
              };
              
              // If we have the puzzlePieces prop with selected pieces, use that
              if (puzzlePieces && puzzlePieces.length > 0) {
                // Group pieces by puzzle and piece number
                const groupedPieces: Record<string, { count: number; piece: PuzzlePiece }> = {};
                
                puzzlePieces.filter(p => p.selected).forEach(piece => {
                  const key = `${piece.puzzle}-${piece.pieceNumber}`;
                  if (groupedPieces[key]) {
                    groupedPieces[key].count += 1;
                  } else {
                    groupedPieces[key] = { count: 1, piece };
                  }
                });
                
                // If no selected pieces
                if (Object.keys(groupedPieces).length === 0) {
                  return (
                    <Typography variant="body1" sx={{ color: "#fff", textAlign: "center" }}>
                      No pieces selected
                    </Typography>
                  );
                }
                
                // Group by puzzle type for display
                const puzzleGroups: Record<string, Array<{ pieceNumber: number; count: number }>> = {};
                
                Object.values(groupedPieces).forEach(({ piece, count }) => {
                  const puzzleType = piece.puzzle;
                  if (!puzzleGroups[puzzleType]) {
                    puzzleGroups[puzzleType] = [];
                  }
                  puzzleGroups[puzzleType].push({ pieceNumber: piece.pieceNumber, count });
                });
                
                return renderPuzzleGroups(puzzleGroups);
              }
              
              // Otherwise parse the has string (e.g., "USDT#1, VET#3, XAUT#5")
              try {
                const hasPieces = has.split(',').map(piece => piece.trim());
                const puzzleGroups: Record<string, Array<{ pieceNumber: number; count: number }>> = {};
                
                hasPieces.forEach(pieceStr => {
                  // Match format like "USDT#3" or "VET#7"
                  const match = pieceStr.match(/([A-Z]+)#(\d+)/);
                  if (match) {
                    const puzzleName = match[1];
                    const pieceNumber = parseInt(match[2]);
                    const puzzleType = puzzleName.toLowerCase() + "-puzzle";
                    
                    if (!puzzleGroups[puzzleType]) {
                      puzzleGroups[puzzleType] = [];
                    }
                    
                    // Check if this piece is already in the group (for counting duplicates)
                    const existingPiece = puzzleGroups[puzzleType].find(p => p.pieceNumber === pieceNumber);
                    if (existingPiece) {
                      existingPiece.count += 1;
                    } else {
                      puzzleGroups[puzzleType].push({ pieceNumber, count: 1 });
                    }
                  }
                });
                
                if (Object.keys(puzzleGroups).length > 0) {
                  return renderPuzzleGroups(puzzleGroups);
                }
                
                // Fallback if parsing fails
                return (
                  <Typography variant="body1" sx={{ mb: 2, color: "#fff" }}>
                    {has}
                  </Typography>
                );
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (_error) {
                return (
                  <Typography variant="body1" sx={{ mb: 2, color: "#fff" }}>
                    {has}
                  </Typography>
                );
              }
            })()}
          </Box>
          
          {/* Needs Section */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: "#f48fb1" }}
              gutterBottom
            >
              Needs:
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              {/* Parse the needs string to extract puzzle type and piece number */}
              {(() => {
                // Parse the needs string (e.g., "USDT Piece 3" or "VET#3")
                const needsMatch = needs.match(/([A-Z]+)(?:[ #]+)(\d+)/);
                
                if (!needsMatch) {
                  return (
                    <Typography variant="body1" sx={{ mb: 2, color: "#fff" }}>
                      {needs}
                    </Typography>
                  );
                }
                
                const puzzleType = needsMatch[1].toLowerCase() + "-puzzle";
                const pieceNumber = parseInt(needsMatch[2]);
                
                return (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gridTemplateRows: 'repeat(3, 1fr)',
                      gap: 0.5,
                      width: '100%',
                      maxWidth: 150,
                      mx: 'auto',
                      mt: 1
                    }}
                  >
                    {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => {
                      const isNeededPiece = num === pieceNumber;
                      
                      return (
                        <Box
                          key={num}
                          sx={{
                            position: 'relative',
                            border: isNeededPiece ? '2px solid #4caf50' : '1px solid transparent',
                            borderRadius: 1,
                            p: 0.25,
                            transition: 'all 0.2s',
                            backgroundColor: isNeededPiece ? 'transparent' : 'rgba(0,0,0,0.7)',
                            aspectRatio: '1/1',
                            overflow: 'hidden',
                          }}
                        >
                          <Image
                            src={`/bybit-puzzle-hunt/${puzzleType}/${num}.png`}
                            alt={`Piece ${num}`}
                            width={50}
                            height={50}
                            style={{
                              borderRadius: 2,
                              objectFit: 'cover',
                              width: '100%',
                              height: '100%',
                              opacity: isNeededPiece ? 1 : 0.4,
                              filter: isNeededPiece ? 'none' : 'grayscale(80%)',
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.style.display = 'flex';
                                parent.style.alignItems = 'center';
                                parent.style.justifyContent = 'center';
                                parent.style.backgroundColor = '#1e1e1e';
                                parent.textContent = `${num}`;
                                parent.style.color = isNeededPiece ? '#4caf50' : '#666';
                                parent.style.fontWeight = 'bold';
                              }
                            }}
                          />
                          {isNeededPiece && (
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                backgroundColor: 'rgba(76,175,80,0.7)',
                                color: '#fff',
                                fontSize: '0.6rem',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                padding: '1px 0',
                              }}
                            >
                              NEED
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                );
              })()}
            </Box>
          </Box>
        </Box>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 1, mb: 1, borderRadius: 2, flexGrow: 1 }}
          onClick={() => onContactClick(user)}
        >
          Contact
        </Button>
        {onDelete && (
          <Button
            variant="outlined"
            color="error"
            sx={{ mb: 1, ml: 1, borderRadius: 2 }}
            onClick={onDelete}
            size="small"
          >
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default TradingCard;
