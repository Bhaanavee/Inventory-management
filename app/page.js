'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Modal, TextField, Grid, Select, MenuItem, FormControl, InputLabel, AppBar, Toolbar } from '@mui/material';
import { firestore, auth } from '@/firebase.js'; // Ensure the correct path to firebase.js
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc, where } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Authentication from './Authentication.jsx'; // Ensure correct path

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function Home() {
  const [itemCategory, setItemCategory] = useState('');
  const [user, setUser] = useState(null);
  const categories = ['Baking', 'Beverages', 'Cereal', 'Dairy', 'Fruits', 'Meat', 'Miscellaneous', 'Vegetables', 'Oil', 'Processed food', 'Snacks', 'Spices'];
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async (userId) => {
    try {
      const snapshot = query(collection(firestore, 'inventory'), where('userId', '==', userId));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({ name: doc.id, ...doc.data() });
      });
      setInventory(inventoryList);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const addItem = async (item, category) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1, category, userId: user.uid });
      } else {
        await setDoc(docRef, { quantity: 1, category, userId: user.uid });
      }
      await updateInventory(user.uid);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1, userId: user.uid });
        }
      }
      await updateInventory(user.uid);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        updateInventory(user.uid);
      } else {
        setUser(null);
        setInventory([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredInventory = inventory.filter((item) =>
    item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box width="100%" minHeight="100vh" display="flex" flexDirection="column" alignItems="center" bgcolor="white" padding={2}>
      {user && (
        <Button variant="contained" color="secondary" onClick={handleSignOut} sx={{ position: 'absolute', top: 16, right: 16 }}>
          Sign Out
        </Button>
      )}
      {user ? (
        <>
          <TextField
            label="Search by Category"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ marginBottom: 2, maxWidth: '800px' }}
          />
          <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2" color="black" padding={1.5}>
                Add Item
              </Typography>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                sx={{ marginBottom: 2 }}
              />
              <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category-select"
                  value={itemCategory}
                  label="Category"
                  onChange={(e) => setItemCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => {
                  addItem(itemName, itemCategory);
                  setItemName('');
                  setItemCategory('');
                  handleClose();
                }}
              >
                Add
              </Button>
            </Box>
          </Modal>
          <Box width="100%" maxWidth="800px" overflow="auto" padding={2} marginTop={4}>
            <Typography variant="h4" color="#800080" textAlign="center" marginBottom={2}>
              INVENTORY ITEMS
            </Typography>
            <Grid container spacing={2}>
              {filteredInventory.map(({ name, quantity, category }) => (
                <Grid item xs={12} sm={6} md={4} key={name}>
                  <Box
                    bgcolor="#fff"
                    padding={2}
                    borderRadius={2}
                    boxShadow={2}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                  >
                    <Typography variant="h6" color="#000" marginBottom={1}>
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                    <Typography variant="body1" color="#666" marginBottom={1}>
                      Category: {category}
                    </Typography>
                    <Typography variant="body1" color="#666" marginBottom={1}>
                      Quantity: {quantity}
                    </Typography>
                    <Button variant="outlined" color="secondary" onClick={() => removeItem(name)} fullWidth>
                      Remove
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Button variant="contained" color="secondary" onClick={handleOpen} sx={{ marginTop: 2 }}>
            Add New Item
          </Button>
        </>
      ) : (
        <Authentication setUser={setUser} />
      )}
    </Box>
  );
}
