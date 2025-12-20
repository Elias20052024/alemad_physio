import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { adminService } from '@services/apiService.js';

const ResetUserPassword = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [resetLoading, setResetLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setMessage({ type: 'success', text: `Loaded ${data.length} users` });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to load users' });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', text: 'Error loading users' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetClick = (user) => {
    setSelectedUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleResetPassword = async () => {
    // Validation
    if (!newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Both password fields are required' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    try {
      setResetLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/reset-user-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          newPassword: newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: `Password reset successfully for ${selectedUser.name}` 
        });
        handleCloseDialog();
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
      } else {
        setMessage({ 
          type: 'error', 
          text: data.message || 'Failed to reset password' 
        });
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage({ type: 'error', text: 'Error resetting password' });
    } finally {
      setResetLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#2D89B3', fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
        Reset User Passwords
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search by name or email"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Total Users: {filteredUsers.length}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.name}</TableCell>
                    <TableCell sx={{ fontSize: '0.85rem' }}>{user.email}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          display: 'inline-block',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '20px',
                          backgroundColor: user.role === 'patient' ? '#E3F2FD' : '#F3E5F5',
                          color: user.role === 'patient' ? '#2D89B3' : '#7B1FA2',
                          fontWeight: 'bold',
                          fontSize: '0.8rem'
                        }}
                      >
                        {user.role}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.85rem' }}>
                      {user.role === 'patient' 
                        ? user.patient?.phone || 'N/A'
                        : user.therapist?.phone || 'N/A'
                      }
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Tooltip title="Reset Password">
                        <IconButton
                          size="small"
                          onClick={() => handleResetClick(user)}
                          sx={{
                            color: '#ff9800',
                            '&:hover': { backgroundColor: '#fff3e0' }
                          }}
                        >
                          <RestartAltIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">No users found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Mobile Card View */}
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Paper
              key={user.id}
              sx={{
                p: 2,
                mb: 2,
                borderLeft: `4px solid ${user.role === 'patient' ? '#2D89B3' : '#7B1FA2'}`
              }}
            >
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {user.name}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="textSecondary" sx={{ wordBreak: 'break-all' }}>
                    {user.email}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    sx={{
                      display: 'inline-block',
                      px: 1,
                      py: 0.5,
                      borderRadius: '15px',
                      backgroundColor: user.role === 'patient' ? '#E3F2FD' : '#F3E5F5',
                      color: user.role === 'patient' ? '#2D89B3' : '#7B1FA2',
                      fontWeight: 'bold',
                      fontSize: '0.75rem'
                    }}
                  >
                    {user.role}
                  </Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="textSecondary">
                    {user.role === 'patient' 
                      ? user.patient?.phone || 'N/A'
                      : user.therapist?.phone || 'N/A'
                    }
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'right', pt: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<RestartAltIcon />}
                    onClick={() => handleResetClick(user)}
                    sx={{
                      backgroundColor: '#ff9800',
                      '&:hover': { backgroundColor: '#f57c00' }
                    }}
                  >
                    Reset Password
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">No users found</Typography>
          </Paper>
        )}
      </Box>

      {/* Reset Password Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#2D89B3' }}>
          Reset Password for {selectedUser?.name}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Email: {selectedUser?.email}
          </Typography>
          <TextField
            fullWidth
            type="password"
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            variant="outlined"
            helperText="Minimum 6 characters"
            inputProps={{ autoComplete: 'new-password' }}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            variant="outlined"
            inputProps={{ autoComplete: 'new-password' }}
          />
          <Alert severity="warning" sx={{ mt: 2 }}>
            The user's current password will be replaced with the new password.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCloseDialog} disabled={resetLoading} fullWidth>
            Cancel
          </Button>
          <Button
            onClick={handleResetPassword}
            variant="contained"
            sx={{ backgroundColor: '#2D89B3' }}
            disabled={resetLoading}
            fullWidth
          >
            {resetLoading ? <CircularProgress size={24} /> : 'Reset Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ResetUserPassword;
